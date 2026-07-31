import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Info, Lightbulb, TriangleAlert, ShieldAlert } from 'lucide-react'

// Shared typographic building blocks for Help Center articles. Centralizing
// these keeps every doc page visually consistent without pulling in a
// markdown/MDX pipeline for what is a fixed, hand-authored set of pages.

export function DocHeader({
  icon: Icon,
  eyebrow,
  title,
  lead,
}: {
  icon: LucideIcon
  eyebrow: string
  title: string
  lead: string
}): React.JSX.Element {
  return (
    <header className="mb-10">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-primary" />
        </div>
        <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-outline">{eyebrow}</span>
      </div>
      <h1 className="font-headline text-headline-lg md:text-headline-xl font-bold text-on-surface mb-4 leading-tight">
        {title}
      </h1>
      <p className="text-body-lg text-on-surface-variant leading-relaxed">{lead}</p>
    </header>
  )
}

export function JumpLinks({ items }: { items: { href: string; label: string }[] }): React.JSX.Element {
  return (
    <nav aria-label="On this page" className="mb-10 p-4 rounded-xl bg-surface-container-low border border-outline-variant/30">
      <p className="text-[11px] font-bold uppercase tracking-wide text-outline mb-2.5">On this page</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="text-[12.5px] font-medium px-3 py-1.5 rounded-full bg-surface-container-lowest border border-outline-variant/30 text-on-surface-variant hover:text-primary hover:border-primary/40 transition-colors"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  )
}

export function H2({ id, children }: { id: string; children: ReactNode }): React.JSX.Element {
  return (
    <h2
      id={id}
      className="scroll-mt-28 font-headline text-headline-md font-bold text-on-surface mt-14 mb-4 pb-3 border-b border-outline-variant/30 first:mt-0"
    >
      {children}
    </h2>
  )
}

export function H3({ children }: { children: ReactNode }): React.JSX.Element {
  return <h3 className="text-[16.5px] font-bold text-on-surface mt-8 mb-3">{children}</h3>
}

export function P({ children }: { children: ReactNode }): React.JSX.Element {
  return <p className="text-body-md text-on-surface-variant leading-relaxed mb-4">{children}</p>
}

export function UL({ children }: { children: ReactNode }): React.JSX.Element {
  return (
    <ul className="space-y-2.5 mb-6 text-body-md text-on-surface-variant leading-relaxed list-disc pl-5 marker:text-primary">
      {children}
    </ul>
  )
}

export function LI({ children }: { children: ReactNode }): React.JSX.Element {
  return <li>{children}</li>
}

export function Strong({ children }: { children: ReactNode }): React.JSX.Element {
  return <strong className="text-on-surface font-semibold">{children}</strong>
}

type CalloutVariant = 'tip' | 'note' | 'warning' | 'safety'

const CALLOUT_STYLES: Record<CalloutVariant, { icon: LucideIcon; wrap: string; iconClass: string }> = {
  tip: { icon: Lightbulb, wrap: 'bg-primary/5 border-primary/20', iconClass: 'text-primary' },
  note: { icon: Info, wrap: 'bg-surface-container border-outline-variant/40', iconClass: 'text-outline' },
  warning: { icon: TriangleAlert, wrap: 'bg-secondary/10 border-secondary/30', iconClass: 'text-secondary' },
  safety: { icon: ShieldAlert, wrap: 'bg-error/5 border-error/25', iconClass: 'text-error' },
}

export function Callout({
  variant = 'note',
  title,
  children,
}: {
  variant?: CalloutVariant
  title?: string
  children: ReactNode
}): React.JSX.Element {
  const { icon: Icon, wrap, iconClass } = CALLOUT_STYLES[variant]
  return (
    <div className={`flex gap-3 rounded-xl border p-4 mb-6 ${wrap}`}>
      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${iconClass}`} />
      <div className="text-[13.5px] leading-relaxed text-on-surface-variant">
        {title && <p className="font-semibold text-on-surface mb-1">{title}</p>}
        {children}
      </div>
    </div>
  )
}

export function Steps({ items }: { items: { title: string; body: ReactNode }[] }): React.JSX.Element {
  return (
    <ol className="space-y-5 mb-8">
      {items.map((step, i) => (
        <li key={step.title} className="flex gap-4">
          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-on-primary text-[13px] font-bold flex items-center justify-center mt-0.5">
            {i + 1}
          </span>
          <div className="pt-0.5">
            <p className="font-semibold text-on-surface text-[15px] mb-1">{step.title}</p>
            <div className="text-body-md text-on-surface-variant leading-relaxed">{step.body}</div>
          </div>
        </li>
      ))}
    </ol>
  )
}

export function FeatureGrid({
  items,
}: {
  items: { icon: LucideIcon; title: string; body: string }[]
}): React.JSX.Element {
  return (
    <div className="grid sm:grid-cols-2 gap-4 mb-8">
      {items.map((item) => (
        <div key={item.title} className="rounded-xl border border-outline-variant/30 bg-surface-container-lowest p-4">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
            <item.icon className="w-[18px] h-[18px] text-primary" />
          </div>
          <p className="font-semibold text-on-surface text-[14.5px] mb-1">{item.title}</p>
          <p className="text-[13px] text-on-surface-variant leading-relaxed">{item.body}</p>
        </div>
      ))}
    </div>
  )
}

export function DocTable({
  headers,
  rows,
}: {
  headers: string[]
  rows: ReactNode[][]
}): React.JSX.Element {
  return (
    <div className="overflow-x-auto mb-8 rounded-xl border border-outline-variant/30">
      <table className="w-full text-[13px] text-left border-collapse">
        <thead>
          <tr className="bg-surface-container-low">
            {headers.map((h) => (
              <th key={h} className="px-4 py-2.5 font-semibold text-on-surface border-b border-outline-variant/30 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-outline-variant/20 last:border-0">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 text-on-surface-variant align-top">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
