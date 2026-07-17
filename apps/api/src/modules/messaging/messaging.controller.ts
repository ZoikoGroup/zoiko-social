import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { MessagingService } from './messaging.service'
import { ContactService } from './contact.service'
import { MessageRequestService } from './message-request.service'
import { GroupService } from './group.service'
import { ProfessionalMessagingService } from './professional-messaging.service'
import {
  CreateConversationSchema,
  SendMessageSchema,
  EditMessageSchema,
  ReactToMessageSchema,
  MarkReadBodySchema,
  AddGroupMembersSchema,
  CreateGroupSchema,
  SendMessageRequestSchema,
  UpdatePrivacySchema,
  UpdateProfessionalMessagingSchema,
  type CreateConversationInput,
  type SendMessageInput,
  type EditMessageInput,
  type ReactToMessageInput,
  type MarkReadBodyInput,
  type AddGroupMembersInput,
  type CreateGroupInput,
  type SendMessageRequestInput,
  type UpdatePrivacyInput,
  type UpdateProfessionalMessagingInput,
} from './dto/index'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'
import { RateLimit } from '../common/decorators/rate-limit.decorator'

@Controller('messaging')
@UseGuards(JwtAuthGuard)
export class MessagingController {
  constructor(
    private readonly messagingService: MessagingService,
    private readonly contactService: ContactService,
    private readonly messageRequestService: MessageRequestService,
    private readonly groupService: GroupService,
    private readonly professionalMessaging: ProfessionalMessagingService,
  ) {}

  // ── CONVERSATIONS ──────────────────────────────────────────────────────────

  @Get('conversations')
  async getConversations(
    @CurrentUser() user: AuthenticatedUser,
    @Query('cursor') cursor?: string,
  ) {
    const result = await this.messagingService.getConversations(user.id, cursor ?? null)
    return result
  }

