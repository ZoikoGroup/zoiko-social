import {
  Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { PetsService } from './pets.service'
import {
  CreatePetSchema, UpdatePetSchema, CreateDiaryEntrySchema, UpdateDiaryEntrySchema, CreateHealthRecordSchema,
  type CreatePetInput, type UpdatePetInput, type CreateDiaryEntryInput, type UpdateDiaryEntryInput, type CreateHealthRecordInput,
} from './pets.schemas'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'

@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async mine(@CurrentUser() user: AuthenticatedUser) {
    return { data: await this.petsService.listMine(user.id) }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: AuthenticatedUser, @Body() body: CreatePetInput) {
    const input = CreatePetSchema.parse(body)
    return { data: await this.petsService.create(user.id, input) }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: UpdatePetInput,
  ) {
    const input = UpdatePetSchema.parse(body)
    return { data: await this.petsService.update(id, user.id, input) }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    await this.petsService.remove(id, user.id)
    return { data: { success: true } }
  }

  // ── Diary ──
  @Get(':petId/diary')
  @UseGuards(JwtAuthGuard)
  async diary(@CurrentUser() user: AuthenticatedUser, @Param('petId') petId: string) {
    return { data: await this.petsService.listDiary(petId, user.id) }
  }

  @Post(':petId/diary')
  @UseGuards(JwtAuthGuard)
  async addDiary(@CurrentUser() user: AuthenticatedUser, @Param('petId') petId: string, @Body() body: CreateDiaryEntryInput) {
    const input = CreateDiaryEntrySchema.parse(body)
    return { data: await this.petsService.addDiary(petId, user.id, input) }
  }

  @Patch(':petId/diary/:entryId')
  @UseGuards(JwtAuthGuard)
  async updateDiary(@CurrentUser() user: AuthenticatedUser, @Param('petId') petId: string, @Param('entryId') entryId: string, @Body() body: UpdateDiaryEntryInput) {
    const input = UpdateDiaryEntrySchema.parse(body)
    return { data: await this.petsService.updateDiary(petId, entryId, user.id, input) }
  }

  @Delete(':petId/diary/:entryId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async removeDiary(@CurrentUser() user: AuthenticatedUser, @Param('petId') petId: string, @Param('entryId') entryId: string) {
    await this.petsService.removeDiary(petId, entryId, user.id)
    return { data: { success: true } }
  }

  // ── Health ──
  @Get(':petId/health')
  @UseGuards(JwtAuthGuard)
  async health(@CurrentUser() user: AuthenticatedUser, @Param('petId') petId: string) {
    return { data: await this.petsService.listHealth(petId, user.id) }
  }

  @Post(':petId/health')
  @UseGuards(JwtAuthGuard)
  async addHealth(@CurrentUser() user: AuthenticatedUser, @Param('petId') petId: string, @Body() body: CreateHealthRecordInput) {
    const input = CreateHealthRecordSchema.parse(body)
    return { data: await this.petsService.addHealth(petId, user.id, input) }
  }

  @Delete(':petId/health/:recordId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async removeHealth(@CurrentUser() user: AuthenticatedUser, @Param('petId') petId: string, @Param('recordId') recordId: string) {
    await this.petsService.removeHealth(petId, recordId, user.id)
    return { data: { success: true } }
  }
}

/** Public pet lists on a profile. */
@Controller('profiles')
export class ProfilePetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get(':id/pets')
  @UseGuards(OptionalAuthGuard)
  async byProfile(@Param('id') id: string, @CurrentUser() user?: AuthenticatedUser) {
    return { data: await this.petsService.listByOwner(id, user?.id) }
  }
}
