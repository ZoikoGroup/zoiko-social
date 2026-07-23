/**
 * Lightweight, dependency-free scan for signals that a marketplace chat is
 * heading off-platform or toward a scam: sharing/asking a phone number, pushing
 * a payment/advance, or steering to WhatsApp/UPI etc. Used to flag messages and
 * surface an OLX-style "beware of fraudsters" warning — it never blocks sending.
 */
export interface FraudScanResult {
  flagged: boolean
  reasons: string[]
}

// 10+ digit runs (allowing spaces/dashes) — catches phone numbers.
const PHONE_RE = /(?:\+?\d[\s-]?){10,}/
// UPI handles like name@okhdfcbank / name@upi
const UPI_RE = /\b[\w.-]{2,}@(?:ok\w+|upi|paytm|ybl|axl|apl|ibl)\b/i

const PAYMENT_TERMS = [
  'upi', 'gpay', 'google pay', 'phonepe', 'paytm', 'bank account', 'account number',
  'ifsc', 'advance', 'deposit', 'token amount', 'booking amount', 'send money',
  'transfer', 'western union', 'gift card', 'otp', 'courier charge', 'delivery charge',
]
const CONTACT_TERMS = [
  'whatsapp', 'whats app', 'call me', 'text me', 'my number', 'your number',
  'phone number', 'contact number', 'mobile number', 'telegram',
]
const LOCATION_TERMS = [
  'exact address', 'home address', 'send address', 'your address', 'pin code',
  'share location', 'live location',
]

function hasTerm(lower: string, terms: string[]): boolean {
  return terms.some((t) => lower.includes(t))
}

export function scanForFraud(text: string): FraudScanResult {
  const reasons: string[] = []
  const lower = text.toLowerCase()

  if (PHONE_RE.test(text)) reasons.push('phone number')
  if (UPI_RE.test(text) || hasTerm(lower, PAYMENT_TERMS)) reasons.push('payment/advance')
  if (hasTerm(lower, CONTACT_TERMS)) reasons.push('off-platform contact')
  if (hasTerm(lower, LOCATION_TERMS)) reasons.push('personal address')

  return { flagged: reasons.length > 0, reasons }
}
