import Image from "next/image";
import Link from "next/link";
import { C } from "./theme";

/** The report form lives on /report-a-concern; standards live on /source-standards. */
const REPORT_URL = "/report-a-concern";
const STANDARDS_URL = "/source-standards";

export default function Hero() {
  return (
    <section className="bg-white">
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:flex-row lg:items-center lg:gap-12 lg:py-24">
        {/* Copy Column */}
        <div className="flex w-full flex-col items-start gap-4 lg:max-w-[560px]">
          <p
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: C.orange }}
          >
            SAFETY / REPORT A CONCERN
          </p>

          {/* Guaranteed 2-line heading matching Figma */}
          <h1
            className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[42px] lg:leading-[1.15]"
            style={{ color: C.ink }}
          >
            <span className="block whitespace-nowrap">Flag content or behavior</span>
            <span className="block">that worries you</span>
          </h1>

          {/* Guaranteed 2-line paragraph matching Figma */}
          <p
            className="text-base leading-7"
            style={{ color: C.muted }}
          >
            Reporting is free and available without an account. Help us keep Zoiko
            <br />
            Social safe for everyone.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-3">
            <Link
              href={REPORT_URL}
              className="rounded-xl px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
              style={{ background: C.brand }}
            >
              Start Report
            </Link>

            <Link
              href={STANDARDS_URL}
              className="rounded-xl border px-6 py-3.5 text-sm font-bold transition hover:bg-slate-50"
              style={{ borderColor: C.line, color: C.ink }}
            >
              See community standards
            </Link>
          </div>
        </div>

        {/* Photo Card */}
        <div className="w-full flex-1">
          <div className="relative h-[360px] w-full overflow-hidden rounded-[24px] shadow-[0px_20px_48px_0px_rgba(7,59,71,0.14)] sm:h-[460px] lg:h-[490px]">
            <Image
              src="/safety-report-concern/op.png"
              alt="A user reporting content or behavior on the Zoiko Social mobile app"
              fill
              priority
              sizes="(min-width: 1024px) 612px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}