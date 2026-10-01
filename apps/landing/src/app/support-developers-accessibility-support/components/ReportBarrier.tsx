import Image from "next/image";
import { C } from "./theme";

const STEPS = ["What you were doing", "Where it happened", "What got in the way", "Review and send"];

const HELPFUL = [
  { icon: "icon-check-badge", text: "What you were trying to do" },
  { icon: "icon-check-badge", text: "Where it happened" },
  { icon: "icon-check-badge", text: "What got in the way" },
  { icon: "icon-x", text: "No passwords or private messages" },
];

const TASKS = [
  { icon: "icon-eye", label: "Seeing or reading something" },
  { icon: "icon-keyboard-card", label: "Moving around or selecting" },
  { icon: "icon-edit", label: "Typing or posting" },
  { icon: "icon-play-card", label: "Watching or listening" },
  { icon: "icon-form-card", label: "Filling in a form or signing in" },
  { icon: "icon-question", label: "Something else" },
];

/**
 * Section - 08 · REPORT A BARRIER — "Report a barrier", step 1 of a 4-step
 * form ("What were you trying to do?" task picker), with a sticky progress
 * rail + "Helpful to include" card on desktop, and a step-1-of-4 progress
 * bar on mobile. The Figma frame ships only step 1's interactive state
 * (steps 2-4 are static rail/labels), matching the scope of the contact-us
 * page's ContactRequest.tsx.
 */
export default function ReportBarrier() {
  return (
    <section className="w-full bg-white px-5 py-10 lg:px-[105px] lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 lg:gap-10">
        <div className="flex flex-col gap-2.5 lg:gap-[11px] lg:max-w-[418px]">
          <h2 className="text-[26px] font-extrabold tracking-[-0.26px] lg:text-4xl lg:tracking-[-0.36px]" style={{ color: C.brandDeep }}>
            Report a barrier
          </h2>
          <p className="text-base leading-[25.6px] lg:text-[17px] lg:leading-[27.2px]" style={{ color: C.muted }}>
            Four short steps. Only the first and third are required.
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-8">
          {/* Desktop: sticky progress rail + Helpful to include */}
          <div className="hidden w-[260px] shrink-0 flex-col gap-4 lg:flex">
            <ol className="flex flex-col gap-0 rounded-[20px] border bg-white p-2.5" style={{ borderColor: C.line }}>
              {STEPS.map((step, i) => (
                <li
                  key={step}
                  className="flex h-[50px] items-center gap-3.5 rounded-xl px-3"
                  style={{ backgroundColor: i === 0 ? C.chip : "transparent" }}
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

            <div className="flex flex-col gap-3 rounded-[20px] border bg-white p-5" style={{ borderColor: C.line }}>
              <div className="flex items-center gap-2.5">
                <Image src="/support&developers-accessibility-support/icon-bulb.webp" alt="" width={20} height={20} />
                <p className="text-[15px] font-bold tracking-[-0.075px]" style={{ color: C.brandDeep }}>
                  Helpful to include
                </p>
              </div>
              <ul className="flex flex-col gap-2.5">
                {HELPFUL.map((item) => (
                  <li key={item.text} className="flex items-start gap-2.5 text-sm" style={{ color: C.ink }}>
                    <Image src={`/support&developers-accessibility-support/${item.icon}.webp`} alt="" width={16} height={16} className="mt-0.5 shrink-0" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Mobile: helpful card + step-progress bar */}
          <div className="flex flex-col gap-8 lg:hidden">
            <div className="flex flex-col gap-3 rounded-[20px] border bg-white p-5" style={{ borderColor: C.line }}>
              <div className="flex items-center gap-2.5">
                <Image src="/support&developers-accessibility-support/icon-bulb.webp" alt="" width={20} height={20} />
                <p className="text-[15px] font-bold tracking-[-0.075px]" style={{ color: C.brandDeep }}>
                  Helpful to include
                </p>
              </div>
              <ul className="flex flex-col gap-2.5">
                {HELPFUL.map((item) => (
                  <li key={item.text} className="flex items-start gap-2.5 text-sm" style={{ color: C.ink }}>
                    <Image src={`/support&developers-accessibility-support/${item.icon}.webp`} alt="" width={16} height={16} className="mt-0.5 shrink-0" />
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4 rounded-[28px] border bg-white p-[22px] shadow-[0px_1px_1px_rgba(7,59,71,0.06)]" style={{ borderColor: C.line }}>
              <div className="flex items-center gap-3">
                <p className="text-base font-bold" style={{ color: C.brandDeep }}>
                  Step 1 of 4
                </p>
                <div className="h-2 flex-1 overflow-hidden rounded-full" style={{ backgroundColor: C.line }}>
                  <div className="h-full w-1/4 rounded-full" style={{ backgroundColor: C.brand }} />
                </div>
              </div>
              <TaskForm />
            </div>
          </div>

          {/* Desktop: task form card */}
          <div
            className="hidden flex-1 flex-col rounded-[28px] border bg-white px-9 pb-[47px] pt-[35px] shadow-[0px_1px_1px_rgba(7,59,71,0.06)] lg:flex"
            style={{ borderColor: C.line }}
          >
            <TaskForm />
          </div>
        </div>
      </div>
    </section>
  );
}

function TaskForm() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1.5">
        <h3 className="text-2xl font-bold tracking-[-0.24px]" style={{ color: C.brandDeep }}>
          What were you trying to do?
        </h3>
        <p className="text-base leading-[25.6px]" style={{ color: C.muted }}>
          Pick the closest task.
        </p>

        <div className="grid grid-cols-1 gap-3 pt-5 lg:grid-cols-3">
          {TASKS.map((task) => (
            <label
              key={task.label}
              className="flex flex-col gap-2.5 rounded-[20px] border bg-white p-[18px]"
              style={{ borderColor: C.line }}
            >
              <span className="flex size-11 items-center justify-center rounded-xl" style={{ backgroundColor: C.chip }}>
                <Image src={`/support&developers-accessibility-support/${task.icon}.webp`} alt="" width={22} height={22} />
              </span>
              <p className="text-[15.5px] font-bold leading-[24.8px]" style={{ color: C.brandDeep }}>
                {task.label}
              </p>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end border-t pt-6" style={{ borderColor: C.line }}>
        <button
          type="button"
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-5 text-[15px] font-semibold text-white lg:w-auto"
          style={{ backgroundColor: C.brand }}
        >
          Continue
          <Image src="/support&developers-accessibility-support/icon-chevron-right-white-sm.webp" alt="" width={16} height={16} />
        </button>
      </div>
    </div>
  );
}
