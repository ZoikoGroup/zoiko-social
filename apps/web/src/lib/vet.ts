import type { HoursEntry } from '@/lib/api'
import { formatClock } from '@/lib/datetime'

// ═════════════════════════════════════════════════════════════════════════════
// Vet Finder — shared constants & helpers
// ═════════════════════════════════════════════════════════════════════════════

// ── Vet service categories (the clinic's bookable services) ──────────────────
export const VET_SERVICE_CATEGORIES = [
  'consultation', 'vaccination', 'deworming', 'surgery', 'dental', 'diagnostics',
  'emergency', 'telemedicine', 'microchip', 'health_certificate', 'other',
] as const
export type VetServiceCategory = (typeof VET_SERVICE_CATEGORIES)[number]

export const VET_SERVICE_CATEGORY_LABELS: Record<string, string> = {
  consultation: 'Consultation',
  vaccination: 'Vaccination',
  deworming: 'Deworming',
  surgery: 'Surgery',
  dental: 'Dental',
  diagnostics: 'Diagnostics / Lab',
  emergency: 'Emergency',
  telemedicine: 'Telemedicine',
  microchip: 'Microchipping',
  health_certificate: 'Health Certificate',
  other: 'Other',
}

// ── Clinic specialties ───────────────────────────────────────────────────────
export const SPECIALTIES = [
  'General Practice', 'Surgery', 'Dermatology', 'Cardiology', 'Orthopedics',
  'Dentistry', 'Ophthalmology', 'Oncology', 'Internal Medicine', 'Neurology',
  'Behavior', 'Exotics', 'Emergency & Critical Care', 'Radiology',
] as const

// ── Species a clinic treats ──────────────────────────────────────────────────
export const SPECIES_TREATED = [
  'Dogs', 'Cats', 'Birds', 'Rabbits', 'Reptiles', 'Small Mammals', 'Fish', 'Farm Animals', 'Exotics',
] as const

// ── Facilities on-site ───────────────────────────────────────────────────────
export const FACILITIES = [
  'In-house Lab', 'Pharmacy', 'X-Ray', 'Ultrasound', 'Surgery Suite', 'ICU',
  'Isolation Ward', 'Grooming', 'Boarding', 'Ambulance', 'Parking',
] as const

// ── Consultation modes ───────────────────────────────────────────────────────
export const CONSULT_MODES = ['in_clinic', 'home_visit', 'video'] as const
export type ConsultMode = (typeof CONSULT_MODES)[number]
export const CONSULT_MODE_LABELS: Record<string, string> = {
  in_clinic: 'In-clinic',
  home_visit: 'Home visit',
  video: 'Video consult',
}

export const LANGUAGES = [
  'English', 'Hindi', 'Telugu', 'Tamil', 'Kannada', 'Malayalam', 'Marathi', 'Bengali', 'Gujarati', 'Punjabi',
] as const

export const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
export const DAY_LABELS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// ── Hours helpers ─────────────────────────────────────────────────────────────

/**
 * "09:00" -> "9:00 AM" in English, "09:00" in German.
 *
 * Built the 12-hour clock and English AM/PM by hand before, for every language.
 * The locale has to be passed in because this is module scope — components should
 * reach for useDateFormat().clock instead.
 */
export function formatTime(t: string, locale: string): string {
  return formatClock(t, locale)
}

/** Today's hours as a readable label, or "Closed" / "Open 24 hours". */
export function todayHoursLabel(hours: HoursEntry[] | null, is24x7: boolean, locale: string): string {
  if (is24x7) return 'Open 24 hours'
  if (!hours || !hours.length) return 'Hours not set'
  const today = hours.find((h) => h.day === new Date().getDay())
  if (!today || today.closed || !today.open || !today.close) return 'Closed today'
  return `${formatTime(today.open, locale)} – ${formatTime(today.close, locale)}`
}

/** Build a default weekly-hours template (Mon–Sat 9–6, Sun closed). */
export function defaultHours(): HoursEntry[] {
  return [0, 1, 2, 3, 4, 5, 6].map((day) => ({
    day, open: '09:00', close: '18:00', closed: day === 0,
  }))
}
