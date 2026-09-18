import { C } from "./theme";

export default function RecentlyListedNotice() {
  return (
    <section className="w-full px-5 py-6 lg:px-0">
      <div
       
  className="mx-auto flex w-full max-w-[1232px] flex-wrap items-center gap-4 rounded-[20px] px-6 py-5"
  style={{
    backgroundColor: C.noticeBackground,
    border: `1px solid ${C.cyan89}`,
        }}
      >
        {/* Icon */}
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white">
          <div className="relative size-5 overflow-hidden">
            <div
              className="absolute left-[2.38px] top-[2.38px] size-3.5 rounded-full"
              style={{
                border: `1.42px solid ${C.cyan15}`,
              }}
            />

            <div
              className="absolute left-[9.5px] top-[5.54px] h-1.5 w-[2.77px]"
              style={{
                borderLeft: `1.42px solid ${C.cyan15}`,
                borderBottom: `1.42px solid ${C.cyan15}`,
              }}
            />
          </div>
        </div>

        {/* Text */}
        <div className="min-w-56 flex-1">
          <p className="text-xs leading-5">
            <span
              className="font-bold"
              style={{ color: C.cyan13 }}
            >
              What &quot;Recently Listed&quot; means:
            </span>{" "}
            <span
              className="font-normal"
              style={{ color: C.azure42 }}
            >
              this view shows active adoption listings ordered by their
              original public publication time. &quot;Listed&quot; is when a
              listing first went public; &quot;Updated&quot; marks a later
              material change, and never resets the original date.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}