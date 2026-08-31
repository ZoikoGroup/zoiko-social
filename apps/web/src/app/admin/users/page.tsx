import { redirect } from 'next/navigation'

/**
 * Kept as a redirect, not deleted.
 *
 * This was a page of its own before the admin panel was consolidated onto a
 * single screen. Bookmarks, links inside the app and anything written down in a
 * runbook still point here, and a 404 is a worse answer than a redirect.
 */
export default function AdminSectionRedirect(): never {
  redirect('/admin?s=people')
}
