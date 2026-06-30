'use client'

import { useState } from 'react'

export function Waitlist(): React.JSX.Element {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    // TODO: wire to API endpoint or Resend/Mailchimp
    setSubmitted(true)
  }

  return (
    <section id="waitlist" className="bg-teal-deep py-24">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="font-serif text-4xl font-bold text-white">
          Be the first to join
        </h2>
        <p className="mt-4 text-lg text-teal-wash/80">
          ZoikoSocial is launching soon. Join the waitlist and get early access.
        </p>

        {submitted ? (
          <div className="mt-10 rounded-lg border border-amber-light/30 bg-amber-light/10 px-8 py-6">
            <p className="text-lg font-semibold text-amber-light">You&apos;re on the list!</p>
            <p className="mt-1 text-sm text-teal-wash/70">We&apos;ll email you as soon as early access opens.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 rounded border border-teal-mid bg-teal-mid/50 px-4 py-3 text-white placeholder-teal-muted outline-none focus:border-amber-light focus:ring-1 focus:ring-amber-light"
            />
            <button
              type="submit"
              className="rounded bg-amber-light px-8 py-3 font-semibold text-teal-deep hover:bg-amber transition-colors whitespace-nowrap"
            >
              Join Waitlist
            </button>
          </form>
        )}

        <p className="mt-4 text-xs text-teal-muted">
          No spam. Unsubscribe any time. We care about privacy as much as we care about animals.
        </p>
      </div>
    </section>
  )
}
