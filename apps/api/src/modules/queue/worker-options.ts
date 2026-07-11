import type { WorkerOptions } from 'bullmq'

/**
 * Low-churn worker tuning — shared by every BullMQ worker in the app.
 *
 * Managed Redis providers (Upstash et al.) bill per command, and idle BullMQ
 * workers are surprisingly chatty: with the defaults each worker re-issues its
 * blocking fetch every 5s (`drainDelay`) and a stalled-job sweep every 30s
 * (`stalledInterval`) — ~20k commands/day per worker doing nothing. Seven
 * workers burned a 500k/month quota in days.
 *
 * Raising these is safe for latency: BullMQ wakes blocked workers instantly
 * via queue markers when a job is added, so `drainDelay` only controls how
 * often an IDLE worker re-issues its blocking call, not job pickup time.
 * A slower stalled sweep only delays reclaiming jobs from crashed workers.
 */
export const LOW_CHURN_WORKER_OPTS: Pick<WorkerOptions, 'drainDelay' | 'stalledInterval'> = {
  drainDelay: 60, // seconds; default 5
  stalledInterval: 300_000, // ms; default 30_000
}
