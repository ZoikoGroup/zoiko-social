import Image from "next/image";
import { C } from "./theme";

/**
 * Section - 07 · START A DISCUSSION — post-composer form (title, topic,
 * details) plus a sticky "Similar discussions" / "Official answers" aside.
 * Both aside panels ship empty placeholder copy in Figma (no live matches
 * to show), reproduced verbatim.
 */
export default function StartADiscussion() {
  return (
    <section id="start-a-discussion" className="w-full px-4 py-10 sm:px-8 sm:py-14 lg:px-[105px] lg:py-20" style={{ backgroundColor: C.panel }}>
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 lg:gap-10">
        <div className="flex flex-col gap-2.5">
          <h2 className="text-[28px] font-extrabold tracking-[-0.36px] sm:text-3xl lg:text-4xl" style={{ color: C.brandDeep }}>
            Start a discussion
          </h2>
          <p className="text-base leading-[27.2px] sm:text-[17px]" style={{ color: C.muted }}>
            Check for an existing answer as you type.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-5 rounded-[28px] border bg-white p-6 shadow-[0px_1px_1px_rgba(7,59,71,0.06)] sm:p-9" style={{ borderColor: C.line }}>
            <div className="flex items-center gap-3 rounded-xl px-4 py-3.5" style={{ backgroundColor: C.chip }}>
              <Image src="/support&developers-community-forums/icon-eye.webp" alt="" width={20} height={20} />
              <p className="text-[14.5px] font-semibold" style={{ color: C.brandDeep }}>
                Posts are public. Anyone can read them.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px]" style={{ color: C.muted }}>
                  <span className="font-semibold">Title</span> (required)
                </label>
                <input
                  type="text"
                  placeholder="Ask a clear question"
                  className="h-[46px] w-full rounded-xl border px-3.5 text-[15px] outline-none"
                  style={{ borderColor: C.line, color: C.placeholder }}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px]" style={{ color: C.muted }}>
                  <span className="font-semibold">Topic</span> (required)
                </label>
                <div
                  className="flex h-[46px] w-full items-center justify-between rounded-xl border px-3.5 text-[15px]"
                  style={{ borderColor: C.line, color: C.ink }}
                >
                  Choose a topic
                  <Image src="/support&developers-community-forums/icon-chevron-down.webp" alt="" width={16} height={16} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px]" style={{ color: C.muted }}>
                  <span className="font-semibold">Details</span> (required)
                </label>
                <textarea
                  rows={5}
                  className="w-full resize-none rounded-xl border p-3.5 text-[15px] outline-none"
                  style={{ borderColor: C.line, minHeight: 160 }}
                />
                <p className="pt-1 text-[13.5px] leading-[21.6px]" style={{ color: C.muted }}>
                  Don&apos;t include passwords, codes, addresses or private support details.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t pt-6" style={{ borderColor: C.line }}>
              <button
                type="button"
                className="flex h-11 items-center gap-2 rounded-xl border px-5 text-[15px] font-semibold"
                style={{ borderColor: C.line, color: C.ink }}
              >
                <Image src="/support&developers-community-forums/icon-eye-alt.webp" alt="" width={20} height={20} />
                Preview
              </button>
              <button
                type="button"
                className="flex h-11 items-center gap-2 rounded-xl px-5 text-[15px] font-semibold text-white"
                style={{ backgroundColor: C.brand }}
              >
                <Image src="/support&developers-community-forums/icon-send.webp" alt="" width={20} height={20} />
                Post discussion
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:sticky lg:top-6">
            <div className="flex flex-col gap-3 rounded-[20px] border bg-white p-5" style={{ borderColor: C.line }}>
              <div className="flex items-center gap-2.5">
                <Image src="/support&developers-community-forums/icon-users.webp" alt="" width={20} height={20} />
                <h3 className="text-base font-bold tracking-[-0.08px]" style={{ color: C.brandDeep }}>
                  Similar discussions
                </h3>
              </div>
              <p className="text-sm" style={{ color: C.muted }}>
                Start typing a title to see matches.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-[20px] border bg-white p-5" style={{ borderColor: C.line }}>
              <div className="flex items-center gap-2.5">
                <Image src="/support&developers-community-forums/icon-book.webp" alt="" width={20} height={20} />
                <h3 className="text-base font-bold tracking-[-0.08px]" style={{ color: C.brandDeep }}>
                  Official answers
                </h3>
              </div>
              <p className="text-sm" style={{ color: C.muted }}>
                Matching Help Center articles appear here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
