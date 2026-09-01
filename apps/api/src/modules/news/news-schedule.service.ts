import { Injectable, Logger, type OnModuleInit, type OnModuleDestroy } from '@nestjs/common'
import { NewsIngestService } from './news-ingest.service'
import { PrismaService } from '../prisma/prisma.service'

/**
 * Runs the news ingest on a schedule.
 *
 * Without this, `ingestAll()` only ever ran when an admin pressed the button in
 * the panel, so the feed went stale the moment nobody was watching — the
 * three-hourly refresh the feed was designed around did not exist.
 *
 * A plain timer rather than @nestjs/schedule: this is one job on one interval,
 * and it is not worth a new dependency in the lockfile. `unref()` keeps the
 * timer from holding the process open during shutdown or a test run.
 *
 * SAFE TO RUN TWICE
 *
 * Nothing here assumes a single instance. Every source carries `lastFetchedAt`,
 * and a source fetched within the window is skipped, so a second instance
 * starting up finds nothing due and does no work. Article inserts dedupe on
 * canonical URL besides, which means the worst case of an overlap is wasted HTTP
 * requests, not duplicate articles.
 */

/** Matches the cadence the feed mixer assumes. */
const INTERVAL_MS = 3 * 60 * 60 * 1000

/**
 * Slightly under three hours, so a run that starts a little late does not push
 * the next one out by a whole cycle and drift into "every four hours".
 */
const STALE_AFTER_MS = INTERVAL_MS - 5 * 60 * 1000

/**
 * Boot delay. Long enough that a crash-looping container cannot hammer
 * publishers, short enough that a fresh deployment fills an empty feed quickly.
 */
const FIRST_RUN_DELAY_MS = 60 * 1000

@Injectable()
export class NewsScheduleService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(NewsScheduleService.name)
  private timer: NodeJS.Timeout | null = null
  private firstRun: NodeJS.Timeout | null = null
  /** Guards against a slow run overlapping the next tick. */
  private running = false

  constructor(
    private readonly ingest: NewsIngestService,
    private readonly prisma: PrismaService,
  ) {}

  onModuleInit(): void {
    // An explicit opt-out for local work: nobody developing a UI change wants
    // their machine fetching twenty RSS feeds.
    if (process.env.NEWS_INGEST_DISABLED === 'true') {
      this.logger.log('News ingest scheduler disabled (NEWS_INGEST_DISABLED=true)')
      return
    }

    this.firstRun = setTimeout(() => void this.runIfDue(), FIRST_RUN_DELAY_MS)
    this.firstRun.unref()

    this.timer = setInterval(() => void this.runIfDue(), INTERVAL_MS)
    this.timer.unref()

    this.logger.log('News ingest scheduled every 3 hours')
  }

  onModuleDestroy(): void {
    if (this.firstRun) clearTimeout(this.firstRun)
    if (this.timer) clearInterval(this.timer)
    this.firstRun = null
    this.timer = null
  }

  /**
   * Ingests only when something is actually due.
   *
   * Exposed for tests and for a caller that wants the scheduled behaviour rather
   * than the admin panel's unconditional "run now".
   */
  async runIfDue(): Promise<boolean> {
    if (this.running) {
      this.logger.warn('Previous news ingest still running — skipping this tick')
      return false
    }

    this.running = true
    try {
      const due = await this.prisma.newsSource.count({
        where: {
          enabled: true,
          OR: [
            { lastFetchedAt: null },
            { lastFetchedAt: { lt: new Date(Date.now() - STALE_AFTER_MS) } },
          ],
        },
      })

      if (due === 0) {
        this.logger.debug('No news sources due for refresh')
        return false
      }

      const result = await this.ingest.ingestAll()
      this.logger.log(
        `News ingest: ${result.created} new, ${result.removed} retired, across ${result.sources} sources`,
      )
      return true
    } catch (err) {
      // A failed refresh must not take the process down — the feed simply keeps
      // serving what it already has until the next tick.
      this.logger.error(`Scheduled news ingest failed: ${(err as Error).message}`)
      return false
    } finally {
      this.running = false
    }
  }
}
