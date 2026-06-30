export function Nav(): React.JSX.Element {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-teal-wash/60 bg-paper/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <span className="font-serif text-xl font-bold text-teal-deep">
          Zoiko<span className="text-amber-light">Social</span>
        </span>
        <nav className="hidden items-center gap-8 text-sm font-medium text-teal-muted md:flex">
          <a href="#features" className="hover:text-teal-deep transition-colors">Features</a>
          <a href="#modules" className="hover:text-teal-deep transition-colors">Modules</a>
          <a href="#waitlist" className="hover:text-teal-deep transition-colors">Join Waitlist</a>
        </nav>
        <a
          href="#waitlist"
          className="rounded bg-amber-light px-4 py-2 text-sm font-semibold text-teal-deep hover:bg-amber transition-colors"
        >
          Get Early Access
        </a>
      </div>
    </header>
  )
}
