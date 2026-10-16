import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { importPKCS8, SignJWT } from 'jose'
import { ConfigService } from '../config/config.service'

/**
 * Firebase Cloud Messaging (HTTP v1) for the Android app.
 *
 * Talks to the REST API directly rather than through firebase-admin: one POST per
 * message plus an OAuth token exchange, which `jose` (already a dependency) can
 * sign, is all this needs — not a second SDK and its dependency tree.
 */

const TOKEN_ENDPOINT = 'https://oauth2.googleapis.com/token'
const SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const REQUEST_TIMEOUT_MS = 10_000
/** Refresh the access token this long before Google says it expires. */
const TOKEN_EXPIRY_MARGIN_MS = 5 * 60 * 1000

interface ServiceAccount {
  project_id: string
  client_email: string
  private_key: string
}

/** FCM data messages carry string values only. */
export type FcmData = Record<string, string>

export interface FcmMessage {
  token: string
  data: FcmData
  /** Replaces an undelivered message with the same key while the device is offline. */
  collapseKey?: string
  ttlSeconds: number
}

/**
 * `gone`: FCM says the token will never work again (uninstalled app, cleared
 * data, rotated token) — delete it. `failed`: anything that may be transient.
 */
export type FcmResult = 'sent' | 'gone' | 'failed'

@Injectable()
export class FcmClient implements OnModuleInit {
  private readonly logger = new Logger(FcmClient.name)
  private account: ServiceAccount | null = null
  private accessToken: { value: string; expiresAt: number } | null = null

  constructor(private readonly config: ConfigService) {}

  onModuleInit(): void {
    const raw = this.config.fcmServiceAccountJson
    if (!raw) {
      // Same stance as Web Push: a deployment without the key runs normally,
      // with native push simply unavailable.
      this.logger.warn('FCM disabled — FCM_SERVICE_ACCOUNT_JSON not set')
      return
    }
    this.account = parseServiceAccount(raw)
    if (this.account) {
      this.logger.log(`FCM configured for project ${this.account.project_id}`)
    } else {
      this.logger.error('FCM disabled — FCM_SERVICE_ACCOUNT_JSON is not a service account key')
    }
  }

  isConfigured(): boolean {
    return this.account !== null
  }

  async send(message: FcmMessage): Promise<FcmResult> {
    const account = this.account
    if (!account) return 'failed'

    let accessToken: string
    try {
      accessToken = await this.getAccessToken(account)
    } catch (err) {
      this.logger.warn(`FCM auth failed: ${(err as Error).message}`)
      return 'failed'
    }

    const body = {
      message: {
        token: message.token,
        data: message.data,
        android: {
          // A data message has to be high priority to wake a dozing phone; the
          // app always shows a notification for it, which is what Android
          // requires of high-priority messages.
          priority: 'HIGH',
          ttl: `${message.ttlSeconds}s`,
          ...(message.collapseKey ? { collapse_key: message.collapseKey } : {}),
        },
      },
    }

    try {
      const res = await fetch(
        `https://fcm.googleapis.com/v1/projects/${encodeURIComponent(account.project_id)}/messages:send`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
          body: JSON.stringify(body),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        },
      )
      if (res.ok) return 'sent'

      const error = await res.json().catch(() => null)
      if (isTokenGone(res.status, error)) return 'gone'
      if (res.status === 401) this.accessToken = null
      this.logger.debug(`FCM send failed with ${res.status} ${errorCode(error) ?? ''}`.trim())
      return 'failed'
    } catch (err) {
      this.logger.debug(`FCM send failed: ${(err as Error).message}`)
      return 'failed'
    }
  }

  /** A cached OAuth access token, minted from the service account when needed. */
  private async getAccessToken(account: ServiceAccount): Promise<string> {
    if (this.accessToken && this.accessToken.expiresAt - TOKEN_EXPIRY_MARGIN_MS > Date.now()) {
      return this.accessToken.value
    }

    const key = await importPKCS8(account.private_key, 'RS256')
    const assertion = await new SignJWT({ scope: SCOPE })
      .setProtectedHeader({ alg: 'RS256', typ: 'JWT' })
      .setIssuer(account.client_email)
      .setSubject(account.client_email)
      .setAudience(TOKEN_ENDPOINT)
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(key)

    const res = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion,
      }).toString(),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    if (!res.ok) throw new Error(`token endpoint answered ${res.status}`)

    const json = (await res.json()) as { access_token?: string; expires_in?: number }
    if (!json.access_token) throw new Error('token endpoint returned no access_token')
    this.accessToken = {
      value: json.access_token,
      expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000,
    }
    return json.access_token
  }
}

/** Accepts the key file's JSON as-is or base64-encoded (env vars and newlines don't mix well). */
export function parseServiceAccount(raw: string): ServiceAccount | null {
  const candidates = [raw.trim()]
  if (!raw.trim().startsWith('{')) {
    candidates.push(Buffer.from(raw.trim(), 'base64').toString('utf8'))
  }
  for (const text of candidates) {
    try {
      const parsed = JSON.parse(text) as Partial<ServiceAccount>
      if (parsed.project_id && parsed.client_email && parsed.private_key) {
        return {
          project_id: parsed.project_id,
          client_email: parsed.client_email,
          // A key pasted into an env var often arrives with literal "\n".
          private_key: parsed.private_key.replace(/\\n/g, '\n'),
        }
      }
    } catch {
      // try the next form
    }
  }
  return null
}

function errorCode(error: unknown): string | undefined {
  const details = (error as { error?: { details?: { errorCode?: string }[] } } | null)?.error?.details
  return details?.find((d) => d.errorCode)?.errorCode
}

/**
 * UNREGISTERED (404) is FCM's "this token is gone for good". A 400
 * INVALID_ARGUMENT can also mean a malformed message, so it only counts when FCM
 * says the token is the invalid argument — otherwise a bug in the payload would
 * delete every member's device.
 */
export function isTokenGone(status: number, error: unknown): boolean {
  const code = errorCode(error)
  if (code === 'UNREGISTERED' || status === 404) return true
  const message = (error as { error?: { message?: string } } | null)?.error?.message ?? ''
  return status === 400 && code === 'INVALID_ARGUMENT' && /registration token/i.test(message)
}
