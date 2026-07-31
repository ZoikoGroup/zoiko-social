import Image from 'next/image'
import Link from 'next/link'

// Server component — the docs section is public (not gated by the auth
// middleware), so this topbar deliberately doesn't depend on useAuth() and
// renders the same way for signed-in members and anonymous visitors alike.
export function DocsTopbar(): React.JSX.Element {
  return (
    <header className="sticky top-0 z-40 bg-surface-container-lowest/95 backdrop-blur border-b border-outline-variant/30 h-16">
      <div className="flex items-center justify-between h-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop">
        <Link href="/docs" className="flex items-center gap-2.5 min-w-0">
          <Image
            src="/logo.svg"
            alt="ZoikoSocial"
            width={32}
            height={32}
            priority
            className="h-8 w-8 rounded-lg object-contain flex-shrink-0"
          />
          <span className="flex flex-col leading-none min-w-0">
            <span className="font-headline font-bold text-on-surface text-[15px] truncate">ZoikoSocial</span>
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-outline">Help Center</span>
          </span>
        </Link>
        <Link
          href="/"
          className="flex-shrink-0 text-[12.5px] sm:text-[13px] font-semibold px-3.5 sm:px-4 py-2 rounded-full bg-primary text-on-primary hover:bg-primary/90 active:scale-[0.97] transition-all"
        >
          Open ZoikoSocial
        </Link>
      </div>
    </header>
  )
}
