/**
 * Age label from a birthdate — "7 mo", "3 yrs". Mirrors the wording the web app
 * shows (apps/web/src/lib/pet.ts) so the assistant quotes the same age the member
 * sees on the pet's profile.
 */
export function ageOf(birthdate: string | null | undefined, now: Date = new Date()): string | null {
  if (!birthdate) return null
  const born = new Date(birthdate)
  if (Number.isNaN(born.getTime())) return null
  const months = Math.max(0, Math.floor((now.getTime() - born.getTime()) / (1000 * 60 * 60 * 24 * 30.44)))
  if (months < 12) return `${months} mo`
  const years = Math.floor(months / 12)
  return `${years} yr${years > 1 ? 's' : ''}`
}
