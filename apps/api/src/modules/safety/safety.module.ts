import { Module } from '@nestjs/common'
import { SafetyController } from './safety.controller'
import { SafetyService } from './safety.service'
import { WeatherClient } from './weather.client'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [SafetyController],
  providers: [SafetyService, WeatherClient],
  exports: [SafetyService],
})
export class SafetyModule {}
