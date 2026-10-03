import Image from "next/image";
import { C } from "./theme";

const TOPICS = [
  { title: "Reading and viewing", body: "Text size, contrast and layout.", icon: "icon-text", photo: "topic-reading-viewing" },
  { title: "Moving around", body: "Menus, links and finding your way.", icon: "icon-keyboard", photo: "topic-moving-around" },
  { title: "Posting and messaging", body: "Writing posts, comments and messages.", icon: "icon-comment", photo: "topic-posting-messaging" },
  { title: "Photos, video and audio", body: "Descriptions, captions and playback.", icon: "icon-play", photo: "topic-photos-video-audio" },
  { title: "Forms and sign-in", body: "Filling in fields and signing in.", icon: "icon-form", photo: "topic-forms-signin" },
  { title: "Notifications and alerts", body: "Messages that appear or change.", icon: "icon-bell", photo: "topic-notifications-alerts" },
];

/** Section - 04 · TOPICS — "Help by task", a 3x2 (1-col on mobile) card grid. */
export default function Topics() {
  return (
    <section className="w-full bg-white px-5 py-10 lg:px-[105px] lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 lg:gap-10">
        <div className="flex flex-col gap-2.5 lg:gap-[11px]">
          <h2 className="text-[26px] font-extrabold tracking-[-0.26px] lg:text-4xl lg:tracking-[-0.36px]" style={{ color: C.brandDeep }}>
            Help by task
          </h2>
          <p className="text-base leading-[25.6px] lg:text-[17px] lg:leading-[27.2px]" style={{ color: C.muted }}>
            Start from what you&apos;re trying to do.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
          {TOPICS.map((topic) => (
            <article
              key={topic.title}
              className="flex flex-col overflow-hidden rounded-[20px] border bg-white shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]"
              style={{ borderColor: C.line }}
            >
              <div className="relative h-[150px] w-full">
                <div
                  className="absolute inset-0"
                  style={{ backgroundImage: `linear-gradient(135deg, ${C.brand} 0%, ${C.orange} 100%)` }}
                />
                <Image
                  src={`/support&developers-accessibility-support/${topic.photo}-mobile.webp`}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover lg:hidden"
                />
                <Image
                  src={`/support&developers-accessibility-support/${topic.photo}.webp`}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="hidden object-cover lg:block"
                />
                <div
                  className="absolute left-6 top-[128px] flex size-11 items-center justify-center rounded-xl border bg-white shadow-[0px_1px_1px_rgba(7,59,71,0.06)]"
                  style={{ borderColor: C.line }}
                >
                  <Image src={`/support&developers-accessibility-support/${topic.icon}.webp`} alt="" width={20} height={20} />
                </div>
              </div>
              <div className="flex flex-col gap-2 px-6 pb-[22px] pt-[34px]">
                <h3 className="text-lg font-bold tracking-[-0.095px] lg:text-[19px]" style={{ color: C.brandDeep }}>
                  {topic.title}
                </h3>
                <p className="min-h-6 text-[15px]" style={{ color: C.muted }}>
                  {topic.body}
                </p>
                <div className="flex items-center gap-1 pt-1.5">
                  <span className="text-[15px] font-semibold" style={{ color: C.brand }}>
                    See guides
                  </span>
                  <Image src="/support&developers-accessibility-support/icon-chevron-right-sm.webp" alt="" width={16} height={16} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
