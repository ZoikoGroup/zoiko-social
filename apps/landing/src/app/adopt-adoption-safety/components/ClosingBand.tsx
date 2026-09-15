import Link from "next/link";
import { C } from "./theme";
import { FAQS } from "./guidance";

/** The closing call to action, then the questions. */
export default function ClosingBand() {
  return (
    <>
      <section
        className="mt-16 flex flex-col gap-6 rounded-3xl px-6 py-8 sm:px-10 lg:flex-row lg:items-center lg:justify-between"
        style={{ background: C.ink }}
      >
        <div className="max-w-[560px]">
          <h2 className="text-xl font-extrabold leading-8 text-white sm:text-2xl">
            Ready to browse with confidence?
          </h2>
          <p className="mt-2 text-sm leading-5 text-white/85">
            Find animals listed by verified rescues and shelters, with this
            safety guidance built in every step of the way.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
          <Link
            href="/zoiko_social_adopt"
            className="flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: C.warnLine }}
          >
            Find Animals
          </Link>
          <a
            href="#your-safety-checklist"
            className="flex items-center justify-center rounded-xl border border-white/60 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Back to Checklist
          </a>
        </div>
      </section>

      <section className="pt-16">
        <h2
          className="text-center text-2xl font-extrabold leading-tight sm:text-3xl sm:leading-[48px]"
          style={{ color: C.ink }}
        >
          Common questions
        </h2>

        {/* <details> keeps the accordion working without JavaScript, so this
            stays a server component. The comp's "+" turns into a close sign
            when its own row is open. */}
        <div className="mx-auto mt-8 flex max-w-[760px] flex-col gap-3">
          {FAQS.map(({ q, a }) => (
            <details
              key={q}
              className="group overflow-hidden rounded-2xl bg-white"
              style={{ border: `1px solid ${C.line}` }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 [&::-webkit-details-marker]:hidden">
                <span className="text-sm font-bold leading-5" style={{ color: C.inkDeep }}>
                  {q}
                </span>
                <span
                  className="text-xl leading-none transition-transform group-open:rotate-45"
                  style={{ color: C.brand }}
                  aria-hidden
                >
                  +
                </span>
              </summary>
              <p className="px-5 pb-4 text-sm leading-6" style={{ color: C.muted }}>
                {a}
              </p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
