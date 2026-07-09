import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../prisma/prisma.service'
import { NotificationQueueService } from '../queue/notification-queue.service'
import { encodeCursor, decodeCursor } from '../common/utils/cursor-pagination'
import type { CreateProductInput, UpdateProductInput, EnquiryInput, ShopCategory, ShopSort } from './shop.schemas'

export interface ProductResponse {
  id: string
  seller: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
  title: string
  description: string | null
  price: number
  compareAt: number | null
  currency: string
  category: string
  condition: string
  coverUrl: string | null
  photos: string[]
  stock: number
  inStock: boolean
  shipping: string | null
  location: string | null
  status: string
  savesCount: number
  enquiriesCount: number
  createdAt: string
  viewerSaved: boolean
}

export interface ProductPage {
  data: ProductResponse[]
  nextCursor: string | null
  hasMore: boolean
}

type ProductRow = Prisma.ProductGetPayload<{
  include: { seller: { select: { id: true; username: true; displayName: true; avatarUrl: true; verificationTier: true } } }
}>

const MAX = 30

interface BrowseFilters {
  category?: ShopCategory
  condition?: string
  q?: string
  sort?: ShopSort
}

@Injectable()
export class ShopService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationQueueService,
  ) {}

  private sellerInclude() {
    return { seller: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } } }
  }

  private map(p: ProductRow, saved: boolean): ProductResponse {
    return {
      id: p.id,
      seller: {
        id: p.seller.id, username: p.seller.username, displayName: p.seller.displayName,
        avatarUrl: p.seller.avatarUrl, isVerified: p.seller.verificationTier === 'professional',
      },
      title: p.title, description: p.description,
      price: p.priceCents / 100, compareAt: p.compareCents !== null ? p.compareCents / 100 : null,
      currency: p.currency, category: p.category, condition: p.condition,
      coverUrl: p.coverUrl, photos: p.photos, stock: p.stock, inStock: p.stock > 0,
      shipping: p.shipping, location: p.location, status: p.status,
      savesCount: p.savesCount, enquiriesCount: p.enquiriesCount,
      createdAt: p.createdAt.toISOString(), viewerSaved: saved,
    }
  }

  private async savedFlags(ids: string[], viewerId?: string): Promise<Set<string>> {
    if (!viewerId || ids.length === 0) return new Set()
    const rows = await this.prisma.productSave.findMany({ where: { userId: viewerId, productId: { in: ids } }, select: { productId: true } })
    return new Set(rows.map((r) => r.productId))
  }

  async browse(filters: BrowseFilters, viewerId: string | undefined, cursor: string | null, limit = 15): Promise<ProductPage> {
    const take = Math.min(limit, MAX)
    const sort = filters.sort ?? 'newest'
    const baseWhere: Prisma.ProductWhereInput = {
      isDeleted: false,
      status: 'active',
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.condition ? { condition: filters.condition } : {}),
      ...(filters.q ? { OR: [{ title: { contains: filters.q, mode: 'insensitive' } }, { description: { contains: filters.q, mode: 'insensitive' } }] } : {}),
    }

    // Keyset pagination for the default 'newest' sort; other sorts return a single ranked page.
    if (sort === 'newest') {
      const decoded = cursor ? decodeCursor(cursor) : null
      const where: Prisma.ProductWhereInput = {
        ...baseWhere,
        ...(decoded
          ? { OR: [{ createdAt: { lt: new Date(decoded.createdAt) } }, { createdAt: new Date(decoded.createdAt), id: { lt: decoded.tiebreaker } }] }
          : {}),
      }
      const rows = await this.prisma.product.findMany({
        where, take: take + 1, orderBy: [{ createdAt: 'desc' }, { id: 'desc' }], include: this.sellerInclude(),
      })
      const hasMore = rows.length > take
      const items = hasMore ? rows.slice(0, take) : rows
      const saved = await this.savedFlags(items.map((p) => p.id), viewerId)
      return {
        data: items.map((p) => this.map(p, saved.has(p.id))),
        nextCursor: hasMore ? encodeCursor(items[items.length - 1]!.createdAt, items[items.length - 1]!.id) : null,
        hasMore,
      }
    }

    const orderBy: Prisma.ProductOrderByWithRelationInput =
      sort === 'price-low' ? { priceCents: 'asc' }
        : sort === 'price-high' ? { priceCents: 'desc' }
          : { savesCount: 'desc' }
    const rows = await this.prisma.product.findMany({ where: baseWhere, take: MAX, orderBy: [orderBy, { id: 'desc' }], include: this.sellerInclude() })
    const saved = await this.savedFlags(rows.map((p) => p.id), viewerId)
    return { data: rows.map((p) => this.map(p, saved.has(p.id))), nextCursor: null, hasMore: false }
  }

  async get(id: string, viewerId?: string): Promise<ProductResponse> {
    const p = await this.prisma.product.findUnique({ where: { id }, include: this.sellerInclude() })
    if (!p || p.isDeleted) throw new NotFoundException({ code: 'PRODUCT_NOT_FOUND', message: 'Product not found' })
    const saved = await this.savedFlags([p.id], viewerId)
    return this.map(p, saved.has(p.id))
  }

  /** All products owned by the current seller (any status), newest first. */
  async listMine(sellerId: string): Promise<ProductResponse[]> {
    const rows = await this.prisma.product.findMany({
      where: { sellerId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
      include: this.sellerInclude(),
    })
    return rows.map((p) => this.map(p, false))
  }

  /** Every enquiry across the current seller's products, newest first. */
  async enquiryInbox(sellerId: string): Promise<Array<{
    id: string; message: string | null; status: string; createdAt: string
    product: { id: string; title: string; coverUrl: string | null }
    buyer: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
  }>> {
    const rows = await this.prisma.productEnquiry.findMany({
      where: { product: { sellerId, isDeleted: false } },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        product: { select: { id: true, title: true, coverUrl: true } },
        buyer: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } },
      },
    })
    return rows.map((e) => ({
      id: e.id, message: e.message, status: e.status, createdAt: e.createdAt.toISOString(),
      product: { id: e.product.id, title: e.product.title, coverUrl: e.product.coverUrl },
      buyer: {
        id: e.buyer.id, username: e.buyer.username, displayName: e.buyer.displayName,
        avatarUrl: e.buyer.avatarUrl, isVerified: e.buyer.verificationTier === 'professional',
      },
    }))
  }

  async create(sellerId: string, input: CreateProductInput): Promise<ProductResponse> {
    const created = await this.prisma.product.create({
      data: {
        sellerId, title: input.title, priceCents: Math.round(input.price * 100),
        category: input.category ?? 'accessories', condition: input.condition ?? 'new',
        stock: input.stock ?? 1,
        ...(input.compareAt !== undefined ? { compareCents: Math.round(input.compareAt * 100) } : {}),
        ...(input.currency ? { currency: input.currency.toUpperCase() } : {}),
        ...(input.description ? { description: input.description } : {}),
        ...(input.coverUrl ? { coverUrl: input.coverUrl } : {}),
        ...(input.photos ? { photos: input.photos } : {}),
        ...(input.shipping ? { shipping: input.shipping } : {}),
        ...(input.location ? { location: input.location } : {}),
      },
      include: this.sellerInclude(),
    })
    return this.map(created, false)
  }

  private async assertSeller(id: string, sellerId: string): Promise<void> {
    const p = await this.prisma.product.findUnique({ where: { id }, select: { sellerId: true } })
    if (!p) throw new NotFoundException({ code: 'PRODUCT_NOT_FOUND', message: 'Product not found' })
    if (p.sellerId !== sellerId) throw new ForbiddenException({ code: 'NOT_SELLER', message: 'You can only manage your own listings' })
  }

  async update(id: string, sellerId: string, input: UpdateProductInput): Promise<ProductResponse> {
    await this.assertSeller(id, sellerId)
    const updated = await this.prisma.product.update({
      where: { id },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.price !== undefined ? { priceCents: Math.round(input.price * 100) } : {}),
        ...(input.compareAt !== undefined ? { compareCents: Math.round(input.compareAt * 100) } : {}),
        ...(input.category !== undefined ? { category: input.category } : {}),
        ...(input.condition !== undefined ? { condition: input.condition } : {}),
        ...(input.coverUrl !== undefined ? { coverUrl: input.coverUrl } : {}),
        ...(input.photos !== undefined ? { photos: input.photos } : {}),
        ...(input.stock !== undefined ? { stock: input.stock } : {}),
        ...(input.shipping !== undefined ? { shipping: input.shipping } : {}),
        ...(input.location !== undefined ? { location: input.location } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
      },
      include: this.sellerInclude(),
    })
    const saved = await this.savedFlags([id], sellerId)
    return this.map(updated, saved.has(id))
  }

  async remove(id: string, sellerId: string): Promise<void> {
    await this.assertSeller(id, sellerId)
    await this.prisma.product.update({ where: { id }, data: { isDeleted: true } })
  }

  async setSave(id: string, userId: string, on: boolean): Promise<{ saved: boolean; savesCount: number }> {
    const p = await this.prisma.product.findUnique({ where: { id }, select: { id: true, isDeleted: true } })
    if (!p || p.isDeleted) throw new NotFoundException({ code: 'PRODUCT_NOT_FOUND', message: 'Product not found' })
    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.productSave.findUnique({ where: { productId_userId: { productId: id, userId } } })
      if (on && !existing) {
        await tx.productSave.create({ data: { productId: id, userId } })
        const u = await tx.product.update({ where: { id }, data: { savesCount: { increment: 1 } }, select: { savesCount: true } })
        return { saved: true, savesCount: u.savesCount }
      }
      if (!on && existing) {
        await tx.productSave.delete({ where: { productId_userId: { productId: id, userId } } })
        const u = await tx.product.update({ where: { id }, data: { savesCount: { decrement: 1 } }, select: { savesCount: true } })
        return { saved: false, savesCount: u.savesCount }
      }
      const cur = await tx.product.findUnique({ where: { id }, select: { savesCount: true } })
      return { saved: on, savesCount: cur?.savesCount ?? 0 }
    })
  }

  async enquire(id: string, buyerId: string, input: EnquiryInput): Promise<{ status: string }> {
    const product = await this.prisma.product.findUnique({ where: { id }, select: { id: true, isDeleted: true, sellerId: true, title: true } })
    if (!product || product.isDeleted) throw new NotFoundException({ code: 'PRODUCT_NOT_FOUND', message: 'Product not found' })
    if (product.sellerId === buyerId) throw new BadRequestException({ code: 'OWN_PRODUCT', message: 'You cannot enquire on your own listing' })

    const existing = await this.prisma.productEnquiry.findUnique({ where: { productId_buyerId: { productId: id, buyerId } }, select: { status: true } })
    if (existing) return { status: existing.status }

    await this.prisma.$transaction(async (tx) => {
      await tx.productEnquiry.create({ data: { productId: id, buyerId, ...(input.message ? { message: input.message } : {}) } })
      await tx.product.update({ where: { id }, data: { enquiriesCount: { increment: 1 } } })
    })

    const buyer = await this.prisma.profile.findUnique({ where: { id: buyerId }, select: { displayName: true, username: true } })
    void this.notifications.enqueue({
      userId: product.sellerId,
      type: 'product_enquiry',
      title: 'New product enquiry',
      body: `${buyer?.displayName ?? 'Someone'} is interested in ${product.title}`,
      data: { productId: id, buyerUsername: buyer?.username },
    })
    return { status: 'pending' }
  }

  async listEnquiries(id: string, sellerId: string): Promise<Array<{
    id: string; message: string | null; status: string; createdAt: string
    buyer: { id: string; username: string; displayName: string; avatarUrl: string | null; isVerified: boolean }
  }>> {
    await this.assertSeller(id, sellerId)
    const rows = await this.prisma.productEnquiry.findMany({
      where: { productId: id },
      orderBy: { createdAt: 'desc' },
      include: { buyer: { select: { id: true, username: true, displayName: true, avatarUrl: true, verificationTier: true } } },
    })
    return rows.map((e) => ({
      id: e.id, message: e.message, status: e.status, createdAt: e.createdAt.toISOString(),
      buyer: {
        id: e.buyer.id, username: e.buyer.username, displayName: e.buyer.displayName,
        avatarUrl: e.buyer.avatarUrl, isVerified: e.buyer.verificationTier === 'professional',
      },
    }))
  }
}
