/**
 * Call sounds synthesized with WebAudio — no audio assets required.
 *
 * - ringback: what the CALLER hears while the other side rings (soft dual-tone,
 *   1s on / 2s off, telephone-style)
 * - ringtone: what the CALLEE hears on an incoming call (short ascending
 *   two-note chime repeating every 2s)
 *
 * Browsers block audio without a user gesture. The caller path always has one
 * (they clicked the call button). For incoming calls we attempt to resume the
 * AudioContext — this succeeds when the user has interacted with the page at
 * any point (typical); otherwise we degrade to vibration only.
 */

class TonePlayer {
  private ctx: AudioContext | null = null
  private timer: ReturnType<typeof setInterval> | null = null
  private nodes: OscillatorNode[] = []

  constructor(private readonly schedule: (ctx: AudioContext, register: (o: OscillatorNode) => void) => void, private readonly intervalMs: number) {}

  start(): void {
    if (this.timer) return
    try {
      this.ctx = this.ctx ?? new AudioContext()
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume().catch(() => undefined)
      }
      const tick = () => {
        const ctx = this.ctx
        if (!ctx || ctx.state !== 'running') return
        this.schedule(ctx, (o) => this.nodes.push(o))
      }
      tick()
      this.timer = setInterval(tick, this.intervalMs)
    } catch {
      // WebAudio unavailable — stay silent
    }
  }

  stop(): void {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
    for (const o of this.nodes.splice(0)) {
      try { o.stop() } catch { /* already stopped */ }
    }
  }
}

function beep(ctx: AudioContext, register: (o: OscillatorNode) => void, freq: number, at: number, dur: number, volume: number, type: OscillatorType = 'sine') {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  const t0 = ctx.currentTime + at
  // Soft attack/decay so the tones don't click
  gain.gain.setValueAtTime(0, t0)
  gain.gain.linearRampToValueAtTime(volume, t0 + 0.03)
  gain.gain.setValueAtTime(volume, t0 + dur - 0.05)
  gain.gain.linearRampToValueAtTime(0, t0 + dur)
  osc.connect(gain).connect(ctx.destination)
  osc.start(t0)
  osc.stop(t0 + dur)
  register(osc)
}

/** Caller-side "ringing" tone: dual 440+480 Hz, 1s on / 2s off. */
export const ringback = new TonePlayer((ctx, reg) => {
  beep(ctx, reg, 440, 0, 1.0, 0.06)
  beep(ctx, reg, 480, 0, 1.0, 0.06)
}, 3_000)

/** Callee-side incoming ringtone: bright ascending chime, repeats every 2s. */
export const ringtone = new TonePlayer((ctx, reg) => {
  beep(ctx, reg, 784, 0, 0.22, 0.14, 'triangle')   // G5
  beep(ctx, reg, 988, 0.25, 0.22, 0.14, 'triangle') // B5
  beep(ctx, reg, 1175, 0.5, 0.3, 0.14, 'triangle')  // D6
}, 2_000)

/** Short descending blip when a call ends. */
export function playEndBlip(): void {
  try {
    const ctx = new AudioContext()
    if (ctx.state === 'suspended') return
    beep(ctx, () => undefined, 660, 0, 0.12, 0.1)
    beep(ctx, () => undefined, 440, 0.14, 0.16, 0.1)
    setTimeout(() => void ctx.close().catch(() => undefined), 600)
  } catch {
    // silent
  }
}

let vibrateTimer: ReturnType<typeof setInterval> | null = null

/** Vibration pattern for incoming calls on supporting devices. */
export function startVibration(): void {
  if (typeof navigator === 'undefined' || !navigator.vibrate || vibrateTimer) return
  const buzz = () => navigator.vibrate([400, 200, 400])
  buzz()
  vibrateTimer = setInterval(buzz, 2_000)
}

export function stopVibration(): void {
  if (vibrateTimer) {
    clearInterval(vibrateTimer)
    vibrateTimer = null
  }
  if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(0)
}
