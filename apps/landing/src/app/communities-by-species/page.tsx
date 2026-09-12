import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock,
  Globe,
  Heart,
  HeartHandshake,
  Info,
  LayoutGrid,
  PawPrint,
  Plus,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { APP_LINKS } from "@/lib/app-links";
import PopularBoard from "./components/PopularBoard";
import { C } from "./components/theme";

export const metadata: Metadata = {
  title: "Popular Communities | Zoiko Social",
  description:
    "See communities with strong current activity on Zoiko Social. Explore what is active now, then review each community's purpose and moderation information before you join.",
};

const BROWSE: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: LayoutGrid, title: "All Communities", body: "Browse every community available for discovery." },
  { icon: PawPrint, title: "By Species", body: "Find a community for a specific animal." },
  {
    icon: ShieldCheck,
    title: "Professional",
    body: "Explore communities run by vets, trainers, and shelters where source classification supports it.",
  },
  { icon: HeartHandshake, title: "Rescue & Adoption", body: "Explore communities focused on fostering, rescue, and adoption." },
  { icon: Clock, title: "Training & Behavior", body: "Explore communities about training and animal behavior." },
  { icon: Globe, title: "Wildlife & Conservation", body: "Explore communities following conservation work around the world." },
  { icon: Heart, title: "Memorial & Support", body: "Find spaces for remembrance and mutual support." },
];

/*
  The comp shows the questions collapsed, so the answers are ours. They stay
  in step with the ranking notice above: Popular is an activity signal, not an
  endorsement, and the platform does not expose the exact signals.
*/
const FAQS = [
  {
    q: "What does Popular mean on Zoiko Social?",
    a: "Popular lists communities with strong current activity. It is a discovery signal drawn from how busy a community is right now — not a review, a ranking of quality, or an endorsement by Zoiko Social.",
  },
  {
    q: "How often does Popular update?",
    a: "Activity is recalculated regularly through the day; the timestamp above the grid shows when this view was last refreshed. The order is held steady while you read, so nothing rearranges under you.",
  },
  {
    q: "Does a higher position mean a community is safer or better?",
    a: "No. Position reflects activity only. Always open a community and read its purpose and standards before joining, whatever its position.",
  },
  {
    q: "Can I browse communities another way?",
    a: "Yes. “Browse another way” above offers every community, plus species, professional, rescue and adoption, training, wildlife, and memorial and support.",
  },
  {
    q: "Can I search within Popular?",
    a: "Yes. The search box filters this list by name and description, and Filters narrows it by category and by whether a community is open to join or needs a request.",
  },
  {
    q: "Why did the order change?",
    a: "Because activity changed. Communities that became busier can move up, and quieter ones move down. The order is never changed in exchange for payment.",
  },
  {
    q: "Are sponsored communities included in Popular?",
    a: "No. Nothing in this list is paid for or promoted. Every position comes from activity signals defined at the platform level.",
  },
  {
    q: "How do I join a community?",
    a: "It depends on the community's access rules. Open communities can be joined straight away; others need a request that a moderator approves. Both are shown on each card.",
  },
];

const heroButton =
  "flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold underline underline-offset-2 transition hover:opacity-90";

