import Image from "next/image";
import { C } from "./theme";
import Link from "next/link";

const FILTERS = [
  { label: "All topics", icon: null },
  { label: "Pet care talk", icon: "icon-heart" },
  { label: "Rescue and adoption", icon: "icon-paw" },
  { label: "Wildlife and conservation", icon: "icon-leaf" },
  { label: "Running a community", icon: "icon-users" },
  { label: "Using Zoiko Social", icon: "icon-sparkle" },
  { label: "Developers", icon: "icon-code" },
];

const DISCUSSIONS = [
  {
    icon: "icon-paw",
    title: "First week with a rescue dog: what helped you?",
    body: "Looking for routines that helped a shy dog settle in.",
    tags: [{ label: "Rescue and adoption" }],
    updated: "Updated 2 hr ago",
  },
  {
    icon: "icon-users",
    title: "Best way to organize a local cat community",
    body: "How do you keep events and posts easy to find?",
    tags: [{ label: "Running a community" }, { label: "Official reference", icon: "icon-book" }],
    updated: "Updated 5 hr ago",
  },
  {
    icon: "icon-leaf",
    title: "Photos of hedgehogs in the garden, is it safe to feed them?",
    body: "Seeing them every night and want to help without harm.",
    tags: [{ label: "Wildlife and conservation" }],
    updated: "Updated Yesterday",
  },
  {
    icon: "icon-paw",
    title: "How do you plan posts for an adoption drive?",
    body: "Sharing what worked for our shelter's last event.",
    tags: [{ label: "Rescue and adoption" }],
    updated: "Updated Yesterday",
  },
  {
    icon: "icon-heart",
    title: "Tips for introducing a new cat to a dog",
    body: "Slow intros, scent swapping and what to avoid.",
    tags: [{ label: "Pet care talk" }],
    updated: "Updated 2 days ago",
  },
  {
    icon: "icon-sparkle",
    title: "Which events features do you use most?",
    body: "Curious how other organizers set up RSVPs.",
    tags: [{ label: "Using Zoiko Social" }, { label: "Official reference", icon: "icon-book" }],
    updated: "Updated 3 days ago",
  },
  {
    icon: "icon-code",
    title: "Sharing webhook retry strategies",
    body: "How are you handling duplicate events?",
    tags: [{ label: "Developers" }, { label: "Official reference", icon: "icon-book" }],
    updated: "Updated 4 days ago",
  },
  {
    icon: "icon-leaf",
    title: "Volunteer ideas for bird rescue centers",
    body: "Roles that don't need specialist training.",
    tags: [{ label: "Wildlife and conservation" }, { label: "Closed to replies", icon: "icon-lock" }],
    updated: "Updated 1 week ago",
  },
];

/**
 * Section - 05 · DISCUSSIONS (+ search results) — "Recent discussions":
 * topic filter pills followed by an 8-item discussion list. The filter
 * pills are static (no client-side filtering wired up — see the page-level
 * doc comment).
 */
export default function RecentDiscussions() {
  return (
    <section id="recent-discussions" className="w-full px-4 py-10 sm:px-8 sm:py-14 lg:px-[105px] lg:py-20" style={{ backgroundColor: C.panel }}>
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div className="flex flex-col gap-1.5">
            <h2 className="text-[28px] font-extrabold tracking-[-0.36px] sm:text-3xl lg:text-4xl" style={{ color: C.brandDeep }}>
              Recent discussions
            </h2>
            <p className="text-[13px] font-semibold" style={{ color: C.muted }}>
              8 community discussions · peer advice, not official
            </p>
          </div>
          <Link
            href="#start-a-discussion"
            className="flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold text-white"
            style={{ backgroundColor: C.brand }}
          >
            <Image src="/support&developers-community-forums/icon-edit.webp" alt="" width={20} height={20} />
            Start a discussion
          </Link>
        </div>

        <div className="flex flex-wrap gap-2">
          {FILTERS.map((filter, i) => (
            <button
              key={filter.label}
              type="button"
              className="flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold"
              style={
                i === 0
                  ? { backgroundColor: C.brand, borderColor: C.brand, color: "white" }
                  : { backgroundColor: "white", borderColor: C.line, color: C.ink }
              }
            >
              {filter.icon && (
                <Image src={`/support&developers-community-forums/${filter.icon}.webp`} alt="" width={16} height={16} />
              )}
              {filter.label}
            </button>
          ))}
        </div>

        <div className="flex w-full flex-col overflow-hidden rounded-[20px] border bg-white" style={{ borderColor: C.line }}>
          {DISCUSSIONS.map((item, i) => (
            <div
              key={item.title}
              className={`flex flex-col gap-3 px-5 py-6 sm:flex-row sm:items-center sm:gap-3 lg:px-8 ${i < DISCUSSIONS.length - 1 ? "border-b" : ""}`}
              style={{ borderColor: C.line }}
            >
              <span
                className="flex size-11 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: C.chip }}
              >
                <Image src={`/support&developers-community-forums/${item.icon}.webp`} alt="" width={22} height={22} />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5 pl-0 sm:pl-1">
                <h3 className="text-base font-bold tracking-[-0.082px] sm:text-[16.5px]" style={{ color: C.brandDeep }}>
                  {item.title}
                </h3>
                <p className="text-sm" style={{ color: C.muted }}>
                  {item.body}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
                  {item.tags.map((tag) => (
                    <span
                      key={tag.label}
                      className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                      style={
                        tag.label === "Closed to replies"
                          ? { backgroundColor: "white", border: `1px solid ${C.line}`, color: C.ink }
                          : { backgroundColor: C.chip, color: C.brandDeep }
                      }
                    >
                      {tag.icon && (
                        <Image src={`/support&developers-community-forums/${tag.icon}.webp`} alt="" width={16} height={16} />
                      )}
                      {tag.label}
                    </span>
                  ))}
                </div>
              </div>
              <span className="pl-14 text-[13px] sm:pl-0 sm:text-right" style={{ color: C.muted }}>
                {item.updated}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
