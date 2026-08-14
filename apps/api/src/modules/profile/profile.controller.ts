import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { z } from 'zod'
import {
  ProfileService,
  UpdateProfileSchema,
  SwitchProfessionalSchema,
  UpdateProfessionalSchema,
  SubmitVerificationSchema,
  UpdateSettingsSchema,
  CompleteOnboardingSchema,
  type CompleteOnboardingInput,
  type UpdateProfileInput,
  type SwitchProfessionalInput,
  type UpdateProfessionalInput,
  type SubmitVerificationInput,
  type UpdateSettingsInput,
} from './profile.service'

const UploadDocumentSchema = z.object({
  requestId: z.string().uuid(),
  documentType: z.string().min(1).max(50),
  documentUrl: z.string().url().max(500),
  fileName: z.string().max(255).optional(),
  fileSize: z.number().int().positive().max(50 * 1024 * 1024).optional(),
  mimeType: z.string().max(100).optional(),
})

const ReviewVerificationSchema = z.object({
  approved: z.boolean(),
  rejectionReason: z.string().max(1000).optional(),
})
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'
import { AccessToken } from '../auth/decorators/access-token.decorator'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // ── USERNAME AVAILABILITY (public — used by the signup form) ───────────────

  @Get('username-available')
  async checkUsername(@Query('username') username: string) {
    const result = await this.profileService.checkUsernameAvailability(username ?? '')
    return { data: result }
  }

  /** Handles built from a name, already filtered to the ones still free. */
  @Get('username-suggestions')
  async suggestUsernames(
    @Query('firstName') firstName?: string,
    @Query('lastName') lastName?: string,
  ) {
    const suggestions = await this.profileService.suggestUsernames(
      firstName ?? '',
      lastName ?? '',
    )
    return { data: { suggestions } }
  }

  // ── PROFILE CRUD ───────────────────────────────────────────────────────────

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyProfile(@CurrentUser() user: AuthenticatedUser) {
    const profile = await this.profileService.getMyProfile(user.id)
    return { data: profile }
  }

  @Get('username/:username')
  @UseGuards(OptionalAuthGuard)
  async getProfileByUsername(
    @Param('username') username: string,
    @Query('withViewer') withViewer?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    if (withViewer === '1' || withViewer === 'true') {
      const base = await this.profileService.getProfileByUsername(username, user?.id)
      const profile = await this.profileService.getProfileWithViewer(base.id, user?.id)
      return { data: profile }
    }
    const profile = await this.profileService.getProfileByUsername(username, user?.id)
    return { data: profile }
  }

  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  async getProfileById(
    @Param('id') id: string,
    @Query('withViewer') withViewer?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    if (withViewer === '1' || withViewer === 'true') {
      const profile = await this.profileService.getProfileWithViewer(id, user?.id)
      return { data: profile }
    }
    const profile = await this.profileService.getProfileById(id, user?.id)
    return { data: profile }
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(UpdateProfileSchema)) body: UpdateProfileInput,
  ) {
    const profile = await this.profileService.updateProfile(user.id, body)
    return { data: profile }
  }

  /**
   * The single naming pass a new OAuth account goes through. Separate from
   * PUT me so it does not spend the 30-day username cooldown on replacing a
   * handle the signup trigger derived from their email address.
   */
  @Post('me/onboarding')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async completeOnboarding(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(CompleteOnboardingSchema)) body: CompleteOnboardingInput,
  ) {
    const profile = await this.profileService.completeOnboarding(user.id, body)
    return { data: profile }
  }

  // ── PROFESSIONAL ───────────────────────────────────────────────────────────

  @Post('me/professional')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async switchToProfessional(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(SwitchProfessionalSchema)) body: SwitchProfessionalInput,
  ) {
    const result = await this.profileService.switchToProfessional(user.id, body)
    return { data: result }
  }

  @Get('me/professional')
  @UseGuards(JwtAuthGuard)
  async getProfessionalProfile(@CurrentUser() user: AuthenticatedUser) {
    const result = await this.profileService.getProfessionalProfile(user.id)
    return { data: result }
  }

  @Put('me/professional')
  @UseGuards(JwtAuthGuard)
  async updateProfessionalProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(UpdateProfessionalSchema)) body: UpdateProfessionalInput,
  ) {
    const result = await this.profileService.updateProfessionalProfile(user.id, body)
    return { data: result }
  }

  @Delete('me/professional')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async revertToPersonal(@CurrentUser() user: AuthenticatedUser) {
    await this.profileService.revertToPersonal(user.id)
    return { data: { message: 'Reverted to personal account' } }
  }

  // ── PROFESSIONAL CATEGORIES ────────────────────────────────────────────────

  @Get('professional-categories')
  async getCategories() {
    const categories = await this.profileService.getProfessionalCategories()
    return { data: categories }
  }

  // ── VERIFICATION ───────────────────────────────────────────────────────────

  @Post('me/verification')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async submitVerification(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(SubmitVerificationSchema)) body: SubmitVerificationInput,
  ) {
    const result = await this.profileService.submitVerificationRequest(user.id, body)
    return { data: result }
  }

  @Get('me/verification/status')
  @UseGuards(JwtAuthGuard)
  async getVerificationStatus(@CurrentUser() user: AuthenticatedUser) {
    const result = await this.profileService.getVerificationStatus(user.id)
    return { data: result }
  }

  @Post('me/verification/documents')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async uploadDocument(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(UploadDocumentSchema)) body: z.infer<typeof UploadDocumentSchema>,
  ) {
    const result = await this.profileService.uploadVerificationDocument(
      user.id,
      body.requestId,
      body.documentType,
      body.documentUrl,
      body.fileName,
      body.fileSize,
      body.mimeType,
    )
    return { data: result }
  }

  /**
   * Signed read URL for one uploaded document. Available to the member who
   * uploaded it and to reviewing staff — the bucket itself is private, so this
   * is the only way to see the file.
   */
  @Get('verification/documents/:id/url')
  @UseGuards(JwtAuthGuard)
  async getVerificationDocumentUrl(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    const url = await this.profileService.getVerificationDocumentUrl(user.id, id)
    return { data: { url } }
  }

  // ── ADMIN VERIFICATION REVIEW ──────────────────────────────────────────────

  @Get('admin/verification-requests')
  @UseGuards(JwtAuthGuard)
  async getVerificationRequests(
    @CurrentUser() user: AuthenticatedUser,
    @Query('status') status?: string,
  ) {
    await this.profileService.requireAdminOrModerator(user.id)
    const result = await this.profileService.getVerificationRequests(status)
    return { data: result }
  }

  @Post('admin/verification-requests/:id/review')
  @UseGuards(JwtAuthGuard)
  async reviewVerification(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(ReviewVerificationSchema)) body: z.infer<typeof ReviewVerificationSchema>,
  ) {
    await this.profileService.requireAdminOrModerator(user.id)
    const result = await this.profileService.reviewVerificationRequest(id, user.id, body.approved, body.rejectionReason)
    return { data: result }
  }

  // ── USER SETTINGS ───────────────────────────────────────────────────────────

  @Get('settings/me')
  @UseGuards(JwtAuthGuard)
  async getMySettings(@CurrentUser() user: AuthenticatedUser) {
    const settings = await this.profileService.getSettings(user.id)
    return { data: settings }
  }

  @Put('settings/me')
  @UseGuards(JwtAuthGuard)
  async updateMySettings(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(UpdateSettingsSchema)) body: UpdateSettingsInput,
  ) {
    const settings = await this.profileService.updateSettings(user.id, body)
    return { data: settings }
  }

  // ── ACCOUNT DELETION ───────────────────────────────────────────────────────

  /**
   * Temporarily hide the account. Reversible by signing back in — there is no
   * authenticated "reactivate" route because JwtAuthGuard rejects every request
   * from a non-active account.
   */
  @Post('me/deactivate')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deactivateAccount(@CurrentUser() user: AuthenticatedUser, @AccessToken() accessToken?: string) {
    const result = await this.profileService.deactivateAccount(user.id, accessToken)
    return {
      data: {
        ...result,
        message: 'Your account is now hidden. Sign in again whenever you want it back.',
      },
    }
  }

  /**
   * Schedule deletion after the grace period. Nothing is destroyed yet: signing
   * in before the deadline cancels it.
   */
  @Delete('me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteAccount(@CurrentUser() user: AuthenticatedUser, @AccessToken() accessToken?: string) {
    const result = await this.profileService.requestAccountDeletion(user.id, accessToken)
    return {
      data: {
        ...result,
        message: `Your account is scheduled for deletion in ${result.graceDays} days. Sign in before then to cancel it.`,
      },
    }
  }

  // ── RELATIONSHIP ───────────────────────────────────────────────────────────

  @Get(':id/relationship')
  @UseGuards(JwtAuthGuard)
  async getRelationship(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ) {
    const result = await this.profileService.getRelationship(user.id, id)
    return { data: result }
  }
}
