import { z } from 'zod'
import { httpUrl } from '../common/schemas/http-url'

export const SHOP_CATEGORIES = ['food', 'toys', 'health', 'grooming', 'accessories', 'beds', 'tech'] as const
export type ShopCategory = (typeof SHOP_CATEGORIES)[number]

/**
 * Currencies a listing may be priced in.
 *
 * Previously any 3-character string was accepted, so an unsupported code
 * surfaced as a Stripe API error at checkout rather than a validation error at
 * listing time, and cross-currency orders could not be aggregated for reporting
 * (ZSOC-COM-REV-001 §18 N3/N4).
 *
 * Every entry here is minor-unit-based with 2 decimals, because the whole
 * codebase treats `priceCents` as hundredths — the UI divides by 100 and
 * checkout passes the value straight to Stripe as `unit_amount`. JPY is on the
 * viewer's display-currency list (apps/web/src/lib/currency.ts) but is
 * deliberately NOT here: Stripe takes zero-decimal currencies in whole yen, so
 * a ¥1,000 listing stored as 100000 would charge ¥100,000. Adding a
 * zero-decimal currency requires the amount handling to change first.
 *
 * Display currency and transaction currency are separate concerns: a viewer may
 * see any currency converted, but the posted transaction has exactly one
 * currency (§18 N3) and it must be one of these.
 */
export const SHOP_CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'AUD', 'CAD', 'SGD'] as const
export type ShopCurrency = (typeof SHOP_CURRENCIES)[number]

export const SHOP_SORTS = ['newest', 'price-low', 'price-high', 'popular'] as const
export type ShopSort = (typeof SHOP_SORTS)[number]

export const CreateProductSchema = z.object({
  /** Free tags; normalised server-side so #Beagle and beagle are one tag. */
  tags: z.array(z.string().trim().max(40)).max(10).optional(),
  title: z.string().trim().min(3).max(160),
  description: z.string().trim().max(4000).optional(),
  price: z.number().min(0).max(100000),
  compareAt: z.number().min(0).max(100000).optional(),
  /**
   * Defaults to INR here rather than falling through to Prisma's USD default on
   * the model. Every product in the database is stored USD for that reason: the
   * Sell form never sent a currency, so a seller typing 999 on a platform whose
   * base is INR listed it as $999 and buyers saw roughly ₹83,000. The form asks
   * now, and omitting it lands on the platform base instead of a foreign one.
   */
  currency: z
    .string()
    .trim()
    .transform((c) => c.toUpperCase())
    .pipe(z.enum(SHOP_CURRENCIES))
    .default('INR'),
  category: z.enum(SHOP_CATEGORIES).optional(),
  condition: z.enum(['new', 'used']).optional(),
  /**
   * Required on create. A product listed without one renders as an empty grey
   * square in the shop grid — the browse page had five of them — and a buyer has
   * nothing to judge. Optional on update so an existing listing can be edited
   * without re-uploading, and so the rows that predate this rule stay editable.
   */
  coverUrl: httpUrl(600),
  photos: z.array(httpUrl(600)).max(8).optional(),
  stock: z.number().int().min(0).max(100000).optional(),
  shipping: z.string().trim().max(120).optional(),
  location: z.string().trim().max(160).optional(),
})

export const UpdateProductSchema = z.object({
  /** Free tags; normalised server-side so #Beagle and beagle are one tag. */
  tags: z.array(z.string().trim().max(40)).max(10).optional(),
  title: z.string().trim().min(3).max(160).optional(),
  description: z.string().trim().max(4000).optional(),
  price: z.number().min(0).max(100000).optional(),
  compareAt: z.number().min(0).max(100000).optional(),
  category: z.enum(SHOP_CATEGORIES).optional(),
  condition: z.enum(['new', 'used']).optional(),
  coverUrl: httpUrl(600).optional(),
  photos: z.array(httpUrl(600)).max(8).optional(),
  stock: z.number().int().min(0).max(100000).optional(),
  shipping: z.string().trim().max(120).optional(),
  location: z.string().trim().max(160).optional(),
  status: z.enum(['active', 'sold', 'withdrawn']).optional(),
})

export const EnquirySchema = z.object({
  message: z.string().trim().max(1000).optional(),
})

export type CreateProductInput = z.infer<typeof CreateProductSchema>
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>
export type EnquiryInput = z.infer<typeof EnquirySchema>
