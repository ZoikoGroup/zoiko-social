import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { aiThreadHint } from './ai-thread-hint'

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Favorites ──────────────────────────────────────────────────────────────

  async addFavorite(userId: string, contactId: string, note?: string): Promise<void> {
    const existing = await this.prisma.favoriteContact.findUnique({
      where: { userId_contactId: { userId, contactId } },
    })
    if (existing) throw new ConflictException({ code: 'ALREADY_FAVORITE', message: 'Already a favorite contact' })

    await this.prisma.favoriteContact.create({
      data: { userId, contactId, note },
    })
  }

  async removeFavorite(userId: string, contactId: string): Promise<void> {
    await this.prisma.favoriteContact.deleteMany({
      where: { userId, contactId },
    })
  }

  async getFavorites(userId: string) {
    return this.prisma.favoriteContact.findMany({
      where: { userId },
      include: {
        contact: {
          select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }

  // ── Pin / Unpin ────────────────────────────────────────────────────────────

  async pinConversation(userId: string, conversationId: string): Promise<void> {
    const member = await this.prisma.conversationMember.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    })
    if (!member) throw new NotFoundException({ code: 'NOT_MEMBER', message: 'Not a member of this conversation' })

    await this.prisma.pinnedChat.upsert({
      where: { userId_conversationId: { userId, conversationId } },
      create: { userId, conversationId },
      update: { pinnedAt: new Date() },
    })
  }

  async unpinConversation(userId: string, conversationId: string): Promise<void> {
    await this.prisma.pinnedChat.deleteMany({
      where: { userId, conversationId },
    })
  }

  // ── Mute / Unmute ──────────────────────────────────────────────────────────

  async muteConversation(userId: string, conversationId: string, until?: Date): Promise<void> {
    await this.prisma.conversationSetting.upsert({
      where: { conversationId_userId: { conversationId, userId } },
      create: { conversationId, userId, isMuted: true, mutedUntil: until },
      update: { isMuted: true, mutedUntil: until },
    })
  }

  async unmuteConversation(userId: string, conversationId: string): Promise<void> {
    await this.prisma.conversationSetting.updateMany({
      where: { conversationId, userId },
      data: { isMuted: false, mutedUntil: null },
    })
  }

  // ── Archive / Restore ──────────────────────────────────────────────────────

  async archiveConversation(userId: string, conversationId: string): Promise<void> {
    await this.prisma.conversationSetting.upsert({
      where: { conversationId_userId: { conversationId, userId } },
      create: { conversationId, userId, isArchived: true },
      update: { isArchived: true },
    })
  }

  async restoreConversation(userId: string, conversationId: string): Promise<void> {
    await this.prisma.conversationSetting.updateMany({
      where: { conversationId, userId },
      data: { isArchived: false },
    })
  }

  // ── Block / Unblock ────────────────────────────────────────────────────────

  async blockUser(userId: string, targetId: string): Promise<void> {
    if (userId === targetId) return
    await this.prisma.blockedUser.upsert({
      where: { blockerId_blockedId: { blockerId: userId, blockedId: targetId } },
      create: { blockerId: userId, blockedId: targetId },
      update: {},
    })
  }

  async unblockUser(userId: string, targetId: string): Promise<void> {
    await this.prisma.blockedUser.deleteMany({
      where: { blockerId: userId, blockedId: targetId },
    })
  }

  // ── Delete Conversation ────────────────────────────────────────────────────

  async deleteConversation(userId: string, conversationId: string): Promise<void> {
    // Soft-delete: mark the member as deleted
    await this.prisma.conversationMember.updateMany({
      where: { conversationId, userId },
      data: { isDeleted: true, deletedAt: new Date() },
    })

    // The inbox caches "this member already has an assistant thread" to save a
    // query per load. Deleting a conversation can be that thread, so the cached
    // answer stops being true here. Cleared unconditionally rather than checking
    // whether this was the assistant: the check would cost the query this is
    // meant to save, and a wrong hint only costs one lookup next load.
    aiThreadHint.forget(userId)
  }

  async clearConversation(userId: string, conversationId: string): Promise<void> {
    // Delete all messages sent by the user in this conversation
    await this.prisma.message.updateMany({
      where: { conversationId, senderId: userId },
      data: { isDeleted: true, deletedForEveryone: false },
    })
  }
}
