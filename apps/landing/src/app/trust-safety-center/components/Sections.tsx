import Image from "next/image";
import Link from "next/link";
import { APP_LINKS } from "@/lib/app-links";
import { COMMITMENTS, EVIDENCE, HELP, HERO_STATS, IMG, IMPACT, JOURNEY, PILLARS, REPORT_STEPS } from "./content";
import { C } from "./theme";

const PAD = "px-4 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20 xl:px-28";
const H2 = "text-center text-2xl font-extrabold leading-tight sm:text-4xl sm:leading-[57.6px]";
const CARD_BORDER = { border: `1px solid ${C.line}` };

function Frame({ tinted, children }: { tinted?: boolean; children: React.ReactNode }) {
  return (
    <section className={PAD} style={{ background: tinted ? C.panel : "#fff" }}>
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8 sm:gap-12">{children}</div>
    </section>
  );
}

function Title({ children, left }: { children: React.ReactNode; left?: boolean }) {
  return (
    <h2 className={`${H2} ${left ? "sm:text-left" : ""}`} style={{ color: C.ink }}>
      {children}
    </h2>
  );
}

export function Hero() {
  return (
    <section className={`${PAD} bg-white`}>
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 lg:grid-cols-[minmax(0,636px)_minmax(0,530px)] lg:justify-between">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl sm:leading-[57.6px]" style={{ color: C.ink }}>
            Trust Starts With <br className="hidden sm:block" />
            Transparency
          </h1>
          <p className="text-base leading-7 sm:text-lg sm:leading-8" style={{ color: C.muted }}>
            At Zoiko Social, safety isn’t an afterthought — it’s built into everything we do. We’re open about how we
            moderate, committed to fairness, and accountable to our community.
          </p>
          <div className="flex flex-col gap-4 pt-2 min-[440px]:flex-row min-[440px]:flex-wrap sm:gap-5">
            <Link
              href="/safety-community-standards"
              className="flex min-h-12 items-center justify-center rounded-[20px] px-8 py-4 text-base font-semibold text-white transition hover:opacity-90 sm:py-5"
              style={{ background: C.brand }}
            >
              Explore Our Policies
            </Link>
            <Link
              href="/safety-how-moderation-works"
              className="flex min-h-12 items-center justify-center rounded-[20px] bg-white px-8 py-4 text-base font-semibold transition hover:bg-neutral-50 sm:py-5"
              style={{ color: C.brand, border: `2px solid ${C.brand}` }}
            >
              Learn Our Approach
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {HERO_STATS.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col gap-2.5 rounded-[20px] bg-white p-5 shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)] sm:p-6 ${i === 2 ? "col-span-2" : ""}`}
              style={CARD_BORDER}
            >
              <p className="text-2xl font-extrabold leading-10 sm:text-3xl" style={{ color: C.warm }}>
                {s.value}
              </p>
              <p className="text-xs font-semibold leading-5" style={{ color: C.muted }}>
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowWeBuildTrust() {
  return (
    <Frame tinted>
      <Title>How We Build Trust</Title>
      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-4 lg:gap-8">
        {PILLARS.map((p) => (
          <div key={p.title} className="flex flex-col items-center gap-3 rounded-[20px] bg-white px-3 py-6 text-center sm:gap-4 sm:px-8 sm:py-8 lg:py-14" style={CARD_BORDER}>
            <Image src={`${IMG}${p.icon}.webp`} alt="" width={48} height={48} className="size-10 sm:size-12" />
            <h3 className="text-sm font-bold leading-5 sm:text-base sm:leading-6" style={{ color: C.ink }}>
              {p.title}
            </h3>
            <p className="max-w-[230px] text-xs leading-5 sm:text-sm sm:leading-6" style={{ color: C.muted }}>
              {p.body}
            </p>
          </div>
        ))}
      </div>
    </Frame>
  );
}

export function TrustJourney() {
  return (
    <Frame>
      <Title>Our Trust Journey</Title>
      <div className="grid gap-6 md:grid-cols-3 lg:gap-8">
        {JOURNEY.map((j) => (
          <article key={j.title} className="overflow-hidden rounded-[20px] bg-white" style={CARD_BORDER}>
            <div className="relative h-40">
              <Image src={`${IMG}${j.image}.webp`} alt={j.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
            </div>
            <div className="flex flex-col gap-2 px-6 pb-8 pt-6 lg:px-11">
              <h3 className="text-lg font-bold leading-7" style={{ color: C.ink }}>
                {j.title}
              </h3>
              <p className="text-sm leading-6" style={{ color: C.muted }}>
                {j.body}
              </p>
            </div>
          </article>
        ))}
      </div>
    </Frame>
  );
}

export function EvidenceBasedTrust() {
  return (
    <Frame tinted>
      <Title>Evidence-Based Trust</Title>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-8 lg:gap-12">
        {EVIDENCE.map((e) => (
          <div key={e.label} className="flex flex-col items-center gap-4 rounded-3xl bg-white p-8 text-center sm:p-12" style={{ border: `2px solid ${C.line}` }}>
            <p className="text-5xl font-extrabold sm:text-6xl sm:leading-[89.6px]" style={{ color: C.brand }}>
              {e.value}
            </p>
            <p className="text-base font-semibold leading-6" style={{ color: C.muted }}>
              {e.label}
            </p>
          </div>
        ))}
      </div>
    </Frame>
  );
}

export function WhereToFindHelp() {
  return (
    <Frame>
      <Title>Where to Find Help</Title>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8">
        {HELP.map((h) => (
          <Link
            key={h.title}
            href={h.href}
            className="flex items-center gap-4 rounded-[20px] bg-white p-5 transition hover:shadow-[0px_8px_24px_0px_rgba(7,59,71,0.10)] sm:gap-6 sm:p-8"
            style={CARD_BORDER}
          >
            <span className="flex size-16 shrink-0 items-center justify-center rounded-[20px] sm:size-20" style={{ background: C.chip }}>
              <Image src={`${IMG}${h.icon}.webp`} alt="" width={48} height={48} className="size-10 sm:size-12" />
            </span>
            <span className="min-w-0">
              <span className="block text-base font-bold leading-6" style={{ color: C.ink }}>
                {h.title}
              </span>
              <span className="block text-sm leading-6" style={{ color: C.muted }}>
                {h.body}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </Frame>
  );
}

export function ThisIsTrust() {
  return (
    <section className="bg-white px-4 sm:px-8 lg:px-16 xl:px-28">
      <div
        className="mx-auto grid max-w-[1230px] items-center gap-8 rounded-[32px] p-5 sm:p-10 md:grid-cols-2 md:py-16"
        style={{ background: `linear-gradient(52deg, ${C.brandDeep} 0%, ${C.brand} 55%, ${C.brandGreen} 100%)` }}
      >
        <div className="relative aspect-[589/300] w-full overflow-hidden rounded-[20px]">
          <Image
            src={`${IMG}this-is-trust.webp`}
            alt="A group of smiling young friends posing together outdoors"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-5 text-white">
          <h2 className="text-2xl font-extrabold leading-tight sm:text-4xl sm:leading-[57.6px]">This Is Trust</h2>
          <p className="text-base leading-7">
            It’s not a claim. It’s not a promise. It’s a practice. Every day, we choose clarity over convenience. We choose
            fairness over speed. We choose our community’s wellbeing over profit.
          </p>
          <p className="text-base leading-7">That’s what builds real trust. That’s what keeps people coming back.</p>
        </div>
      </div>
    </section>
  );
}

export function ImpactStats() {
  return (
    <section className={`${PAD} bg-white`}>
      <div
        className="mx-auto grid max-w-[1230px] grid-cols-2 gap-y-8 rounded-3xl p-6 sm:p-12 lg:grid-cols-4"
        style={{ background: `linear-gradient(80deg, ${C.brand}, ${C.brandDeep})` }}
      >
        {IMPACT.map((s, i) => (
          <div
            key={s.label}
            className={`flex flex-col items-center gap-2.5 px-2 text-center text-white ${
              // Dividers after items 0 and 2 on two columns; item 1 gains one on four.
              i % 2 === 0 ? "border-r border-white/20" : ""
            } ${i === 1 ? "lg:border-r lg:border-white/20" : ""}`}
          >
            <p className="text-3xl font-extrabold sm:text-4xl sm:leading-[64px]">{s.value}</p>
            <p className="text-xs font-semibold leading-5 opacity-95">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function ReportFlow() {
  return (
    <Frame tinted>
      <Title>When You Report a Concern</Title>
      <ol className="relative grid gap-8 sm:grid-cols-5 sm:gap-5 sm:pt-8">
        {/* Connector behind the step rings; only drawn where the steps sit in one row. */}
        <span aria-hidden className="absolute left-[10%] right-[10%] top-[60px] hidden h-0.5 sm:block" style={{ background: C.line }} />
        {REPORT_STEPS.map((s, i) => (
          <li key={s.title} className="relative flex items-start gap-4 sm:flex-col sm:items-center sm:gap-3 sm:text-center">
            <span
              className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white text-2xl font-bold"
              style={{ color: C.warm, border: `3px solid ${C.warm}` }}
            >
              {i + 1}
            </span>
            <span className="pt-1 sm:pt-3">
              <span className="block text-sm font-semibold leading-5 sm:text-xs" style={{ color: C.ink }}>
                {s.title}
              </span>
              <span className="block pt-1 text-sm leading-5 sm:mx-auto sm:max-w-[210px] sm:text-xs sm:leading-4" style={{ color: C.muted }}>
                {s.body}
              </span>
            </span>
          </li>
        ))}
      </ol>
    </Frame>
  );
}

export function Commitments() {
  return (
    <Frame>
      <Title left>Our Commitments to You</Title>
      <div className="grid items-start gap-8 md:grid-cols-2 lg:gap-12">
        <div className="flex flex-col gap-4 sm:gap-6">
          {COMMITMENTS.map((c) => (
            <div key={c.title} className="flex items-start gap-4 rounded-[20px] bg-white p-5 sm:p-6" style={CARD_BORDER}>
              <span className="pt-1 text-2xl leading-10" aria-hidden>
                ✅
              </span>
              <div className="flex min-w-0 flex-col gap-2">
                <h3 className="text-base font-bold leading-6" style={{ color: C.ink }}>
                  {c.title}
                </h3>
                <p className="text-xs leading-5" style={{ color: C.muted }}>
                  {c.body}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-6">
          <div className="relative aspect-[592/271] w-full overflow-hidden rounded-[20px]">
            <Image
              src={`${IMG}commitments.webp`}
              alt="A large, diverse group of smiling people outdoors"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <h3 className="pt-4 text-2xl font-extrabold leading-tight sm:text-4xl" style={{ color: C.ink }}>
            Safety Built on Trust
          </h3>
          <p className="text-base leading-7" style={{ color: C.muted }}>
            We don’t believe safety comes from surveillance, aggressive algorithms, or hidden decisions. It comes from
            clear rules, human judgment, transparency, and the shared responsibility of a community that cares.
          </p>
          <p className="text-base leading-7" style={{ color: C.muted }}>
            That’s why we’re different. That’s why we invite you to be part of something better.
          </p>
        </div>
      </div>
    </Frame>
  );
}

export function CTA() {
  return (
    <section className="bg-white px-4 pb-12 sm:px-8 sm:pb-16 lg:px-16 xl:px-28">
      <div className="relative mx-auto max-w-[1230px] overflow-hidden rounded-3xl">
        <Image src={`${IMG}cta.webp`} alt="" fill sizes="(min-width: 1280px) 1230px, 100vw" className="object-cover" />
        {/* The photo ships with its overlay; this wash keeps the copy readable where phones crop into its lighter right side. */}
        <div className="absolute inset-0 bg-[rgba(8,51,68,0.4)] md:bg-transparent" />
        <div className="relative flex flex-col items-center gap-4 px-6 py-12 text-center sm:px-12 md:min-h-[399px] md:justify-center">
          <h2 className="text-2xl font-extrabold leading-tight text-white sm:text-4xl">Join a Community Built on Trust</h2>
          <p className="max-w-[560px] text-base leading-7 text-white/90">
            Zoiko Social is where people feel safe, respected, and heard. Where your voice matters and the rules are fair.
            Where transparency is the default, not the exception.
          </p>
          <div className="flex w-full flex-col gap-4 pt-4 min-[440px]:w-auto min-[440px]:flex-row">
            <a
              href={APP_LINKS.signUp}
              className="rounded-xl bg-white px-14 py-4 text-sm font-semibold transition hover:bg-neutral-50"
              style={{ color: C.brand }}
            >
              Create Account
            </a>
            <Link
              href="/discover-communities"
              className="rounded-xl border border-white px-9 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Explore the Community
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
