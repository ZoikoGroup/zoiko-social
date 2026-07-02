import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { OptionalAuthGuard } from './guards/optional-auth.guard'

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, OptionalAuthGuard],
  exports: [AuthService, JwtAuthGuard, OptionalAuthGuard],
})
export class AuthModule {}
