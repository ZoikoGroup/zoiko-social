import { PaymentConfirmationEmailService } from './payment-confirmation-email.service'
import type { EmailProvider, OutboundEmail, SendResult } from '../comms/delivery/email-provider'
import type { ConfigService } from '../config/config.service'
import type { SupabaseAdminClient } from '../database/database.providers'
import type { PrismaService } from '../prisma/prisma.service'
import type { CommsLedgerService } from '../comms/comms-ledger.service'

describe('PaymentConfirmationEmailService', () => {
  let service: PaymentConfirmationEmailService
  let emailProvider: jest.Mocked<EmailProvider>
  let config: jest.Mocked<ConfigService>
  let supabaseAdmin: jest.Mocked<SupabaseAdminClient>
  let prisma: jest.Mocked<PrismaService>
  let ledger: jest.Mocked<CommsLedgerService>
  let sentMessages: OutboundEmail[]

  beforeEach(() => {
    sentMessages = []
    emailProvider = {
      name: 'test-resend',
      send: jest.fn(async (msg: OutboundEmail): Promise<SendResult> => {
        sentMessages.push(msg)
        return { ok: true, providerMessageId: 'msg_123' }
      }),
    } as unknown as jest.Mocked<EmailProvider>

    config = {
      allowedOrigin: 'https://zoikosocial.com',
      appBaseUrl: 'https://zoikosocial.com',
      legalEntityName: 'Zoiko Media Corp',
      legalPostalAddress: '1401 21st Street, Sacramento, CA',
    } as unknown as jest.Mocked<ConfigService>

    supabaseAdmin = {
      auth: {
        admin: {
          getUserById: jest.fn().mockResolvedValue({
            data: { user: { email: 'resolved@zoiko.com' } },
            error: null,
          }),
        },
      },
    } as unknown as jest.Mocked<SupabaseAdminClient>

    prisma = {
      profile: {
        findUnique: jest.fn().mockResolvedValue({
          displayName: 'John Doe',
          firstName: 'John',
          lastName: 'Doe',
        }),
      },
    } as unknown as jest.Mocked<PrismaService>

    ledger = {
      idempotencyKey: jest.fn().mockReturnValue('ledger_key_123'),
      hashAddress: jest.fn().mockReturnValue('hash_123'),
      record: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<CommsLedgerService>

    service = new PaymentConfirmationEmailService(
      emailProvider,
      config,
      supabaseAdmin,
      prisma,
      ledger,
    )
  })

  describe('sendPaymentConfirmation', () => {
    it('sends success payment confirmation email with correct content and subject', async () => {
      const result = await service.sendPaymentConfirmation({
        recipientEmail: 'member@zoiko.com',
        recipientName: 'Jane Smith',
        planName: 'Professional Plan',
        amountFormatted: '$29.99/mo',
        status: 'success',
        invoiceNumber: 'inv_abc123',
      })

      expect(result).toBe(true)
      expect(emailProvider.send).toHaveBeenCalledTimes(1)
      expect(sentMessages[0].to).toBe('member@zoiko.com')
      expect(sentMessages[0].subject).toContain('Payment Confirmed')
      expect(sentMessages[0].subject).toContain('Professional Plan')
      expect(sentMessages[0].html).toContain('Payment Confirmed &amp; Receipt')
      expect(sentMessages[0].html).toContain('$29.99/mo')
      expect(sentMessages[0].html).toContain('inv_abc123')
    })

    it('sends pending payment confirmation email when status is pending', async () => {
      const result = await service.sendPaymentConfirmation({
        recipientEmail: 'member@zoiko.com',
        recipientName: 'Jane Smith',
        planName: 'Starter Plan',
        amountFormatted: '$19.99/mo',
        status: 'pending',
        invoiceNumber: 'inv_pending_1',
      })

      expect(result).toBe(true)
      expect(emailProvider.send).toHaveBeenCalledTimes(1)
      expect(sentMessages[0].to).toBe('member@zoiko.com')
      expect(sentMessages[0].subject).toContain('Payment Pending')
      expect(sentMessages[0].html).toContain('Payment Pending Confirmation')
      expect(sentMessages[0].html).toContain('Starter Plan')
    })

    it('sends failed payment confirmation email when status is failed', async () => {
      const result = await service.sendPaymentConfirmation({
        recipientEmail: 'member@zoiko.com',
        recipientName: 'Jane Smith',
        planName: 'Premium Plan',
        amountFormatted: '$49.99/mo',
        status: 'failed',
        failureReason: 'Card was declined by the bank',
        invoiceNumber: 'inv_failed_1',
      })

      expect(result).toBe(true)
      expect(emailProvider.send).toHaveBeenCalledTimes(1)
      expect(sentMessages[0].to).toBe('member@zoiko.com')
      expect(sentMessages[0].subject).toContain('Payment Failed')
      expect(sentMessages[0].html).toContain('Payment Unsuccessful')
      expect(sentMessages[0].html).toContain('Card was declined by the bank')
    })

    it('resolves email from Supabase Admin auth when recipientEmail is omitted', async () => {
      const result = await service.sendPaymentConfirmation({
        userId: 'user_xyz',
        planName: 'Professional Plan',
        amountFormatted: '$29.99/mo',
        status: 'success',
      })

      expect(result).toBe(true)
      expect(supabaseAdmin.auth.admin.getUserById).toHaveBeenCalledWith('user_xyz')
      expect(sentMessages[0].to).toBe('resolved@zoiko.com')
      expect(sentMessages[0].html).toContain('John Doe')
    })

    it('returns false when email cannot be resolved', async () => {
      ;(supabaseAdmin.auth.admin.getUserById as jest.Mock).mockResolvedValueOnce({
        data: { user: null },
        error: new Error('User not found'),
      })

      const result = await service.sendPaymentConfirmation({
        userId: 'non_existent_user',
        planName: 'Starter Plan',
        amountFormatted: '$19.99/mo',
      })

      expect(result).toBe(false)
      expect(emailProvider.send).not.toHaveBeenCalled()
    })
  })

  describe('sendSubscriptionConfirmation', () => {
    it('delegates to sendPaymentConfirmation correctly', async () => {
      const result = await service.sendSubscriptionConfirmation({
        recipientEmail: 'sub@zoiko.com',
        recipientName: 'Subscriber',
        planName: 'Premium Plan',
        amountFormatted: '$49.99/mo',
      })

      expect(result).toBe(true)
      expect(sentMessages[0].to).toBe('sub@zoiko.com')
      expect(sentMessages[0].subject).toContain('Payment Confirmed')
    })
  })

  describe('sendOrderPaymentConfirmation', () => {
    it('sends order payment confirmed email for success', async () => {
      const result = await service.sendOrderPaymentConfirmation({
        orderId: 'ord_123',
        recipientEmail: 'buyer@zoiko.com',
        recipientName: 'Buyer Bob',
        productTitle: 'Dog Leash',
        quantity: 2,
        amountFormatted: '$35.00',
        status: 'success',
      })

      expect(result).toBe(true)
      expect(sentMessages[0].to).toBe('buyer@zoiko.com')
      expect(sentMessages[0].subject).toContain('Order Payment Confirmed: #ord_123')
      expect(sentMessages[0].html).toContain('Dog Leash')
      expect(sentMessages[0].html).toContain('$35.00')
    })

    it('sends order payment pending email for pending', async () => {
      const result = await service.sendOrderPaymentConfirmation({
        orderId: 'ord_456',
        recipientEmail: 'buyer@zoiko.com',
        recipientName: 'Buyer Bob',
        productTitle: 'Cat Collar',
        amountFormatted: '$15.00',
        status: 'pending',
      })

      expect(result).toBe(true)
      expect(sentMessages[0].subject).toContain('Order Payment Pending: #ord_456')
      expect(sentMessages[0].html).toContain('Cat Collar')
    })

    it('sends order payment failed email for failed', async () => {
      const result = await service.sendOrderPaymentConfirmation({
        orderId: 'ord_789',
        recipientEmail: 'buyer@zoiko.com',
        recipientName: 'Buyer Bob',
        productTitle: 'Fish Tank',
        amountFormatted: '$120.00',
        status: 'failed',
        failureReason: 'Session timed out',
      })

      expect(result).toBe(true)
      expect(sentMessages[0].subject).toContain('Order Payment Failed: #ord_789')
      expect(sentMessages[0].html).toContain('Session timed out')
    })
  })
})
