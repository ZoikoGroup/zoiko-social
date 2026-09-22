import { APP_LINKS } from "@/lib/app-links";
import { C } from "./theme";

const SIGNALS: readonly { signal: string; means: string; notMean: string }[] = [
  {
    signal: "Verified Organization",
    means: "The organization identity completed an approved Zoiko verification process.",
    notMean: "Automatic legal charity status, tax deductibility, fundraiser approval, or guaranteed use of funds.",
  },
  {
    signal: "Verified Organizer",
    means: "The organizer’s identity and role are verified under an approved process.",
    notMean: "Proof that the beneficiary is verified or that funds are safe.",
  },
  {
    signal: "Verified Beneficiary",
    means: "The beneficiary’s identity and relationship to the fundraiser have been validated to the approved level.",
    notMean: "An absolute guarantee of outcomes or tax treatment.",
  },
  {
    signal: "Fundraiser Approved / Live",
    means: "The campaign passed current product, safety, and financial eligibility checks.",
    notMean: "Endorsement of every claim or future update.",
  },
  {
    signal: "Transparent Tracking",
    means: "Zoiko Social can display authorized transaction/progress state with defined semantics.",
    notMean: "Permission to conflate pledged, paid, settled, disbursed, or refunded funds.",
  },
  {
    signal: "Sponsored",
    means: "Paid promotion of an otherwise eligible fundraiser.",
    notMean: "Trust, verification, ranking quality, or platform endorsement.",
  },
];

function Heading({ title, sub }: { title: string; sub: string }) {
  return (
    <div>
      <h2 className="text-xl font-extrabold leading-8" style={{ color: C.inkDeep }}>
        {title}
      </h2>
      <p className="max-w-[540px] text-xs leading-5" style={{ color: C.muted }}>
        {sub}
      </p>
    </div>
  );
}

export function TrustTable() {
  const cell = { border: `1px solid ${C.line}` };
  const th = "px-3.5 py-3 text-left text-xs font-bold uppercase tracking-tight";
  return (
    <section className="pt-10">
      <Heading title="Why trust this fundraiser?" sub='Six distinct signals — never collapsed into one "trusted" badge.' />

      {/* Phones: one card per signal instead of a three-column table. */}
      <ul className="mt-6 flex flex-col gap-3 md:hidden">
        {SIGNALS.map((s) => (
          <li key={s.signal} className="rounded-2xl p-4" style={{ border: `1px solid ${C.line}` }}>
            <p className="text-sm font-bold" style={{ color: C.inkDeep }}>
              {s.signal}
            </p>
            <p className="pt-3 text-[11px] font-bold uppercase tracking-tight" style={{ color: C.muted }}>
              Meaning
            </p>
            <p className="text-xs leading-5" style={{ color: C.ink }}>
              {s.means}
            </p>
            <p className="pt-2 text-[11px] font-bold uppercase tracking-tight" style={{ color: C.muted }}>
              Must not mean
            </p>
            <p className="text-xs leading-5" style={{ color: C.ink }}>
              {s.notMean}
            </p>
          </li>
        ))}
      </ul>

      <table className="mt-6 hidden w-full border-collapse md:table" style={cell}>
        <thead style={{ background: C.panel, color: C.muted }}>
          <tr>
            <th scope="col" className={`${th} w-44`} style={cell}>
              Signal
            </th>
            <th scope="col" className={th} style={cell}>
              Meaning
            </th>
            <th scope="col" className={th} style={cell}>
              Must not mean
            </th>
          </tr>
        </thead>
        <tbody>
          {SIGNALS.map((s) => (
            <tr key={s.signal}>
              <th scope="row" className="px-3.5 py-3 text-left align-top text-sm font-bold" style={{ ...cell, color: C.inkDeep }}>
                {s.signal}
              </th>
              <td className="px-3.5 py-3 align-top text-sm leading-6" style={{ ...cell, color: C.ink }}>
                {s.means}
              </td>
              <td className="px-3.5 py-3 align-top text-sm leading-6" style={{ ...cell, color: C.ink }}>
                {s.notMean}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

const ROUTES = [
  {
    title: "Report a fundraiser concern",
    body: "Misleading claims, impersonation, or a beneficiary that doesn’t look right.",
  },
  {
    title: "Payment or contribution issue",
    body: "Routes to your own transaction support — never reveals other donors’ data.",
  },
  {
    title: "Animal-welfare concern",
    body: "Routes separately from financial reports to the appropriate review team.",
  },
] as const;

export function SafetySupport() {
  return (
    <section className="pt-14">
      <Heading
        title="Safety, reporting & support"
        sub="These routes stay separate on purpose — a payment issue is not the same as an animal-welfare concern."
      />
      <div className="mt-6 grid gap-6 rounded-3xl p-5 sm:p-8 lg:grid-cols-2" style={{ background: C.panel }}>
        <div className="flex flex-col gap-3 text-sm leading-6" style={{ color: C.ink }}>
          <p>
            Fundraiser pages are not public allegation boards. Report volume
            never becomes a truth signal — every concern goes through private
            review.
          </p>
          <p>
            No fundraiser may operationalize illegal animal sale, breeding
            exploitation, trafficking, or unverifiable emergency claims.
            Protected rescue and wildlife locations are never exposed in
            fundraiser copy, media, or updates.
          </p>
          <p
            className="mt-1 rounded-xl bg-white p-3 text-xs leading-5"
            style={{ color: C.muted, border: `1px solid ${C.line}` }}
          >
            Tax deductibility depends on the specific beneficiary entity and
            your jurisdiction. Zoiko Social does not claim tax deductibility
            unless a fundraiser&apos;s own disclosure explicitly and
            authoritatively supports it.
          </p>
        </div>
        <ul className="flex flex-col gap-2.5">
          {ROUTES.map((r) => (
            <li key={r.title}>
              <a
                href={APP_LINKS.safety}
                className="block rounded-xl bg-white p-4 text-xs leading-5 transition hover:shadow-[0px_8px_24px_0px_rgba(7,59,71,0.08)]"
                style={{ color: C.muted, border: `1px solid ${C.line}` }}
              >
                <span className="text-sm font-bold" style={{ color: C.inkDeep }}>
                  {r.title}
                </span>{" "}
                {r.body}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function FollowCauses() {
  return (
    <section
      className="mt-16 flex flex-col gap-5 rounded-3xl bg-white p-6 sm:p-8 md:flex-row md:items-center md:justify-between"
      style={{ border: `1px solid ${C.line}` }}
    >
      <div>
        <h2 className="text-lg font-extrabold leading-7" style={{ color: C.inkDeep }}>
          Follow causes you trust.
        </h2>
        <p className="mt-1 max-w-[420px] text-sm leading-6" style={{ color: C.muted }}>
          Follow a beneficiary or fundraiser for material updates and outcomes
          — never a donation streak or leaderboard.
        </p>
      </div>
      <a
        href="#fundraisers"
        className="shrink-0 rounded-xl px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:opacity-90"
        style={{ background: C.brand }}
      >
        See related fundraisers
      </a>
    </section>
  );
}
