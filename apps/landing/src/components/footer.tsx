// The web app is a separate deployment from this landing site, so the Help
// Center link needs an absolute URL. NEXT_PUBLIC_APP_URL is already the
// documented convention for "public web app URL" (see DEPLOYMENT.md); the
// localhost fallback matches the value SETUP.md has developers use locally.
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

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
          <a href={`${APP_URL}/docs`} className="hover:text-teal-deep transition-colors">Help Center</a>
          <a href="#" className="hover:text-teal-deep transition-colors">Privacy</a>
          <a href="#" className="hover:text-teal-deep transition-colors">Terms</a>
          <a href="#" className="hover:text-teal-deep transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  )
}
