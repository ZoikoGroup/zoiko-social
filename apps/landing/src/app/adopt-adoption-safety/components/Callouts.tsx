import { C } from "./theme";
import { CALLOUTS } from "./guidance";

/**
 * The three quoted notices — the wording the product itself shows at the
 * moments they describe. Each is ruled on its left edge, in the caution
 * colour where it warns.
 */
export default function Callouts() {
  return (
    <div className="mt-8 flex max-w-[640px] flex-col gap-3">
      {CALLOUTS.map((callout) => (
        <div
          key={callout.label}
          className="flex flex-col gap-1 rounded-lg px-5 pb-4 pt-3.5"
          style={{
            background: C.page,
            borderLeft: `3px solid ${callout.caution ? C.warnLine : C.brand}`,
          }}
        >
          <p className="text-xs font-bold uppercase leading-4 tracking-tight" style={{ color: C.muted }}>
            {callout.label}
          </p>
          <p className="text-sm leading-5" style={{ color: C.inkDeep }}>
            &ldquo;{callout.quote}&rdquo;
          </p>
        </div>
      ))}
    </div>
  );
}
