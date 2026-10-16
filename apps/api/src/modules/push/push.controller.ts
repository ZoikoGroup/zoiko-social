import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'
import { RateLimit } from '../common/decorators/rate-limit.decorator'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'
import { NotificationPreferenceService } from './notification-preference.service'
import { PushService } from './push.service'
import {
  RegisterDeviceSchema,
  SetPreferenceSchema,
  SubscribeSchema,
  UnregisterDeviceSchema,
  UnsubscribeSchema,
} from './push.schemas'
import type {
  RegisterDeviceInput,
  SetPreferenceInput,
  SubscribeInput,
  UnregisterDeviceInput,
  UnsubscribeInput,
} from './push.schemas'

@Controller('push')
export class PushController {
  constructor(
    private readonly push: PushService,
    private readonly preferences: NotificationPreferenceService,
  ) {}

  /**
   * The browser needs the VAPID public key before it can subscribe, and it needs
   * it before the member has necessarily agreed to anything — so this is the one
   * unauthenticated route here. The key is public by design.
   *
   * `available` lets the client hide the whole feature rather than offer a
   * permission prompt that cannot lead anywhere on a deployment with no keys.
   */
  @Get('public-key')
  getPublicKey() {
    return { data: { publicKey: this.push.getPublicKey(), available: this.push.isConfigured() } }
  }

  @Post('subscriptions')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async subscribe(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(SubscribeSchema)) body: SubscribeInput,
    @Headers('user-agent') userAgent?: string,
  ) {
    await this.push.subscribe(user.id, body, userAgent)
    return { success: true }
  }

  /**
   * DELETE with a body, because the endpoint is a 2 KB URL and putting it in the
   * path would exceed what proxies reliably accept.
   */
  @Delete('subscriptions')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async unsubscribe(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(UnsubscribeSchema)) body: UnsubscribeInput,
  ) {
    await this.push.unsubscribe(user.id, body.endpoint)
    return { success: true }
  }

  /**
   * The Android app's FCM token for the signed-in member. Called on every launch
   * (the token can rotate) and after signing in on the device.
   */
  @Post('devices')
  @UseGuards(JwtAuthGuard)
  @RateLimit({ limit: 20, windowSeconds: 60, prefix: 'push.devices.register' })
  @HttpCode(HttpStatus.CREATED)
  async registerDevice(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(RegisterDeviceSchema)) body: RegisterDeviceInput,
  ) {
    await this.push.registerDevice(user.id, body)
    return { success: true }
  }

  /**
   * Unauthenticated: the app calls this once it has signed out, so there is no
   * session left to send. The token is the credential (see unregisterDevice).
   * POST rather than DELETE-with-body so `fetch(..., { keepalive: true })` from a
   * page that is navigating away still delivers it.
   */
  @Post('devices/unregister')
  @RateLimit({ limit: 20, windowSeconds: 60, prefix: 'push.devices.unregister' })
  @HttpCode(HttpStatus.OK)
  async unregisterDevice(@Body(new ZodValidationPipe(UnregisterDeviceSchema)) body: UnregisterDeviceInput) {
    await this.push.unregisterDevice(body.token)
    return { success: true }
  }

  /** Every push category with the member's answer, defaults filled in. */
  @Get('preferences')
  @UseGuards(JwtAuthGuard)
  async getPreferences(@CurrentUser() user: AuthenticatedUser) {
    return { data: await this.preferences.getForChannel(user.id, 'push') }
  }

  @Patch('preferences')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async setPreference(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(SetPreferenceSchema)) body: SetPreferenceInput,
  ) {
    const applied = await this.preferences.set(user.id, body.preferenceKey, 'push', body.enabled)
    return { success: applied }
  }
}
