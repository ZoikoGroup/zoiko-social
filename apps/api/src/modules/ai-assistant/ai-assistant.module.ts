import { Module } from '@nestjs/common'
import { AiAssistantService } from './ai-assistant.service'
import { GroqClient } from './groq.client'
import { AiRateLimiter } from './rate-limiter'
import { PetToolExecutor } from './pet-tool-executor.service'
import { PetsModule } from '../pets/pets.module'

/**
 * No controllers: the assistant has no HTTP surface of its own. Members reach it
 * through the normal messaging endpoints, which is what makes the thread behave
 * like any other conversation. PrismaModule, DatabaseModule (Supabase admin
 * client), ModerationModule (ProfanityService), AuditLogModule and
 * RealtimeModule are all @Global(), so they need no import here.
 *
 * PetsModule is imported so assistant actions run through PetsService, whose
 * per-pet ownership checks are what keep the model confined to the member's own
 * animals.
 */
@Module({
  imports: [PetsModule],
  providers: [AiAssistantService, GroqClient, AiRateLimiter, PetToolExecutor],
  exports: [AiAssistantService],
})
export class AiAssistantModule {}
