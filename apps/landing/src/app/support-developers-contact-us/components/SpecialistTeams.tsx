import Image from "next/image";
import { C } from "./theme";
import Link from "next/link";
import { SUPPORT_HREF } from "@/lib/support-links";

const TEAMS = [
  { icon: "icon-access", for: "Accessibility", body: "Help using Zoiko Social, or a barrier to report.", link: "Accessibility Support" },
  { icon: "icon-tool", for: "Integrations", body: "Private or account-specific developer issues.", link: "Developer Support" },
  { icon: "icon-code", for: "API reference", body: "How the API behaves.", link: "API Documentation" },
  { icon: "icon-users", for: "Tips from members", body: "Peer advice, not official support.", link: "Community Forums" },
];

/** Section - 04 · SPECIALIST TEAMS — "Specialist teams", a 4-card grid. */
export default function SpecialistTeams() {
  return (
    <section id="specialist-teams" className="scroll-mt-24 w-full px-5 py-10 lg:px-[105px] lg:py-20" style={{ backgroundColor: C.panel }}>
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 lg:gap-10">
        <div className="flex flex-col gap-2.5">
          <h2 className="text-[26px] font-extrabold tracking-[-0.26px] lg:text-4xl lg:tracking-[-0.36px]" style={{ color: C.brandDeep }}>
            Specialist teams
          </h2>
          <p className="text-base leading-[25.6px] lg:text-[17px] lg:leading-[27.2px]" style={{ color: C.muted }}>
            Some questions go faster to the team that owns them.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TEAMS.map((team) => (
            <div
              key={team.for}
              className="flex flex-col items-start gap-3 rounded-[20px] border bg-white p-[22px]"
              style={{ borderColor: C.line }}
            >
              <span className="flex size-11 items-center justify-center rounded-xl" style={{ backgroundColor: C.chip }}>
                <Image src={`/support&developers-contact-us/${team.icon}.webp`} alt="" width={22} height={22} />
              </span>
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium" style={{ color: C.muted }}>
                  For
                </span>
                <span className="text-base font-bold" style={{ color: C.ink }}>
                  {team.for}
                </span>
              </div>
              <p className="text-sm leading-[22.4px]" style={{ color: C.muted }}>
                {team.body}
              </p>
              <div className="flex w-full items-center justify-between border-t pt-3.5" style={{ borderColor: C.line }}>
                <Link href={SUPPORT_HREF[team.link] ?? "#"} className="text-base font-bold" style={{ color: C.brand }}>
                  {team.link}
                </Link>
                <Image src="/support&developers-contact-us/icon-chevron-right.webp" alt="" width={16} height={16} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
