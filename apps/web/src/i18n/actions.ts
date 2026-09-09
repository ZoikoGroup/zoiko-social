'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, isLocale } from './config'

/**
 * Stores the chosen locale and re-renders.
 *
 * A server action rather than a client-side cookie write: the locale is read on
 * the server for every render, so it has to be set before the next render rather
 * than after it. revalidatePath('/', 'layout') clears the whole tree because the
 * root layout is what reads the locale.
 */
export async function setLocale(value: string): Promise<void> {
  if (!isLocale(value)) return

  const cookieStore = await cookies()
  cookieStore.set(LOCALE_COOKIE, value, {
    maxAge: LOCALE_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
    // Readable by the client switcher to show the current selection; it holds a
    // display preference, nothing sensitive.
    httpOnly: false,
  })

  revalidatePath('/', 'layout')
}
