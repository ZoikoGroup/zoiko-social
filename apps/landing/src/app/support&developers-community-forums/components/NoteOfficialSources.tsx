import Image from "next/image";

const LINKS = [
  { icon: "icon-book-white", label: "Help Center" },
  { icon: "icon-code", label: "API Documentation" },
  { icon: "icon-tool", label: "Developer Support" },
  { icon: "icon-pulse", label: "System Status" },
  { icon: "icon-chat", label: "Contact Us" },
];

/**
 * Note - Official sources — dark teal band right after the hero.
 *
 * Shield icon + "Need an official answer? These teams own Zoiko Social
 * guidance." on the left, five pill links (Help Center, API Documentation,
 * Developer Support, System Status, Contact Us) on the right, each with its
 * own icon. Matches Figma node 1274:6286.
 */
export default function NoteOfficialSources() {
  return (
    <section className="w-full px-4 py-6 sm:px-8 lg:px-[105px] lg:py-7" style={{ backgroundColor: "#073B47" }}>
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-5 lg:flex-row lg:flex-wrap lg:items-center lg:justify-between">
        <div className="flex max-w-[420px] items-center gap-3.5">
          <span
            className="flex size-11 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
          >
            <Image src="/support&developers-community-forums/icon-shield.png" alt="" width={22} height={22} />
          </span>
          <div className="flex flex-col">
            <p className="text-[17px] font-bold leading-[27.2px] text-white">Need an official answer?</p>
            <p className="text-sm leading-[22.4px]" style={{ color: "#BFE3E8" }}>
              These teams own Zoiko Social guidance.
            </p>
          </div>
        </div>

        <nav className="flex flex-wrap items-start gap-2">
          {LINKS.map((link) => (
            <a
              key={link.label}
              href="#"
              className="flex min-h-10 items-center gap-2 rounded-full border px-3.5 text-sm font-semibold text-white"
              style={{ borderColor: "rgba(255,255,255,0.25)" }}
            >
              <Image src={`/support&developers-community-forums/${link.icon}.png`} alt="" width={16} height={16} />
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
