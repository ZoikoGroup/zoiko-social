import { C } from "./theme";

const STEPS = [
  { icon: "icon-send", title: "Submitted", body: "Your request was sent", active: true },
  { icon: "icon-inbox", title: "Received", body: "The system confirmed it", active: false },
  { icon: "icon-users", title: "With a team", body: "Routed to the right team", active: false },
  { icon: "icon-chat", title: "Waiting on you", body: "If more detail is needed", active: false },
  { icon: "icon-check", title: "Closed", body: "When the request is finished", active: false },
];

/** Section - 09 · AFTER YOU SEND — "After you send", a 5-step status tracker. */
export default function AfterYouSend() {
  return (
    <section className="w-full bg-white px-5 py-10 lg:px-[105px] lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 lg:gap-6">
        <div className="flex flex-col gap-2.5">
          <h2 className="text-[26px] font-extrabold tracking-[-0.26px] lg:text-4xl lg:tracking-[-0.36px]" style={{ color: C.brandDeep }}>
            After you send
          </h2>
          <p className="text-base leading-[25.6px] lg:text-[17px] lg:leading-[27.2px]" style={{ color: C.muted }}>
            Your request only shows each stage once it actually reaches it.
          </p>
        </div>

        <ol className="grid w-full grid-cols-2 gap-y-6 pt-4 sm:grid-cols-3 lg:flex lg:flex-nowrap lg:gap-0">
          {STEPS.map((step, i) => (
            <li key={step.title} className="relative flex flex-1 flex-col items-center gap-2.5 px-2 text-center">
              {i < STEPS.length - 1 && (
                <div
                  className="absolute left-1/2 top-7 z-0 hidden w-full border-t-2 border-dashed lg:block"
                  style={{ borderColor: C.line }}
                />
              )}
              <span
                className="relative z-10 flex size-14 items-center justify-center rounded-[18px]"
                style={{ backgroundColor: step.active ? C.brand : C.chip }}
              >
                <span
                  className="h-[26px] w-[26px]"
                  style={{
                    backgroundColor: step.active ? "#fff" : C.brandDeep,
                    WebkitMaskImage: `url(/support&developers-contact-us/${step.icon}.webp)`,
                    WebkitMaskSize: "contain",
                    WebkitMaskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskImage: `url(/support&developers-contact-us/${step.icon}.webp)`,
                    maskSize: "contain",
                    maskRepeat: "no-repeat",
                    maskPosition: "center",
                  }}
                />
              </span>
              <p className="relative z-10 text-[15.5px] font-bold leading-[24.8px]" style={{ color: C.brandDeep }}>
                {step.title}
              </p>
              <p className="relative z-10 text-[13px] leading-[20.8px]" style={{ color: C.muted }}>
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
