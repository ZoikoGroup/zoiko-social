import Image from "next/image";
import { C } from "./theme";

const SAMPLE_POSTS = [
  {
    tags: ["Community", "Rescue and adoption"],
    title: "First week with a rescue dog: what helped you?",
  },
  {
    tags: ["Community", "Official reference"],
    title: "Best way to organize a local cat community",
  },
];

/**
 * Section - 02 · HERO + SEARCH.
 *
 * Two-column hero: a gradient-bordered community photo with two floating
 * "recent post" preview cards on the left, and the "Community Forums"
 * heading, intro copy, search box, primary actions and Help Center note on
 * the right. Mobile stacks the copy/search/actions first, then the photo
 * below (per the Figma mobile frame, node 1274:7367).
 */
export default function Hero() {
  return (
    <section className="w-full border-b bg-white py-8 lg:py-14" style={{ borderColor: C.line }}>
      <div className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-0">
        <div className="order-2 flex w-full flex-col items-start py-6 pl-4 pr-4 sm:pl-8 sm:pr-8 lg:order-1 lg:py-6 lg:pl-0 lg:pr-0">
          <div className="relative h-[280px] w-full sm:h-[380px] lg:h-[531px]">
            <div className="absolute inset-0 overflow-hidden rounded-3xl lg:rounded-l-none lg:rounded-r-[32px]">
              <div
                className="absolute inset-0"
                style={{ backgroundImage: `linear-gradient(135deg, ${C.brand} 0%, ${C.orange} 100%)` }}
              />
              <Image
                src="/support&developers-community-forums/hero-community-photo-mobile.webp"
                alt="Two dogs running together outdoors"
                fill
                priority
                sizes="100vw"
                className="object-cover lg:hidden"
              />
              <Image
                src="/support&developers-community-forums/hero-community-photo.webp"
                alt="Group of community members smiling together"
                fill
                priority
                sizes="(min-width: 1024px) 684px, 100vw"
                className="hidden object-cover lg:block"
              />
            </div>

            <div className="absolute bottom-4 right-4 z-10 hidden w-[220px] flex-col gap-2 sm:bottom-6 sm:right-6 sm:w-[280px] lg:bottom-[49px] lg:-right-12 lg:flex lg:w-[340px]">
              {SAMPLE_POSTS.map((post, i) => (
                <div
                  key={post.title}
                  className="flex flex-col gap-[7.125px] rounded-[20px] border bg-white px-[18px] py-4 shadow-[0px_20px_24px_rgba(7,59,71,0.16)]"
                  style={{ borderColor: C.line, marginLeft: i === 1 ? 36 : 0 }}
                >
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag, ti) => (
                      <span
                        key={tag}
                        className={`inline-flex items-center gap-[5px] rounded-full border text-xs font-semibold ${
                          ti === 0 ? "px-2.5 pb-[3.5px] pt-[2.5px]" : "px-2.5 pb-[4.5px] pt-[3.5px]"
                        }`}
                        style={
                          ti === 0
                            ? { backgroundColor: C.panel, borderColor: C.line, color: C.ink }
                            : { backgroundColor: C.chip, borderColor: "transparent", color: C.brandDeep }
                        }
                      >
                        {tag === "Official reference" && (
                          <Image src="/support&developers-community-forums/icon-book.webp" alt="" width={16} height={16} />
                        )}
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-[15px] font-bold leading-[20.25px]" style={{ color: C.brandDeep }}>
                    {post.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="order-1 flex flex-col items-start gap-3 px-4 sm:px-8 py-2 lg:order-2 lg:px-[104px] lg:py-0">
          <p className="text-xs font-bold uppercase tracking-[1.44px]" style={{ color: C.brand }}>
            Support &amp; Developers
          </p>
          <h1
            className="text-[30px] font-extrabold leading-[32.4px] tracking-[-0.6px] sm:text-4xl lg:text-[48px] lg:leading-[51.84px] lg:tracking-[-0.96px]"
            style={{ color: C.brandDeep }}
          >
            Community Forums
          </h1>
          <p className="max-w-[560px] text-base leading-[24.8px] sm:text-lg lg:text-lg lg:leading-[27.9px]" style={{ color: C.muted }}>
            Ask questions, share tips and learn from other members.
          </p>

          <div className="flex w-full max-w-[560px] flex-col gap-2.5 pt-4">
            <label className="pl-1 text-sm font-bold" style={{ color: C.ink }}>
              Search community discussions
            </label>
            <div
              className="flex w-full items-center gap-2 rounded-2xl border bg-white py-1.5 pl-3.5 pr-1.5 shadow-[0px_8px_12px_rgba(7,59,71,0.1)] sm:pl-5"
              style={{ borderColor: C.line }}
            >
              <Image src="/support&developers-community-forums/icon-search.webp" alt="" width={22} height={22} />
              <input
                type="text"
                placeholder="For example: rescue dog tips"
                className="min-w-0 flex-1 bg-transparent py-3 text-[15px] outline-none sm:text-[17px]"
                style={{ color: C.placeholder }}
              />
              <button
                type="button"
                aria-label="Search"
                className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-[15px] font-semibold text-white sm:px-6"
                style={{ backgroundColor: C.brand }}
              >
                <Image src="/support&developers-community-forums/icon-search-white.webp" alt="" width={20} height={20} />
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>

          <div className="flex w-full flex-wrap items-center gap-3 pt-5">
            <button
              type="button"
              className="flex h-11 items-center justify-center gap-2 rounded-xl border px-5 text-[15px] font-semibold"
              style={{ borderColor: C.line, color: C.ink }}
            >
              <Image src="/support&developers-community-forums/icon-layers.webp" alt="" width={20} height={20} />
              Browse discussions
            </button>
            <button
              type="button"
              className="flex h-11 items-center justify-center gap-2 rounded-xl border px-5 text-[15px] font-semibold"
              style={{ borderColor: C.line, color: C.ink }}
            >
              <Image src="/support&developers-community-forums/icon-edit.webp" alt="" width={20} height={20} />
              Start a discussion
            </button>
          </div>

          <div className="flex items-center gap-2.5 pt-5">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px]" style={{ backgroundColor: C.chip }}>
              <Image src="/support&developers-community-forums/icon-users.webp" alt="" width={18} height={18} />
            </span>
            <p className="text-sm leading-[22.4px]" style={{ color: C.muted }}>
              Community answers are peer advice. For official help, visit the{" "}
              <a href="#" className="font-semibold underline" style={{ color: C.brand }}>
                Help Center
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
