export function Hero(): React.JSX.Element {
  return (
    <section className="relative flex min-h-screen items-center bg-teal-deep pt-16">
      {/* Decorative grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'linear-gradient(#E8F2F0 1px, transparent 1px), linear-gradient(90deg, #E8F2F0 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-24 text-center">
        <span className="mb-6 inline-block rounded-full border border-amber-light/30 bg-amber-light/10 px-4 py-1.5 text-sm font-medium text-amber-light">
          Coming Soon — Join the Waitlist
        </span>

        <h1 className="mx-auto max-w-4xl font-serif text-5xl font-bold leading-tight text-white md:text-6xl lg:text-7xl">
          The Social Platform Built for{' '}
          <span className="text-amber-light">Animal Lovers</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-teal-wash/80">
          ZoikoSocial is a governed, safety-first community for pet owners, animal rescue
          organisations, vets, breeders, and wildlife advocates — where animal welfare always comes
          first.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#waitlist"
            className="rounded bg-amber-light px-8 py-3.5 text-base font-semibold text-teal-deep hover:bg-amber transition-colors"
          >
            Join the Waitlist
          </a>
          <a
            href="#modules"
            className="rounded border border-teal-wash/30 px-8 py-3.5 text-base font-medium text-teal-wash hover:border-teal-wash/60 transition-colors"
          >
            Explore Modules
          </a>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-teal-wash/60">
          <span>Profanity-free platform</span>
          <span className="hidden md:block">·</span>
          <span>Animal welfare first</span>
          <span className="hidden md:block">·</span>
          <span>Verified news only</span>
          <span className="hidden md:block">·</span>
          <span>Every action auditable</span>
        </div>
      </div>
    </section>
  )
}
