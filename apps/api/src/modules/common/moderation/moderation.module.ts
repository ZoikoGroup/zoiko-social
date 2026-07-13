import { Global, Module } from '@nestjs/common'
import { ProfanityService } from './profanity.service'

@Global()
@Module({
  providers: [ProfanityService],
  exports: [ProfanityService],
})
export class ModerationModule {}
