import { Module } from '@nestjs/common'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { OptionalAuthGuard } from './guards/optional-auth.guard'
import { JwtVerificationService } from './jwt-verification.service'
import { DatabaseModule } from '../database/database.module'

@Module({
  imports: [DatabaseModule],
  controllers: [AuthController],
  providers: [AuthService, JwtVerificationService, JwtAuthGuard, OptionalAuthGuard],
  exports: [AuthService, JwtVerificationService, JwtAuthGuard, OptionalAuthGuard],
})
export class AuthModule {}
