import { C } from "./theme";

export default function NewListingsNotice() {
  return (
    <section className="w-full px-5 py-6 lg:px-0">
      <div
        className="
          mx-auto
          flex
          w-full
          max-w-[1232px]
          flex-wrap
          items-center
          gap-5
          rounded-[20px]
          p-6
        "
        style={{
          backgroundColor: C.noticeBackground,
          border: `1px solid ${C.cyan89}`,
        }}
      >
        {/* Icon */}
        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-xl
            bg-white
          "
        >
          <div className="relative h-5 w-5 overflow-hidden">
            <div
              className="
                absolute
                left-[2.75px]
                top-[2.75px]
                h-4
                w-4
                rounded-full
              "
              style={{
                border: `2px solid ${C.cyan15}`,
              }}
            />

            <div
              className="
                absolute
                left-[11px]
                top-[6.42px]
                h-1.5
                w-[3.21px]
              "
              style={{
                borderLeft: `2px solid ${C.cyan15}`,
                borderBottom: `2px solid ${C.cyan15}`,
              }}
            />
          </div>
        </div>

        {/* Text */}
        <div
          className="
            h-11
            min-w-56
            flex-1
          "
        >
          <div
            className="
              text-base
              font-bold
              leading-6
            "
            style={{
              color: C.cyan13,
            }}
          >
            2 listings are new since your last visit
          </div>

          <div
            className="
              text-xs
              font-normal
              leading-5
            "
            style={{
              color: C.azure42,
            }}
          >
            Marked with a &quot;New&quot; badge above. Save this search to
            get notified about future recent listings, on your terms.
          </div>
        </div>

        {/* Save This Search */}
        <button
          type="button"
          className="
            flex
            items-center
            justify-center
            rounded-[10px]
            bg-white
            px-4
            py-2
            text-center
            text-sm
            font-semibold
          "
          style={{
            color: C.cyan15,
            border: `1px solid ${C.cyan89}`,
          }}
        >
          Save This Search
        </button>
      </div>
    </section>
  );
}