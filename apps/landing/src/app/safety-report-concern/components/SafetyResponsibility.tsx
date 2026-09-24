import Image from "next/image";
import Link from "next/link";
import { C } from "./theme";

/** The checklist on the commitment card. */
const COMMITMENTS: readonly string[] = [
  "Fair and thorough review process",
  "Transparent about actions taken",
  "Privacy-respecting processes",
];

export default function SafetyResponsibility() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6">
        <div className="flex flex-col gap-12">
          <h2
            className="text-3xl font-extrabold leading-10"
            style={{ color: C.ink }}
          >
            Safety is everyone&apos;s responsibility
          </h2>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch">
            {/* Image */}
            <div className="relative min-h-[360px] w-full overflow-hidden rounded-[20px] lg:w-[598px] lg:flex-shrink-0">
              <Image
                src="/safety-report-concern/nn.png"
                alt="A team working together around a laptop"
                fill
                sizes="(min-width: 1024px) 598px, 100vw"
                className="rounded-[20px] object-cover"
                priority
              />
            </div>

            {/* Cards Container */}
            <div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Our commitment */}
              <div
                className="flex flex-col justify-between gap-6 rounded-[20px] p-8 text-left shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]"
                style={{ background: C.white, border: `1px solid ${C.line}` }}
              >
                <div className="flex flex-col gap-4">
                  <h3
                    className="text-base font-bold"
                    style={{ color: C.brand }}
                  >
                    Our commitment
                  </h3>
                  <p
                    className="text-base leading-6"
                    style={{ color: C.muted }}
                  >
                    We&apos;re committed to reviewing every report fairly and
                    taking appropriate action. Your concerns help us build a
                    safer platform for everyone in the Zoiko community.
                  </p>
                </div>

                <ul className="flex flex-col gap-3 pt-2">
                  {COMMITMENTS.map((item) => (
                    <li key={item} className="flex items-center gap-2.5">
                      <span
                        className="text-sm font-bold leading-none"
                        style={{ color: C.orange }}
                      >
                        ✓
                      </span>
                      <span
                        className="text-sm font-medium"
                        style={{ color: C.ink }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Community standards */}
              <div
                className="flex flex-col justify-between gap-6 rounded-[20px] p-8 text-left shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]"
                style={{ background: C.white, border: `1px solid ${C.line}` }}
              >
                <div className="flex flex-col gap-4">
                  <h3
                    className="text-base font-bold"
                    style={{ color: C.brand }}
                  >
                    Community standards
                  </h3>
                  <p
                    className="text-base leading-6"
                    style={{ color: C.muted }}
                  >
                    All members agree to follow our community guidelines.
                    Violations result in appropriate action, from warnings to
                    account suspension.
                  </p>
                </div>

                <Link
                  href="/source-standards"
                  className="block w-full rounded-xl py-3.5 text-center text-sm font-bold text-white transition hover:opacity-90"
                  style={{ background: C.brand }}
                >
                  View Full Guidelines
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}