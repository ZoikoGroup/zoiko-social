import Image from "next/image";
import type { ComponentType } from "react";
import { Activity, ChevronRight, Code2, KeyRound, Layers, TerminalSquare } from "lucide-react";
import { SUPPORT_HREF } from "@/lib/support-links";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

type IconType = ComponentType<{ className?: string; strokeWidth?: number }>;

type ResourceCard = {
  id: string;
  title: string;
  description: string;
  linkLabel: string;
  icon: IconType;
};

/* -------------------------------------------------------------------------- */
/*                                    Data                                    */
/* -------------------------------------------------------------------------- */

const RESOURCE_CARDS = [
  {
    id: "api-documentation",
    title: "API Documentation",
    description: "The official technical reference.",
    linkLabel: "Open docs",
    icon: Code2,
  },
  {
    id: "system-status",
    title: "System Status",
    description: "Check for a known incident.",
    linkLabel: "Check status",
    icon: Activity,
  },
] as const satisfies readonly ResourceCard[];

/* -------------------------------------------------------------------------- */
/*                                Sub-components                              */
/* -------------------------------------------------------------------------- */

function ResourceTile({ card }: { card: ResourceCard }) {
  const Icon = card.icon;
  return (
    <article className="flex min-h-[185px] flex-col rounded-3xl border border-[#DDE3E7] bg-white p-6 shadow-[0_1px_2px_rgba(16,38,45,0.04)]">
      <span className="flex h-[41px] w-[41px] items-center justify-center rounded-xl bg-[#E6F4F4] text-[#0B5E6B]">
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <h3 className="mt-[14px] text-lg font-semibold leading-6 text-[#0B3A44]">{card.title}</h3>
      <p className="mt-1 text-sm leading-5 text-[#6B7680]">{card.description}</p>
      <a
        href={SUPPORT_HREF[card.linkLabel] ?? "#"}
        className="group mt-auto flex items-center justify-between pt-3 text-sm font-semibold text-[#0B5E6B] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0B6474]"
      >
        <span className="group-hover:underline">{card.linkLabel}</span>
        <ChevronRight className="h-4 w-4 text-[#0B3A44]" strokeWidth={2} />
      </a>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    Page                                    */
/* -------------------------------------------------------------------------- */

export default function DeveloperSupport() {
  return (
    <main className="min-h-screen bg-[#F7F9FA] px-4 py-10 font-['Plus_Jakarta_Sans',ui-sans-serif,system-ui,-apple-system,'Segoe_UI',sans-serif] antialiased sm:py-[37px]">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-5 lg:grid-cols-[351fr_391fr] lg:gap-x-[18px]">
        {/* Left: hero card */}
        <section className="relative flex min-h-[439px] flex-col justify-center overflow-hidden rounded-[28px] bg-[#0A4A52] px-8 py-12 sm:px-[54px]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-[93px] -right-[53px] h-[240px] w-[240px] rounded-full bg-[#0F565E]"
          >
            <div className="absolute inset-[30px] rounded-full bg-[#0C4E56]" />
          </div>

          <div className="relative z-10">
            <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-white/80">
              Support &amp; Developers
            </p>
            <h1 className="mt-[14px] text-[40px] font-bold leading-[1.1] tracking-[-0.02em] text-white sm:text-[44px]">
              Developer Support
            </h1>
            <p className="mt-3 max-w-[430px] text-[17px] leading-[26px] text-white/85">
              Official help when your Zoiko Social integration isn&rsquo;t working as expected.
            </p>

            <div className="mt-[31px] flex flex-wrap items-center gap-[11px]">
              <a
                href="#request-developer-help"
                className="inline-flex h-[41px] items-center gap-2 rounded-[10px] bg-white px-4 text-sm font-semibold text-[#0A3B45] transition-colors hover:bg-[#EEF5F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                <TerminalSquare className="h-4 w-4" strokeWidth={1.75} />
                Get developer help
              </a>
              <a
                href="#how-a-request-works"
                className="inline-flex h-[41px] items-center rounded-[10px] border border-white/40 px-4 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
              >
                How it works
              </a>
            </div>

            <p className="mt-5 text-[13px] leading-5 text-white/80">
              Not a developer question?{" "}
              <a href="/support-developers-contact-us" className="font-medium text-white underline underline-offset-2">
                Contact Us
              </a>
            </p>
          </div>
        </section>

        {/* Right column */}
        <div className="flex flex-col gap-5">
          <div className="relative h-[300px] overflow-hidden rounded-[28px] bg-[#3B2A1E]">
            <Image
              src="/developer/img1.png"
              alt="Two support agents wearing headsets at their desks"
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />

            <div className="absolute right-[18px] top-[18px] flex h-[49px] items-center gap-2.5 rounded-2xl bg-white pl-[10px] pr-4 shadow-[0_6px_20px_rgba(0,0,0,0.15)]">
              <span className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-[#E6F4F4] text-[#0B5E6B]">
                <Layers className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <span className="text-sm font-semibold text-[#0A3B45]">5 short steps</span>
            </div>

            <div className="absolute bottom-[18px] left-5 flex h-[49px] items-center gap-2.5 rounded-2xl bg-white pl-[10px] pr-4 shadow-[0_6px_20px_rgba(0,0,0,0.15)]">
              <span className="flex h-[30px] w-[30px] items-center justify-center rounded-lg bg-[#FDF0E1] text-[#D9761C]">
                <KeyRound className="h-4 w-4" strokeWidth={1.75} />
              </span>
              <span className="text-sm font-semibold text-[#0A3B45]">
                Never include API keys or tokens
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {RESOURCE_CARDS.map((card) => (
              <ResourceTile key={card.id} card={card} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