  @Post('conversations')
  @RateLimit({ limit: 30, windowSeconds: 60, prefix: 'conversation.create' })
  @HttpCode(HttpStatus.CREATED)
  async createConversation(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(CreateConversationSchema)) body: CreateConversationInput,
  ) {
    const conv = await this.messagingService.getOrCreateConversation(
      user.id,
      body.participantId,
      body.initialMessage,
    )
    return conv
  }

  // Static path — declared before the `:id` routes so it isn't captured as an id.
  @Post('conversations/read-all')
  @HttpCode(HttpStatus.OK)
  async markAllRead(@CurrentUser() user: AuthenticatedUser) {
    await this.messagingService.markAllConversationsRead(user.id)
    return { success: true }
  }

  @Get('conversations/:id')
  async getConversation(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.messagingService.getConversationById(user.id, id)
  }

  @Delete('conversations/:id')
  @HttpCode(HttpStatus.OK)
  async deleteConversation(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    await this.contactService.deleteConversation(user.id, id)
    return { success: true }
  }

  @Post('conversations/:id/clear')
  @HttpCode(HttpStatus.OK)
  async clearConversation(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    await this.contactService.clearConversation(user.id, id)
    return { success: true }
  }

  // ── MESSAGES ───────────────────────────────────────────────────────────────

  @Get('conversations/:id/messages')
  async getMessages(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Query('cursor') cursor?: string,
  ) {
    const result = await this.messagingService.getMessages(user.id, id, cursor ?? null)
    return result
  }

  @Post('conversations/:id/messages')
  @RateLimit({ limit: 60, windowSeconds: 60, prefix: 'message.send' })
  @HttpCode(HttpStatus.CREATED)
  async sendMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(SendMessageSchema)) body: SendMessageInput,
  ) {
    const msg = await this.messagingService.sendMessage(user.id, id, body)
    return msg
  }

  @Patch('messages/:id')
  async editMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(EditMessageSchema)) body: EditMessageInput,
  ) {
    await this.messagingService.editMessage(user.id, id, body.body)
    return { success: true }
  }

  @Delete('messages/:id')
  @HttpCode(HttpStatus.OK)
  async deleteMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Query('forEveryone') forEveryone?: string,
  ) {
    await this.messagingService.deleteMessage(user.id, id, forEveryone === 'true')
    return { success: true }
  }

  @Post('messages/:id/reactions')
  @HttpCode(HttpStatus.CREATED)
  async reactToMessage(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(ReactToMessageSchema)) body: ReactToMessageInput,
  ) {
    await this.messagingService.reactToMessage(user.id, id, body.emoji)
    return { success: true }
  }

  @Post('conversations/:id/read')
  @HttpCode(HttpStatus.OK)
  async markRead(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(MarkReadBodySchema)) body: MarkReadBodyInput,
  ) {
    await this.messagingService.markConversationRead(user.id, id, body?.lastReadMessageId)
    return { success: true }
  }

  // ── SUGGESTIONS ────────────────────────────────────────────────────────────

  @Get('suggestions')
  async getSuggestions(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limit?: string,
  ) {
    const suggestions = await this.messagingService.getSuggestions(
      user.id,
      limit ? parseInt(limit, 10) : 10,
    )
    return suggestions
  }

  // ── SEARCH ─────────────────────────────────────────────────────────────────

  @Get('search')
  async searchMessages(
    @CurrentUser() user: AuthenticatedUser,
    @Query('q') q: string,
    @Query('conversationId') conversationId?: string,
  ) {
    if (!q || q.length < 2) return []
    const results = await this.messagingService.searchMessages(user.id, q, conversationId)
    return results
  }

  @Get('search/users')
  async searchUsers(
    @CurrentUser() user: AuthenticatedUser,
    @Query('q') q: string,
    @Query('limit') limit?: string,
  ) {
    if (!q || q.length < 2) return []
    const take = Math.min(limit ? parseInt(limit, 10) : 10, 20)

    const profiles = await this.messagingService.searchProfiles(user.id, q, take)
    return profiles
  }

  // ── UNREAD ─────────────────────────────────────────────────────────────────

  @Get('unread')
  async getUnreadCounts(@CurrentUser() user: AuthenticatedUser) {
    const counts = await this.messagingService.getUnreadCounts(user.id)
    return counts
  }

  // ── MESSAGE REQUESTS ───────────────────────────────────────────────────────

  @Get('requests')
  async getMessageRequests(@CurrentUser() user: AuthenticatedUser) {
    const requests = await this.messagingService.getMessageRequests(user.id)
    return requests
  }

  @Post('requests')
  @HttpCode(HttpStatus.CREATED)
  async sendMessageRequest(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(SendMessageRequestSchema)) body: SendMessageRequestInput,
  ) {
    await this.messagingService.createMessageRequest(user.id, body.recipientId, body.message)
    return { success: true }
  }

  @Post('requests/:id/accept')
  @HttpCode(HttpStatus.OK)
  async acceptMessageRequest(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    await this.messagingService.acceptMessageRequest(user.id, id)
    return { success: true }
  }

  @Post('requests/:id/reject')
  @HttpCode(HttpStatus.OK)
  async rejectMessageRequest(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    await this.messagingService.rejectMessageRequest(user.id, id)
    return { success: true }
  }

  // ── CONTACTS ───────────────────────────────────────────────────────────────

  @Get('favorites')
  async getFavorites(@CurrentUser() user: AuthenticatedUser) {
    const favorites = await this.contactService.getFavorites(user.id)
    return favorites
  }

  @Post('favorites/:contactId')
  @HttpCode(HttpStatus.CREATED)
  async addFavorite(
    @CurrentUser() user: AuthenticatedUser,
    @Param('contactId') contactId: string,
    @Body('note') note?: string,
  ) {
    await this.contactService.addFavorite(user.id, contactId, note)
    return { success: true }
  }

  @Delete('favorites/:contactId')
  @HttpCode(HttpStatus.OK)
  async removeFavorite(
    @CurrentUser() user: AuthenticatedUser,
    @Param('contactId') contactId: string,
  ) {
    await this.contactService.removeFavorite(user.id, contactId)
    return { success: true }
  }

  // ── PIN / MUTE / ARCHIVE ───────────────────────────────────────────────────

  @Post('conversations/:id/pin')
  @HttpCode(HttpStatus.OK)
  async pinConversation(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    await this.contactService.pinConversation(user.id, id)
    return { success: true }
  }

  @Delete('conversations/:id/pin')
  @HttpCode(HttpStatus.OK)
  async unpinConversation(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    await this.contactService.unpinConversation(user.id, id)
    return { success: true }
  }

  @Post('conversations/:id/mute')
  @HttpCode(HttpStatus.OK)
  async muteConversation(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Query('until') until?: string,
  ) {
    await this.contactService.muteConversation(
      user.id,
      id,
      until ? new Date(until) : undefined,
    )
    return { success: true }
  }

  @Delete('conversations/:id/mute')
  @HttpCode(HttpStatus.OK)
  async unmuteConversation(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    await this.contactService.unmuteConversation(user.id, id)
    return { success: true }
  }

  @Post('conversations/:id/archive')
  @HttpCode(HttpStatus.OK)
  async archiveConversation(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    await this.contactService.archiveConversation(user.id, id)
    return { success: true }
  }

  @Delete('conversations/:id/archive')
  @HttpCode(HttpStatus.OK)
  async restoreConversation(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    await this.contactService.restoreConversation(user.id, id)
    return { success: true }
  }

  // ── BLOCK / UNBLOCK ────────────────────────────────────────────────────────

  @Post('block/:userId')
  @HttpCode(HttpStatus.OK)
  async blockUser(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') targetId: string,
  ) {
    await this.contactService.blockUser(user.id, targetId)
    return { success: true }
  }

  @Delete('block/:userId')
  @HttpCode(HttpStatus.OK)
  async unblockUser(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') targetId: string,
  ) {
    await this.contactService.unblockUser(user.id, targetId)
    return { success: true }
  }

  // ── GROUPS ─────────────────────────────────────────────────────────────────

  @Post('groups')
  @RateLimit({ limit: 10, windowSeconds: 3600, prefix: 'group.create' })
  @HttpCode(HttpStatus.CREATED)
  async createGroup(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(CreateGroupSchema)) body: CreateGroupInput,
  ) {
    const group = await this.groupService.createGroup(user.id, body)
    return group
  }

  @Get('groups/:id')
  async getGroup(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    const group = await this.groupService.getGroup(user.id, id)
    return group
  }

  @Patch('groups/:id')
  async updateGroup(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: { name?: string; description?: string; coverImageUrl?: string },
  ) {
    const group = await this.groupService.updateGroup(user.id, id, body)
    return group
  }

  @Post('groups/:id/members')
  @HttpCode(HttpStatus.OK)
  async addMembers(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(AddGroupMembersSchema)) body: AddGroupMembersInput,
  ) {
    await this.groupService.addMembers(user.id, id, body.userIds)
    return { success: true }
  }

  @Delete('groups/:id/members/:userId')
  @HttpCode(HttpStatus.OK)
  async removeMember(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Param('userId') targetId: string,
  ) {
    await this.groupService.removeMember(user.id, id, targetId)
    return { success: true }
  }

  @Post('groups/:id/leave')
  @HttpCode(HttpStatus.OK)
  async leaveGroup(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    await this.groupService.leaveGroup(user.id, id)
    return { success: true }
  }

  // ── PROFESSIONAL MESSAGING ─────────────────────────────────────────────────

  @Get('professional/settings')
  async getProfessionalSettings(@CurrentUser() user: AuthenticatedUser) {
    const settings = await this.professionalMessaging.getSettings(user.id)
    return settings
  }

  @Patch('professional/settings')
  async updateProfessionalSettings(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(UpdateProfessionalMessagingSchema)) body: UpdateProfessionalMessagingInput,
  ) {
    const settings = await this.professionalMessaging.updateSettings(user.id, body)
    return settings
  }

  // ── PRIVACY ────────────────────────────────────────────────────────────────

  @Get('privacy')
  async getPrivacy(@CurrentUser() user: AuthenticatedUser) {
    const privacy = await this.messageRequestService.getPrivacySettings(user.id)
    return privacy
  }

  @Patch('privacy')
  async updatePrivacy(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(UpdatePrivacySchema)) body: UpdatePrivacyInput,
  ) {
    const privacy = await this.messageRequestService.updatePrivacySettings(user.id, body)
    return privacy
  }

  // ── UPLOAD ─────────────────────────────────────────────────────────────────

  @Post('upload/presigned')
  @HttpCode(HttpStatus.OK)
  async getPresignedUploadUrl(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: { mimeType: string; fileName?: string; fileSize?: number; durationSeconds?: number },
  ) {
    const result = await this.messagingService.getUploadUrl(
      user.id,
      body.mimeType,
      body.fileName,
      body.fileSize,
      body.durationSeconds,
    )
    return result
  }
}
