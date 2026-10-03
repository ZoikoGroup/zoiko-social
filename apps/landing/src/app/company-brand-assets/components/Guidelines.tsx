import Image from "next/image";
import Section from "./Section";
import { COLORS, IMG, JAKARTA_FONT, MEDIA_KIT_ITEMS, MEDIA_KIT_REQUEST, PRINCIPLES, TYPE_SCALE } from "./content";
import { C } from "./theme";

const PHOTO = "relative aspect-[591/411] w-full overflow-hidden rounded-3xl shadow-[0px_20px_48px_0px_rgba(7,59,71,0.16)]";

export function ColorSystem() {
  return (
    <Section
      id="colors"
      tinted
      title="Brand color system"
      intro="Official Zoiko Social colors for digital and print applications. All colors meet WCAG AA contrast standards."
    >
      <div className="grid grid-cols-2 gap-3 pt-2 sm:grid-cols-3 sm:gap-4 sm:pt-7 lg:grid-cols-6">
        {COLORS.map((c) => (
          <div key={c.hex} className="overflow-hidden rounded-[20px] bg-white" style={{ border: `1px solid ${C.line}` }}>
            <div
              className="flex h-24 items-center justify-center text-xs font-bold sm:h-28"
              style={{ background: c.hex, color: c.dark ? "#fff" : c.hex === "#EEF8F9" ? C.brand : C.ink }}
            >
              {c.swatch}
            </div>
            <div className="flex flex-col gap-1.5 px-4 pb-4 pt-3.5" style={{ borderTop: `1px solid ${C.line}` }}>
              <p className="text-sm font-bold leading-6" style={{ color: C.ink }}>
                {c.name}
              </p>
              <p className="font-inter text-xs leading-5" style={{ color: C.muted }}>
                {c.hex} / <span className="whitespace-nowrap">RGB({c.rgb})</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function Typography() {
  return (
    <Section title="Typography system" intro="Official typeface and sizing specifications for all Zoiko Social communications.">
      <div className="grid items-center gap-10 pt-2 sm:pt-7 md:grid-cols-2 lg:gap-12">
        <div className="flex flex-col gap-3">
          <h3 className="text-xl font-bold" style={{ color: C.warm }}>
            Font family: Plus Jakarta Sans
          </h3>
          <p className="text-base leading-7" style={{ color: C.muted }}>
            <strong>Primary typeface:</strong> Plus Jakarta Sans (open source, free license)
          </p>
          <p className="pt-2 text-base leading-7" style={{ color: C.muted }}>
            <strong>Fallback stack:</strong> -apple-system, BlinkMacSystemFont, sans-serif
          </p>
          <dl className="pt-3">
            {TYPE_SCALE.map(([k, v]) => (
              <div key={k} className="py-3 text-base" style={{ color: C.ink }}>
                <dt className="inline font-bold">{k}</dt> <dd className="inline">{v}</dd>
              </div>
            ))}
          </dl>
          <a
            href={JAKARTA_FONT}
            target="_blank"
            rel="noopener noreferrer"
            className="self-start pt-3 text-sm font-semibold hover:underline"
            style={{ color: C.brand }}
          >
            Get Plus Jakarta Sans →
          </a>
        </div>
        <div className={PHOTO} style={{ background: "#FDE77E" }}>
          <Image
            src={`${IMG}typography.webp`}
            alt="Wooden letters A to Z on a yellow background"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-contain"
          />
        </div>
      </div>
    </Section>
  );
}

export function UsagePrinciples() {
  return (
    <Section tinted title="Brand usage principles" intro="Guidelines for using Zoiko Social brand assets correctly across all media.">
      <div className="grid gap-4 pt-2 sm:pt-7 md:grid-cols-3">
        {PRINCIPLES.map((p) => (
          <div key={p.title} className="flex flex-col gap-2 rounded-[20px] p-6" style={{ background: C.chip, border: `1px solid ${C.brand}` }}>
            <h3 className="text-base font-bold" style={{ color: C.brand }}>
              {p.title}
            </h3>
            <p className="text-sm leading-6" style={{ color: C.muted }}>
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function MediaKit() {
  return (
    <Section
      title="Media kit and press resources"
      intro="Official press materials, company facts, and media contact information for journalists and partners."
    >
      <div className="grid items-center gap-10 pt-2 sm:pt-7 md:grid-cols-2 lg:gap-12">
        <div className="flex flex-col gap-3">
          <h3 className="text-xl font-bold" style={{ color: C.warm }}>
            Complete Media Kit
          </h3>
          <p className="text-base leading-7" style={{ color: C.muted }}>
            Includes company overview, founding information, product facts, team bios, press-ready assets, and
            high-resolution images.
          </p>
          <ul className="pb-7 pt-3">
            {MEDIA_KIT_ITEMS.map((i) => (
              <li key={i} className="py-3 text-base" style={{ color: C.ink }}>
                <span aria-hidden>✓ </span>
                {i}
              </li>
            ))}
          </ul>
          <a
            href={MEDIA_KIT_REQUEST}
            className="self-start rounded-xl px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
            style={{ background: C.warm }}
          >
            Download Media Kit (ZIP)
          </a>
        </div>
        <div className={PHOTO}>
          <Image
            src={`${IMG}media-kit.webp`}
            alt="A notebook, coloured pencils, sticky notes and coffee on a marble desk"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </Section>
  );
}
