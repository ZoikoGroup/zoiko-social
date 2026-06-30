export function Footer(): React.JSX.Element {
  return (
    <footer className="border-t border-teal-wash bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 md:flex-row">
        <span className="font-serif text-lg font-bold text-teal-deep">
          Zoiko<span className="text-amber-light">Social</span>
        </span>
        <p className="text-sm text-teal-muted">
          Built by Zoiko Media Corp · Animal welfare above all
        </p>
        <div className="flex gap-6 text-sm text-teal-muted">
          <a href="#" className="hover:text-teal-deep transition-colors">Privacy</a>
          <a href="#" className="hover:text-teal-deep transition-colors">Terms</a>
          <a href="#" className="hover:text-teal-deep transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  )
}
