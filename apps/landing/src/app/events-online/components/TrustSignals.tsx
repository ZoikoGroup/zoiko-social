import { BadgeCheck, ShieldCheck } from "lucide-react";
import { C } from "./theme";

const SIGNALS: readonly { signal: string; means: string; notImply: string }[] = [
  {
    signal: "Verified Organization",
    means: "The entity has passed Zoiko Social's approved organization verification process.",
    notImply: "That every event claim is endorsed by Zoiko Social.",
  },
  {
    signal: "Verified Professional",
    means: "Professional identity and credential scope have been verified under platform policy.",
    notImply: "That advice given in the event is individualized medical/veterinary diagnosis.",
  },
  {
    signal: "Verified Community",
    means: "A community identity and governance signal.",
    notImply: "Professional credentials, fundraising authorization, or legal status.",
  },
  {
    signal: "Moderator present",
    means: "A platform, community, or host moderation role is assigned to this session.",
    notImply: "That harmful behavior cannot occur.",
  },
  {
    signal: "Verified fundraiser",
    means: "The fundraiser, beneficiary, and collection flow meet approved verification requirements.",
    notImply: "A guaranteed outcome or zero financial risk.",
  },
];

function SignalIcon({ signal }: { signal: string }) {
  return signal === "Moderator present" ? (
    <ShieldCheck size={12} strokeWidth={2.5} className="mt-0.5 shrink-0" style={{ color: C.warm }} />
  ) : (
    <BadgeCheck size={12} strokeWidth={2.5} className="mt-0.5 shrink-0" style={{ color: C.brand }} />
  );
}

export default function TrustSignals() {
  const th = "px-3.5 py-3 text-left text-xs font-bold uppercase tracking-tight";

  return (
    <section className="pt-12 sm:pt-16">
      <h2 className="text-xl font-extrabold leading-8" style={{ color: C.ink }}>
        What each trust signal means
      </h2>
      <p className="text-xs leading-5" style={{ color: C.muted }}>
        Five distinct signals — never collapsed into one badge.
      </p>

      {/* Phones: one card per signal instead of a three-column table. */}
      <ul className="mt-6 flex flex-col gap-3 md:hidden">
        {SIGNALS.map((s) => (
          <li
            key={s.signal}
            className="rounded-2xl p-4"
            style={{ border: `1px solid ${C.line}` }}
          >
            <p className="flex items-start gap-1.5 text-sm font-bold" style={{ color: C.ink }}>
              <SignalIcon signal={s.signal} />
              {s.signal}
            </p>
            <p className="mt-3 text-[11px] font-bold uppercase tracking-tight" style={{ color: C.muted }}>
              Meaning
            </p>
            <p className="text-xs leading-5" style={{ color: C.inkDeep }}>
              {s.means}
            </p>
            <p className="mt-2 text-[11px] font-bold uppercase tracking-tight" style={{ color: C.muted }}>
              Must not imply
            </p>
            <p className="text-xs leading-5" style={{ color: C.inkDeep }}>
              {s.notImply}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-6 hidden md:block">
        <table
          className="w-full border-collapse text-sm"
          style={{ border: `1px solid ${C.line}` }}
        >
          <thead style={{ background: C.panel, color: C.muted }}>
            <tr>
              <th scope="col" className={`${th} w-44`} style={{ border: `1px solid ${C.line}` }}>
                Signal
              </th>
              <th scope="col" className={th} style={{ border: `1px solid ${C.line}` }}>
                Meaning
              </th>
              <th scope="col" className={th} style={{ border: `1px solid ${C.line}` }}>
                Must not imply
              </th>
            </tr>
          </thead>
          <tbody>
            {SIGNALS.map((s) => (
              <tr key={s.signal}>
                <th
                  scope="row"
                  className="px-3.5 py-3 text-left align-top text-xs font-bold"
                  style={{ border: `1px solid ${C.line}`, color: C.ink }}
                >
                  <span className="inline-flex items-start gap-1.5">
                    <SignalIcon signal={s.signal} />
                    {s.signal}
                  </span>
                </th>
                <td
                  className="px-3.5 py-3 align-top text-xs leading-5"
                  style={{ border: `1px solid ${C.line}`, color: C.inkDeep }}
                >
                  {s.means}
                </td>
                <td
                  className="px-3.5 py-3 align-top text-xs leading-5"
                  style={{ border: `1px solid ${C.line}`, color: C.inkDeep }}
                >
                  {s.notImply}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
