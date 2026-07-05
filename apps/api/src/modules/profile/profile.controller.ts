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
  type UpdateProfileInput,
  type SwitchProfessionalInput,
  type UpdateProfessionalInput,
  type SubmitVerificationInput,
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
