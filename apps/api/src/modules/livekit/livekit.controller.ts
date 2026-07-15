import { Controller, Post, Body, UseGuards, ForbiddenException } from '@nestjs/common'
import { z } from 'zod'
import { LivekitService } from './livekit.service'
import { PrismaService } from '../prisma/prisma.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'

const CallTokenSchema = z.object({
  conversationId: z.string().uuid(),
})
type CallTokenInput = z.infer<typeof CallTokenSchema>

@Controller('livekit')
@UseGuards(JwtAuthGuard)
export class LivekitController {
  constructor(
    private readonly livekit: LivekitService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Mint a LiveKit token for the caller to join the room of a conversation
   * they are a member of. Room name is derived from the conversation id.
   */
  @Post('token')
  async getToken(
    @CurrentUser('id') userId: string,
    @Body(new ZodValidationPipe(CallTokenSchema)) body: CallTokenInput,
  ) {
    const member = await this.prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId: body.conversationId, userId } },
    })
    if (!member || member.isDeleted) {
      throw new ForbiddenException({
        code: 'NOT_A_MEMBER',
        message: 'You are not a member of this conversation',
      })
    }

    // Carry the display name so group-call tiles can label participants
    const profile = await this.prisma.profile.findUnique({
      where: { id: userId },
      select: { displayName: true },
    })

    return this.livekit.mintToken(userId, `call:${body.conversationId}`, {
      canPublish: true,
      name: profile?.displayName ?? undefined,
    })
  }
}
