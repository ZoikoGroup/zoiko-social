import type { HoursEntry } from '@/lib/api'

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

/** "09:00" -> "9:00 AM" */
export function formatTime(t: string): string {
  const [hRaw, m] = t.split(':')
  const h = parseInt(hRaw ?? '0', 10)
  const period = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${m ?? '00'} ${period}`
}

/** Today's hours as a readable label, or "Closed" / "Open 24 hours". */
export function todayHoursLabel(hours: HoursEntry[] | null, is24x7: boolean): string {
  if (is24x7) return 'Open 24 hours'
  if (!hours || !hours.length) return 'Hours not set'
  const today = hours.find((h) => h.day === new Date().getDay())
  if (!today || today.closed || !today.open || !today.close) return 'Closed today'
  return `${formatTime(today.open)} – ${formatTime(today.close)}`
}

/** Build a default weekly-hours template (Mon–Sat 9–6, Sun closed). */
export function defaultHours(): HoursEntry[] {
  return [0, 1, 2, 3, 4, 5, 6].map((day) => ({
    day, open: '09:00', close: '18:00', closed: day === 0,
  }))
}
