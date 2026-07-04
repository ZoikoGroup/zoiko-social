import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from './modules/config/config.module'
import { DatabaseModule } from './modules/database/database.module'
import { CommonModule } from './modules/common/common.module'
import { AuthModule } from './modules/auth/auth.module'
import { PrismaModule } from './modules/prisma/prisma.module'
import { RedisModule } from './modules/redis/redis.module'
import { RealtimeModule } from './modules/realtime/realtime.module'
import { QueueModule } from './modules/queue/queue.module'
import { ProfileModule } from './modules/profile/profile.module'
import { NetworkModule } from './modules/network/network.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { HealthModule } from './health/health.module'

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    PrismaModule,
    RedisModule,
    RealtimeModule,
    QueueModule,
    CommonModule,
    AuthModule,
    ProfileModule,
    NetworkModule,
    NotificationsModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
