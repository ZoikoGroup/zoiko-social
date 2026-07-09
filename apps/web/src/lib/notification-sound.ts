/**
 * Plays a short "ding" notification sound using the Web Audio API.
 * No external audio files needed — the sound is generated programmatically.
 * The sound is only played if the browser supports the Web Audio API.
 */

let audioCtx: AudioContext | null = null

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!audioCtx) {
    try {
      const WebKitAudioCtx = (window as unknown as Record<string, unknown>).webkitAudioContext as typeof AudioContext | undefined
      audioCtx = new (window.AudioContext || WebKitAudioCtx)()
    } catch {
      return null
    }
  }
  // Resume if suspended (browsers require user interaction before AudioContext works)
  if (audioCtx.state === 'suspended') {
    void audioCtx.resume()
  }
  return audioCtx
}

/**
 * Plays a short notification "ding" sound.
 * Uses a two-tone chime (ascending) for incoming messages.
 */
export function playMessageSound(): void {
  const ctx = getAudioContext()
  if (!ctx) return

  try {
    const now = ctx.currentTime

    // ── First tone (lower) ──
    const osc1 = ctx.createOscillator()
    const gain1 = ctx.createGain()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(660, now)
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.1)
    gain1.gain.setValueAtTime(0.3, now)
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.2)
    osc1.connect(gain1)
    gain1.connect(ctx.destination)
    osc1.start(now)
    osc1.stop(now + 0.2)

    // ── Second tone (higher, slight delay) ──
    const osc2 = ctx.createOscillator()
    const gain2 = ctx.createGain()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(880, now + 0.08)
    osc2.frequency.exponentialRampToValueAtTime(1100, now + 0.18)
    gain2.gain.setValueAtTime(0.25, now + 0.08)
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.35)
    osc2.connect(gain2)
    gain2.connect(ctx.destination)
    osc2.start(now + 0.08)
    osc2.stop(now + 0.35)
  } catch {
    // Silently fail — audio is non-critical
  }
}
