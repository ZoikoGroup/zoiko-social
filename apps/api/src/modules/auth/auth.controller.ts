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

const LoginSchema = z.object({
  email: z.string().email('Valid email is required'),
  password: z.string().min(1, 'Password is required'),
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
    const result = await this.authService.register(
      body.email,
      body.password,
      body.displayName,
    )
    return { data: result }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body(new ZodValidationPipe(LoginSchema)) body: LoginBody,
  ) {
    const result = await this.authService.login(body.email, body.password)
    return { data: result }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Body(new ZodValidationPipe(RefreshSchema)) body: RefreshBody,
  ) {
    const result = await this.authService.refreshToken(body.refreshToken)
    return { data: result }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  async logout(@CurrentUser() user: AuthenticatedUser) {
    await this.authService.logout(user.id)
    return { data: { success: true } }
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(
    @Body(new ZodValidationPipe(ForgotPasswordSchema)) body: ForgotPasswordBody,
  ) {
    await this.authService.forgotPassword(body.email)
    return { data: { message: 'Password reset email sent' } }
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body(new ZodValidationPipe(ResetPasswordSchema)) body: ResetPasswordBody,
  ) {
    await this.authService.resetPassword(body.accessToken, body.newPassword)
    return { data: { message: 'Password reset successful' } }
  }

  @Get('google')
  @HttpCode(HttpStatus.OK)
  @UseGuards(OptionalAuthGuard)
  async googleOAuth() {
    const result = await this.authService.getGoogleOAuthUrl()
    return { data: result }
  }

  @Post('google/callback')
  @HttpCode(HttpStatus.OK)
  async googleCallback(
    @Body(new ZodValidationPipe(OAuthCallbackSchema)) body: OAuthCallbackBody,
  ) {
    const result = await this.authService.handleOAuthCallback(body.code)
    return { data: result }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async me(@CurrentUser() user: AuthenticatedUser) {
    const profile = await this.authService.getProfile(user.id)
    return { data: profile }
  }
}
