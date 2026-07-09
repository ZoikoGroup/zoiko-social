import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ProfessionalMessagingService {
  private readonly logger = new Logger(ProfessionalMessagingService.name)

  constructor(private readonly prisma: PrismaService) {}

  async getSettings(userId: string) {
    let settings = await this.prisma.professionalMessagingSetting.findUnique({
      where: { userId },
    })

    if (!settings) {
      settings = await this.prisma.professionalMessagingSetting.create({
        data: { userId },
      })
    }

    return {
      greetingEnabled: settings.greetingEnabled,
      greetingMessage: settings.greetingMessage,
      awayMessageEnabled: settings.awayMessageEnabled,
      awayMessage: settings.awayMessage,
      awayMessageSchedule: settings.awayMessageSchedule,
      businessHoursEnabled: settings.businessHoursEnabled,
      businessHours: settings.businessHours,
      autoReplyEnabled: settings.autoReplyEnabled,
      autoReplyMessage: settings.autoReplyMessage,
      quickReplies: settings.quickReplies as Array<{ shortcut: string; message: string }> | null,
      serviceInquiryEnabled: settings.serviceInquiryEnabled,
      productInquiryEnabled: settings.productInquiryEnabled,
      appointmentEnabled: settings.appointmentEnabled,
    }
  }

  async updateSettings(userId: string, input: Record<string, unknown>) {
    await this.prisma.professionalMessagingSetting.upsert({
      where: { userId },
      create: { userId, ...input } as never,
      update: input as never,
    })

    return this.getSettings(userId)
  }

  async getGreeting(userId: string): Promise<string | null> {
    const settings = await this.prisma.professionalMessagingSetting.findUnique({
      where: { userId },
      select: { greetingEnabled: true, greetingMessage: true },
    })
    if (settings?.greetingEnabled && settings.greetingMessage) {
      return settings.greetingMessage
    }
    return null
  }

  async getAwayMessage(userId: string): Promise<string | null> {
    const settings = await this.prisma.professionalMessagingSetting.findUnique({
      where: { userId },
      select: { awayMessageEnabled: true, awayMessage: true, awayMessageSchedule: true },
    })
    if (settings?.awayMessageEnabled && settings.awayMessage) {
      // Check schedule if applicable
      return settings.awayMessage
    }
    return null
  }

  async getQuickReplies(userId: string): Promise<Array<{ shortcut: string; message: string }>> {
    const settings = await this.prisma.professionalMessagingSetting.findUnique({
      where: { userId },
      select: { quickReplies: true },
    })
    return (settings?.quickReplies as Array<{ shortcut: string; message: string }>) ?? []
  }
}
