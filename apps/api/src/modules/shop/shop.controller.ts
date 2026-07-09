import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { ShopService } from './shop.service'
import {
  CreateProductSchema, UpdateProductSchema, EnquirySchema, SHOP_CATEGORIES, SHOP_SORTS,
  type CreateProductInput, type UpdateProductInput, type EnquiryInput, type ShopCategory, type ShopSort,
} from './shop.schemas'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'

@Controller('shop')
export class ShopController {
  constructor(private readonly shop: ShopService) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  async browse(
    @Query('category') category?: string,
    @Query('condition') condition?: string,
    @Query('q') q?: string,
    @Query('sort') sort?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const filters = {
      ...(category && (SHOP_CATEGORIES as readonly string[]).includes(category) ? { category: category as ShopCategory } : {}),
      ...(condition === 'new' || condition === 'used' ? { condition } : {}),
      ...(q && q.trim() ? { q: q.trim() } : {}),
      ...(sort && (SHOP_SORTS as readonly string[]).includes(sort) ? { sort: sort as ShopSort } : {}),
    }
    return { data: await this.shop.browse(filters, user?.id, cursor ?? null, limit ? parseInt(limit, 10) : 15) }
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  async mine(@CurrentUser() user: AuthenticatedUser) {
    return { data: await this.shop.listMine(user.id) }
  }

  @Get('enquiries/inbox')
  @UseGuards(JwtAuthGuard)
  async enquiryInbox(@CurrentUser() user: AuthenticatedUser) {
    return { data: await this.shop.enquiryInbox(user.id) }
  }

  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  async get(@Param('id') id: string, @CurrentUser() user?: AuthenticatedUser) {
    return { data: await this.shop.get(id, user?.id) }
  }

  @Get(':id/enquiries')
  @UseGuards(JwtAuthGuard)
  async enquiries(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return { data: await this.shop.listEnquiries(id, user.id) }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: AuthenticatedUser, @Body(new ZodValidationPipe(CreateProductSchema)) body: CreateProductInput) {
    return { data: await this.shop.create(user.id, body) }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body(new ZodValidationPipe(UpdateProductSchema)) body: UpdateProductInput) {
    return { data: await this.shop.update(id, user.id, body) }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    await this.shop.remove(id, user.id)
    return { data: { success: true } }
  }

  @Post(':id/save')
  @UseGuards(JwtAuthGuard)
  async save(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return { data: await this.shop.setSave(id, user.id, true) }
  }

  @Delete(':id/save')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async unsave(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return { data: await this.shop.setSave(id, user.id, false) }
  }

  @Post(':id/enquiries')
  @UseGuards(JwtAuthGuard)
  async enquire(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body(new ZodValidationPipe(EnquirySchema)) body: EnquiryInput) {
    return { data: await this.shop.enquire(id, user.id, body) }
  }
}
