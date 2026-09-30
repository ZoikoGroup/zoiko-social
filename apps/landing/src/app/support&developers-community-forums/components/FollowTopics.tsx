import Image from "next/image";
import { C } from "./theme";

const TOPICS = [
  { label: "Pet care talk", icon: "icon-heart" },
  { label: "Rescue and adoption", icon: "icon-paw" },
  { label: "Wildlife and conservation", icon: "icon-leaf" },
  { label: "Running a community", icon: "icon-users" },
  { label: "Using Zoiko Social", icon: "icon-sparkle" },
  { label: "Developers", icon: "icon-code" },
];

/**
 * Section - 11 · FOLLOW TOPICS (render-gated) — "Follow the topics you
 * love", a photo panel plus topic-follow pills. Figma marks this section
 * "shown only if forum notifications are approved"; since this route has no
 * real auth/permission state to gate on, it renders unconditionally (same
 * judgment call as platform-features' gated sections) with its "Shown
 * only if forum notifications are approved" badge kept as shipped copy.
 */
export default function FollowTopics() {
  return (
    <section className="w-full px-4 py-10 sm:px-8 sm:py-14 lg:px-[105px] lg:py-20" style={{ backgroundColor: C.panel }}>
      <div
        className="mx-auto flex w-full max-w-[1280px] flex-col overflow-hidden rounded-[32px] border bg-white lg:flex-row"
        style={{ borderColor: C.line }}
      >
        <div className="relative h-[220px] w-full overflow-hidden lg:h-auto lg:min-h-[300px] lg:flex-1">
          <div
            className="absolute inset-0"
            style={{ backgroundImage: `linear-gradient(135deg, ${C.brand} 0%, ${C.orange} 100%)` }}
          />
          <Image
            src="/support&developers-community-forums/follow-topics-cat-photo.webp"
            alt="Cat looking upward"
            fill
            sizes="(min-width: 1024px) 614px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex w-full flex-col justify-center gap-5 p-7 lg:w-[614px] lg:gap-8 lg:p-12">
          <span className="flex size-11 items-center justify-center rounded-xl lg:hidden" style={{ backgroundColor: C.chip }}>
            <Image src="/support&developers-community-forums/icon-bell.webp" alt="" width={22} height={22} />
          </span>
          <span
            className="w-fit rounded-full border border-dashed px-2.5 py-0.5 text-xs font-semibold"
            style={{ backgroundColor: C.orangeFill, borderColor: C.orange, color: C.orangeTextDark }}
          >
            Shown only if forum notifications are approved
          </span>

          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-extrabold tracking-[-0.26px] sm:text-3xl lg:text-4xl lg:tracking-[-0.36px]" style={{ color: C.brandDeep }}>
              Follow the topics you love
            </h2>
            <p className="text-base leading-[27.2px] sm:text-[17px]" style={{ color: C.muted }}>
              Get notified about new discussions. Change or stop anytime.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            {TOPICS.map((topic) => (
              <span
                key={topic.label}
                className="flex items-center gap-2 rounded-full border bg-white px-4 py-2 text-sm font-semibold"
                style={{ borderColor: C.line, color: C.ink }}
              >
                <Image src={`/support&developers-community-forums/${topic.icon}.webp`} alt="" width={16} height={16} />
                {topic.label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
