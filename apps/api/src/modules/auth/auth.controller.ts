import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { z } from 'zod'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { OptionalAuthGuard } from './guards/optional-auth.guard'
import { CurrentUser } from './decorators/current-user.decorator'
import type { AuthenticatedUser } from './guards/jwt-auth.guard'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'

// ── Validation Schemas ─────────────────────────────────────────────────────

const RegisterSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  displayName: z.string().min(1).max(50).optional(),
})

const LoginSchema = z
  .object({
    // Accepts email, username, or phone number
    identifier: z.string().min(1).max(255).optional(),
    // Back-compat: older clients send `email`
    email: z.string().min(1).max(255).optional(),
    password: z.string().min(1, 'Password is required'),
  })
  .refine((body) => body.identifier || body.email, {
    message: 'Email, username, or phone is required',
    path: ['identifier'],
  })

const RefreshSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
})

const ForgotPasswordSchema = z.object({
  email: z.string().email('Valid email is required'),
})

const ResetPasswordSchema = z.object({
  accessToken: z.string().min(1, 'Access token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
})

const OAuthCallbackSchema = z.object({
  code: z.string().min(1, 'Authorization code is required'),
})

// ── Types ───────────────────────────────────────────────────────────────────

type RegisterBody = z.infer<typeof RegisterSchema>
type LoginBody = z.infer<typeof LoginSchema>
type RefreshBody = z.infer<typeof RefreshSchema>
type ForgotPasswordBody = z.infer<typeof ForgotPasswordSchema>
type ResetPasswordBody = z.infer<typeof ResetPasswordSchema>
type OAuthCallbackBody = z.infer<typeof OAuthCallbackSchema>

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body(new ZodValidationPipe(RegisterSchema)) body: RegisterBody,
  ) {
    return this.authService.register(
      body.email,
      body.password,
      body.displayName,
    )
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ZodValidationPipe(LoginSchema)) body: LoginBody,
  ) {
    return this.authService.login((body.identifier ?? body.email)!, body.password)
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body(new ZodValidationPipe(RefreshSchema)) body: RefreshBody,
  ) {
    return this.authService.refreshToken(body.refreshToken)
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: AuthenticatedUser) {
    await this.authService.logout(user.id)
    return { success: true }
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body(new ZodValidationPipe(ForgotPasswordSchema)) body: ForgotPasswordBody,
  ) {
    await this.authService.forgotPassword(body.email)
    return { message: 'Password reset email sent' }
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body(new ZodValidationPipe(ResetPasswordSchema)) body: ResetPasswordBody,
  ) {
    await this.authService.resetPassword(body.accessToken, body.newPassword)
    return { message: 'Password reset successful' }
  }

  @Get('google')
  @HttpCode(HttpStatus.OK)
  @UseGuards(OptionalAuthGuard)
  async googleOAuth() {
    return this.authService.getOAuthUrl('google')
  }

  @Get('apple')
  @HttpCode(HttpStatus.OK)
  @UseGuards(OptionalAuthGuard)
  async appleOAuth() {
    return this.authService.getOAuthUrl('apple')
  }

  @Get('facebook')
  @HttpCode(HttpStatus.OK)
  @UseGuards(OptionalAuthGuard)
  async facebookOAuth() {
    return this.authService.getOAuthUrl('facebook')
  }

  @Post('google/callback')
  @HttpCode(HttpStatus.OK)
  async googleCallback(
    @Body(new ZodValidationPipe(OAuthCallbackSchema)) body: OAuthCallbackBody,
  ) {
    return this.authService.handleOAuthCallback(body.code)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: AuthenticatedUser) {
    return this.authService.getProfile(user.id)
  }
}
