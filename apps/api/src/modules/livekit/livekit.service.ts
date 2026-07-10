import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common'
import { AccessToken } from 'livekit-server-sdk'
import { ConfigService } from '../config/config.service'

export interface CallToken {
  token: string
  url: string
}

@Injectable()
export class LivekitService {
  private readonly logger = new Logger(LivekitService.name)

  constructor(private readonly config: ConfigService) {}

  get enabled(): boolean {
    return this.config.livekitEnabled
  }

  /**
   * Mint a LiveKit access token for a participant to join a room.
   * Identity is the user id so remote participants can be mapped back to users.
   */
  async mintToken(
    identity: string,
    roomName: string,
    opts: { name?: string; canPublish?: boolean } = {},
  ): Promise<CallToken> {
    if (!this.config.livekitEnabled) {
      throw new ServiceUnavailableException({
        code: 'CALLS_NOT_CONFIGURED',
        message: 'Calling is not configured on this server',
      })
    }

    const at = new AccessToken(this.config.livekitApiKey!, this.config.livekitApiSecret!, {
      identity,
      name: opts.name,
      // Tokens are short-lived; a call setup + connect happens within minutes.
      ttl: '15m',
    })
    at.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: opts.canPublish ?? true,
      canSubscribe: true,
    })

    const token = await at.toJwt()
    return { token, url: this.config.livekitUrl! }
  }
}
