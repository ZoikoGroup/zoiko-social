import { Injectable } from '@nestjs/common'

@Injectable()
export class AppService {
  getRoot(): { name: string; version: string } {
    return { name: 'ZoikoSocial API', version: '0.1.0' }
  }
}
