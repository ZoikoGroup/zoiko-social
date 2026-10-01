import Image from "next/image";
import { C } from "./theme";
import Link from "next/link";
import { SUPPORT_HREF } from "@/lib/support-links";

const ITEMS = [
  { icon: "icon-book", need: "How-to steps", link: "Help Center" },
  { icon: "icon-code", need: "API reference", link: "API Documentation" },
  { icon: "icon-tool", need: "Help with a private integration", link: "Developer Support" },
  { icon: "icon-tool", need: "Help with your account", link: "Contact Us" },
  { icon: "icon-pulse", need: "To know if something is down", link: "System Status" },
  { icon: "icon-access", need: "Accessibility help", link: "Accessibility Support" },
  { icon: "icon-flag-teal", need: "To report harmful content", link: "Report a concern" },
  { icon: "icon-users", need: "Tips and experiences from others", link: "You're in the right place" },
];

/** Section - 09 · WHEN TO GO OFFICIAL — "Some questions need an official answer", 4x2/2x4 card grid. */
export default function WhenToGoOfficial() {
  return (
    <section className="w-full px-4 py-10 sm:px-8 sm:py-14 lg:px-[105px] lg:py-20" style={{ backgroundColor: C.panel }}>
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 lg:gap-10">
        <div className="flex max-w-[680px] flex-col gap-2.5">
          <h2 className="text-[28px] font-extrabold tracking-[-0.36px] sm:text-3xl lg:text-4xl" style={{ color: C.brandDeep }}>
            Some questions need an official answer
          </h2>
          <p className="text-base leading-[27.2px] sm:text-[17px]" style={{ color: C.muted }}>
            Go straight to the team that owns it.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map((item) => (
            <div
              key={item.need}
              className="flex flex-col justify-between gap-4 rounded-[20px] border bg-white p-[22px]"
              style={{ borderColor: C.line }}
            >
              <span className="flex size-11 items-center justify-center rounded-xl" style={{ backgroundColor: C.chip }}>
                <Image src={`/support&developers-community-forums/${item.icon}.webp`} alt="" width={22} height={22} />
              </span>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm" style={{ color: C.muted }}>
                  If you need
                </p>
                <p className="text-base font-bold" style={{ color: C.ink }}>
                  {item.need}
                </p>
              </div>
              <div className="flex items-center gap-2.5 border-t pt-3.5" style={{ borderColor: C.line }}>
                <Link href={SUPPORT_HREF[item.link] ?? "#"} className="text-base font-bold" style={{ color: C.brand }}>
                  {item.link}
                </Link>
                <Image src="/support&developers-community-forums/icon-chevron-right.webp" alt="" width={16} height={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
