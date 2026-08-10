import { Module } from '@nestjs/common'
import { AffinityService } from './affinity.service'
import { PersonalizationService } from './personalization.service'
import { ConfigModule } from '../config/config.module'
import { RedisModule } from '../redis/redis.module'

/**
 * PersonalizationModule — affinity-based feed ranking (Instagram-style).
 *
 * AffinityService  — captures engagement signals into per-user Redis profiles.
 * PersonalizationService — scores/ranks candidate pools at feed-read time.
 *
 * Everything degrades to the pre-personalization ranking when personalization
 * is disabled (PERSONALIZATION_ENABLED=false) or when a user has no profile.
 *
 * ConfigModule is NOT global — it must be imported here for AffinityService's
 * ConfigService dependency. RedisModule is @Global, imported explicitly for
 * clarity (Nest dedupes module instances).
 */
@Module({
  imports: [ConfigModule, RedisModule],
  providers: [AffinityService, PersonalizationService],
  exports: [AffinityService, PersonalizationService],
})
export class PersonalizationModule {}