export default function PopularCommunitiesPage() {
  return (
    <div className="min-h-screen" style={{ background: C.page }}>
      <div className="mx-auto max-w-[1280px] px-4 pb-20 sm:px-6">
        <header className="flex flex-col gap-1.5 pb-8 pt-7">
          <h1
            className="pt-2 text-3xl font-extrabold leading-tight sm:text-4xl sm:leading-[51px]"
            style={{ color: C.ink }}
          >
            Popular
          </h1>
          <p className="max-w-[600px] text-base leading-6" style={{ color: C.inkDeep }}>
            See communities with strong current activity on Zoiko Social.
          </p>
          <p className="max-w-[600px] text-sm leading-5" style={{ color: C.muted }}>
            Explore what is active now, then review each community&apos;s purpose
            and available moderation information before you join.
          </p>
          <div className="flex flex-col gap-2.5 pt-3 sm:flex-row">
            <a href="#popular-communities" className={heroButton} style={{ background: C.brand, color: "#fff" }}>
              Explore Popular
            </a>
            <Link
              href={APP_LINKS.communities}
              className={heroButton}
              style={{ background: "#fff", color: C.inkDeep, border: `1px solid ${C.line}` }}
            >
              Browse All Communities
            </Link>
          </div>
        </header>

        <section
          className="flex gap-3.5 rounded-3xl px-5 py-4"
          style={{ background: C.chip }}
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white">
            <Info size={20} strokeWidth={1.7} style={{ color: C.brand }} />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-bold leading-6" style={{ color: C.ink }}>
              Active now, ranked for discovery.
            </h2>
            <p className="text-sm leading-5" style={{ color: C.muted }}>
              Ordering may change as community activity changes. Zoiko Social
              defines ranking and eligibility rules at the platform level; exact
              signals are not exposed on this page.
            </p>
            <p className="text-sm font-semibold leading-5" style={{ color: C.ink }}>
              Popular reflects activity-based discovery signals. It does not mean
              a community is endorsed, verified, or right for everyone.
            </p>
          </div>
        </section>

        <div id="popular-communities" className="scroll-mt-24 pt-6">
          <PopularBoard />
        </div>

        <section className="flex flex-col gap-5 pb-4 pt-11">
          <h2 className="text-xl font-extrabold leading-8" style={{ color: C.ink }}>
            Browse another way
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {BROWSE.map(({ icon: Icon, title, body }) => (
              <Link
                key={title}
                href={APP_LINKS.communities}
                className="flex flex-col rounded-[20px] bg-white p-4 transition hover:shadow-[0_8px_24px_rgba(7,59,71,0.08)]"
                style={{ border: `1px solid ${C.line}` }}
              >
                <span
                  className="flex size-9 items-center justify-center rounded-xl"
                  style={{ background: C.chip }}
                >
                  <Icon size={16} strokeWidth={1.8} style={{ color: C.brand }} />
                </span>
                <h3 className="py-5 text-sm font-bold leading-5" style={{ color: C.inkDeep }}>
                  {title}
                </h3>
                <p className="text-xs leading-5" style={{ color: C.muted }}>
                  {body}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section
          className="mt-8 flex flex-col items-center rounded-[32px] px-6 py-12 text-center"
          style={{ background: `linear-gradient(67deg, ${C.ink} 0%, ${C.brand} 65%)` }}
        >
          <h2 className="max-w-[520px] text-xl font-extrabold leading-snug text-white sm:text-2xl sm:leading-10">
            Found a community you want to be part of?
          </h2>
          <p className="mt-3 max-w-[460px] text-sm leading-5 text-white/90">
            Create your Zoiko Social account when you are ready to participate,
            follow, or join according to the community&apos;s access rules.
          </p>
          <div className="mt-6 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href={APP_LINKS.signUp}
              className="flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:w-36"
              style={{ background: C.warm }}
            >
              Join Free
            </Link>
            <Link
              href={APP_LINKS.communities}
              className="flex items-center justify-center rounded-xl border border-white/50 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Browse All Communities
            </Link>
          </div>
        </section>

        <section className="flex flex-col gap-2.5 pb-14 pt-10">
          <h2 className="pb-2.5 text-xl font-extrabold leading-9 sm:text-2xl" style={{ color: C.ink }}>
            Frequently asked questions
          </h2>
          {/* <details> keeps the accordion working without JavaScript, so the
              page stays a server component. */}
          {FAQS.map(({ q, a }) => (
            <details
              key={q}
              className="group overflow-hidden rounded-2xl bg-white"
              style={{ border: `1px solid ${C.line}` }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 [&::-webkit-details-marker]:hidden">
                <span className="text-sm font-bold leading-5" style={{ color: C.inkDeep }}>
                  {q}
                </span>
                <Plus
                  size={18}
                  strokeWidth={2}
                  className="shrink-0 transition-transform group-open:rotate-45"
                  style={{ color: C.brand }}
                />
              </summary>
              <p className="px-4 pb-4 text-sm leading-6" style={{ color: C.muted }}>
                {a}
              </p>
            </details>
          ))}
        </section>
      </div>
    </div>
  );
}
