import { C } from "./theme";
import { STAGES, STAGE_TITLES } from "./guidance";

/** One labelled block inside the stage panel. */
function Part({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2 pb-5">
      <p className="text-xs font-bold uppercase leading-4 tracking-wide" style={{ color: C.label }}>
        {label}
      </p>
      <p className="text-sm leading-5" style={{ color: C.inkDeep }}>
        {children}
      </p>
    </div>
  );
}

/**
 * The six-stage path: the numbered stages, then the detail for stage one.
 * The comp details only that stage, so the row is a diagram rather than a
 * set of tabs.
 */
export default function StagePath() {
  const stage = STAGES[0];

  return (
    <>
      <h2 className="text-xl font-extrabold leading-8" style={{ color: C.ink }}>
        The six-stage safe adoption path
      </h2>

      {/* All six share the row from lg, where there is space for them: at a
          fixed width they total 1278px against a 1232px container and the
          last one gets clipped. Below lg the row scrolls sideways instead of
          wrapping, so the stages still read as a sequence. */}
      <ol className="-mx-4 mt-4 flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:px-0 lg:grid lg:grid-cols-6 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
        {STAGE_TITLES.map((title, i) => {
          const on = i === 0;
          return (
            <li
              key={title}
              className="flex w-52 min-w-36 shrink-0 flex-col items-start gap-2 rounded-[20px] p-4 lg:w-auto lg:min-w-0"
              style={
                on
                  ? { background: C.chip, border: `1px solid ${C.brand}` }
                  : { background: "#fff", border: `1px solid ${C.line}` }
              }
            >
              <span
                className="flex size-6 items-center justify-center rounded-xl text-xs font-extrabold"
                style={on ? { background: C.brand, color: "#fff" } : { background: C.page, color: C.muted }}
              >
                {i + 1}
              </span>
              <span className="text-xs font-bold leading-4" style={{ color: C.inkDeep }}>
                {title}
              </span>
            </li>
          );
        })}
      </ol>

      <div className="mt-5 rounded-3xl bg-white p-6 sm:p-8" style={{ border: `1px solid ${C.line}` }}>
        <h3 className="text-xl font-extrabold leading-8" style={{ color: C.ink }}>
          1. {stage.title}
        </h3>
        <p className="text-sm leading-5" style={{ color: C.muted }}>
          &ldquo;{stage.question}&rdquo;
        </p>

        {/* Two columns from sm, as in the comp: Do this beside Why it
            matters, then Watch for beside Next safe step. */}
        <div className="grid gap-x-10 pt-5 sm:grid-cols-2">
          <Part label="Do this">{stage.doThis}</Part>
          <Part label="Why it matters">{stage.whyItMatters}</Part>
          <Part label="Watch for">{stage.watchFor}</Part>
          <Part label="Next safe step">{stage.nextStep}</Part>
        </div>
      </div>
    </>
  );
}
