import type { ReactNode } from "react";
import Link from "next/link";
import { Check, Tag } from "lucide-react";
import { APP_LINKS } from "@/lib/app-links";

export default function PricingSection() {
  return (
    <section className="relative overflow-hidden bg-[#11292F] px-4 py-20 font-inter sm:px-6 lg:px-8">
      {/* Corner ribbon */}
      <div
        className="absolute -left-10 top-10 hidden -rotate-[24deg] bg-gradient-to-br from-[#F2A04A] to-[#E8892A] px-14 py-4 text-center text-[#0F2B33] shadow-xl md:block"
        aria-hidden
      >
        <p className="text-lg font-extrabold">BLACK FRIDAY</p>
        <p className="text-sm font-bold">30% off</p>
      </div>

      <div className="mx-auto flex max-w-[1130px] flex-col items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#E8892A]/60 bg-[#E8892A]/10 px-4 py-2 font-mono text-xs tracking-wider text-orange-100">
          <Tag className="h-3.5 w-3.5 text-[#E8892A]" aria-hidden />
          Black Friday: 30% off the first year*
        </span>
        <h2 className="mt-6 font-jakarta text-3xl font-extrabold text-white sm:text-4xl">
          Join free. Add tools when you&apos;re ready.
        </h2>
        <p className="mt-4 max-w-[640px] text-lg leading-relaxed text-white/70">
          Being part of the community is always free. Creators and businesses can add paid tools —
          now with Black Friday savings on the first year.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-[1130px] gap-5 text-left md:grid-cols-3">
        <PlanCard
          name="Community"
          tagline="For every animal lover — find, follow and join communities."
          price={<span className="text-4xl font-extrabold text-white">Free</span>}
          badge={<Badge tone="green">Free forever</Badge>}
          cta={
            <Link href={APP_LINKS.signUp} className="block rounded-xl bg-gradient-to-b from-[#1FB3C9] to-[#0E8EA5] py-3 text-center font-semibold text-[#0F2B33] shadow-[0_10px_24px_rgba(14,142,165,0.35)]">
              Join free
            </Link>
          }
          features={["Join open communities", "Follow topics & species", "Post, comment & message", "Report & safety tools"]}
        />
        <PlanCard
          popular
          name="Creator"
          tagline="For creators building an audience around animals."
          price={<Price was="$12" now="$8.40" />}
          badge={<Badge tone="orange">Save 30% · first year*</Badge>}
          cta={
            <Link href="/platform-premium-plans-production" className="block rounded-xl bg-gradient-to-b from-[#F2A04A] to-[#E07F1F] py-3 text-center font-semibold text-[#0F2B33] shadow-[0_10px_24px_rgba(232,137,42,0.35)]">
              Get Creator
            </Link>
          }
          features={["Everything in Community", "Creator profile & analytics", "Scheduling & content tools", "Supporter & monetization tools"]}
        />
        <PlanCard
          name="Business"
          tagline="For shelters, brands and organizations."
          price={<Price was="$29" now="$20.30" />}
          badge={<Badge tone="orange">Save 30% · first year*</Badge>}
          cta={
            <Link href="/buisness-contact-sales" className="block rounded-xl border border-white/30 py-3 text-center font-semibold text-white hover:bg-white/5">
              Talk to us
            </Link>
          }
          features={["Everything in Creator", "Verified organization profile", "Team seats & admin controls", "Priority support"]}
        />
      </div>

      <p className="mx-auto mt-8 max-w-[720px] text-center text-xs leading-relaxed text-white/40">
        Prices are illustrative placeholders shown monthly, billed yearly. *Black Friday 30% applies
        to the first year of eligible paid Creator &amp; Business tools, for new upgrades — proposed
        and subject to product and finance approval, and only where those paid tiers are live.
        Joining the community is always free.
      </p>
    </section>
  );
}

function PlanCard({
  name,
  tagline,
  price,
  badge,
  cta,
  features,
  popular = false,
}: {
  name: string;
  tagline: string;
  price: ReactNode;
  badge: ReactNode;
  cta: ReactNode;
  features: string[];
  popular?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 ${
        popular ? "border-[#E8892A]/70 bg-[#13242A]" : "border-white/10 bg-[#13252B]"
      }`}
    >
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#E8892A] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#0F2B33]">
          Most popular
        </span>
      )}
      <h3 className="text-xl font-bold text-white">{name}</h3>
      <p className="mt-2 min-h-[40px] text-sm leading-relaxed text-white/60">{tagline}</p>
      <div className="mt-6">{price}</div>
      <div className="mt-3">{badge}</div>
      <div className="mt-5">{cta}</div>
      <ul className="mt-6 flex flex-col gap-3">
        {features.map((f) => (
          <li key={f} className="flex items-center gap-3 text-sm text-white/85">
            <Check className="h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
            {f}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Price({ was, now }: { was: string; now: string }) {
  return (
    <p className="flex items-baseline gap-2">
      <s className="text-white/40">{was}</s>
      <span className="text-4xl font-extrabold text-white">{now}</span>
      <span className="text-sm text-white/50">/month</span>
    </p>
  );
}

function Badge({ tone, children }: { tone: "green" | "orange"; children: ReactNode }) {
  const styles =
    tone === "green"
      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
      : "border-[#E8892A]/50 bg-[#E8892A]/10 text-[#F2A04A]";
  return <span className={`inline-block rounded-full border px-3 py-1 text-xs font-semibold ${styles}`}>{children}</span>;
}
