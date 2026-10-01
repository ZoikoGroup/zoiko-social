import Image from "next/image";
import { C } from "./theme";

const STEPS = ["Reason", "Suggestions", "How to reach us", "Details", "Review and send"];

const REASONS = [
  { icon: "icon-user", title: "Account and sign-in", body: "Can't sign in, or account settings.", fill: C.chip, iconColor: C.brand },
  { icon: "icon-tool", title: "Something isn't working", body: "A feature isn't behaving as expected.", fill: C.chip, iconColor: C.brand },
  { icon: "icon-shield", title: "Privacy and your data", body: "Questions about your information.", fill: C.chip, iconColor: C.brand },
  { icon: "icon-flag", title: "Safety concern", body: "Harmful content or behavior.", fill: C.orangeFill, iconColor: C.orange },
  { icon: "icon-access", title: "Accessibility", body: "Something is hard to use.", fill: C.chip, iconColor: C.brand },
  { icon: "icon-q", title: "Something else", body: "None of these fit.", fill: C.chip, iconColor: C.brand },
];

/** Section - 05 · CONTACT REQUEST — "Start a contact request", a 5-step wizard's first step. */
export default function ContactRequest() {
  return (
    <section id="contact-request" className="w-full bg-white px-5 py-10 lg:px-[105px] lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 lg:gap-10">
        <div className="flex flex-col gap-2.5">
          <h2 className="text-[26px] font-extrabold tracking-[-0.26px] lg:text-4xl lg:tracking-[-0.36px]" style={{ color: C.brandDeep }}>
            Start a contact request
          </h2>
          <p className="text-base leading-[25.6px] lg:text-[17px] lg:leading-[27.2px]" style={{ color: C.muted }}>
            Five short steps. Your answers are kept if you go back.
          </p>
        </div>

        <div className="flex w-full flex-col gap-6 lg:flex-row lg:items-start lg:gap-8">
          <ol className="hidden w-[260px] shrink-0 flex-col gap-0 rounded-[20px] border bg-white p-2.5 lg:flex" style={{ borderColor: C.line }}>
            {STEPS.map((step, i) => (
              <li
                key={step}
                className="flex h-[50px] items-center gap-3 rounded-xl px-3"
                style={i === 0 ? { backgroundColor: C.chip } : undefined}
              >
                <span
                  className="flex size-[30px] shrink-0 items-center justify-center rounded-full border text-[13px] font-extrabold"
                  style={
                    i === 0
                      ? { backgroundColor: C.brand, borderColor: C.brand, color: "#fff" }
                      : { backgroundColor: "#fff", borderColor: C.line, color: C.muted }
                  }
                >
                  {i + 1}
                </span>
                <span className="text-[14.5px] font-semibold" style={{ color: i === 0 ? C.brandDeep : C.muted }}>
                  {step}
                </span>
              </li>
            ))}
          </ol>

          <div className="flex w-full flex-1 flex-col rounded-[28px] border bg-white p-6 shadow-[0px_1px_1px_rgba(7,59,71,0.06)] lg:p-9" style={{ borderColor: C.line }}>
            <div className="flex flex-col gap-6 lg:gap-8">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-xl font-bold tracking-[-0.24px] lg:text-2xl" style={{ color: C.brandDeep }}>
                  What do you need help with?
                </h3>
                <p className="text-base leading-[25.6px]" style={{ color: C.muted }}>
                  Pick the closest match.
                </p>
              </div>

              <div className="grid w-full grid-cols-1 gap-3 pt-2 sm:grid-cols-2 lg:grid-cols-3">
                {REASONS.map((reason) => (
                  <label
                    key={reason.title}
                    className="flex flex-col gap-4 rounded-[20px] border p-[18px]"
                    style={{ borderColor: C.line }}
                  >
                    <span className="flex size-11 items-center justify-center rounded-xl" style={{ backgroundColor: reason.fill }}>
                      <span
                        className="h-[22px] w-[22px]"
                        style={{
                          backgroundColor: reason.iconColor,
                          WebkitMaskImage: `url(/support&developers-contact-us/${reason.icon}.webp)`,
                          WebkitMaskSize: "contain",
                          WebkitMaskRepeat: "no-repeat",
                          WebkitMaskPosition: "center",
                          maskImage: `url(/support&developers-contact-us/${reason.icon}.webp)`,
                          maskSize: "contain",
                          maskRepeat: "no-repeat",
                          maskPosition: "center",
                        }}
                      />
                    </span>
                    <div className="flex flex-col gap-1">
                      <p className="text-[15.5px] font-bold leading-[24.8px]" style={{ color: C.brandDeep }}>
                        {reason.title}
                      </p>
                      <p className="text-[13.5px] leading-[19.58px]" style={{ color: C.muted }}>
                        {reason.body}
                      </p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="flex w-full justify-end border-t pt-6" style={{ borderColor: C.line }}>
                <button
                  type="button"
                  className="flex min-h-11 items-center gap-2 rounded-xl px-5 text-[15px] font-semibold text-white"
                  style={{ backgroundColor: C.brand }}
                >
                  Continue
                  <Image src="/support&developers-contact-us/icon-chevron-right.webp" alt="" width={16} height={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
