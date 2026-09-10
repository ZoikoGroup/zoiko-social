import { C } from "./theme";
import { SectionHeading } from "./primitives";

const STATS: [string, string][] = [
  ["12,500+", "Verified Professionals"],
  ["2,800+", "Active Communities"],
  ["<2 min", "Average Response Time"],
];

/** "Zoiko Social by the numbers" — the three-figure card and its footnote. */
export default function StatsSection() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <SectionHeading title="Zoiko Social by the numbers" />

      <dl
        className="mt-10 flex flex-col rounded-3xl bg-white shadow-[0_8px_24px_rgba(7,59,71,0.10)] sm:flex-row"
        style={{ border: `1px solid ${C.line}` }}
      >
        {STATS.map(([value, label], i) => (
          <div
            key={label}
            className={`flex flex-1 flex-col items-center px-4 py-8 ${
              i === STATS.length - 1 ? "" : "sm:border-r"
            }`}
            style={{ borderColor: C.line }}
          >
            <dt className="sr-only">{label}</dt>
            <dd
              className="text-2xl font-extrabold leading-[48px] lg:text-3xl"
              style={{ color: C.ink }}
            >
              {value}
            </dd>
            <p
              className="text-center text-xs font-semibold leading-5"
              style={{ color: C.muted }}
            >
              {label}
            </p>
          </div>
        ))}
      </dl>

      <p
        className="mt-4 text-center text-xs leading-4"
        style={{ color: C.muted }}
      >
        Figures reflect platform activity at time of publishing.
      </p>
    </section>
  );
}
