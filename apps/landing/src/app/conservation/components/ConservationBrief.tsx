"use client";

export default function ConservationBrief() {
  return (
    <section className="w-full bg-[#F5F8F8]">
      <div className="w-full px-0 pb-[40px]">
        <div
          className="
            mx-auto
            w-full
            max-w-[1232px]
            rounded-3xl
            bg-[#EAF3F5]
            px-7
            py-6
          "
        >
          {/* Title */}
          <div className="mb-[14px] w-full">
            <h2
              className="
                font-['Plus_Jakarta_Sans']
                text-base
                font-extrabold
                leading-6
                text-[#073B47]
              "
            >
              Conservation Brief — Pacific Northwest wildlife corridor
            </h2>
          </div>

          {/* Information Grid */}
          <div className="grid w-full grid-cols-2 gap-x-[64px] gap-y-[10px]">
            {/* Issue */}
            <div className="flex flex-col gap-[2px]">
              <div
                className="
                  font-['Plus_Jakarta_Sans']
                  text-xs
                  font-bold
                  uppercase
                  leading-4
                  tracking-tight
                  text-[#073B47]
                "
              >
                Issue
              </div>

              <p
                className="
                  font-['Plus_Jakarta_Sans']
                  text-sm
                  font-normal
                  leading-5
                  text-[#3F6972]
                "
              >
                A regional wildlife corridor connecting two forest reserves
                has moved from approved/funded status to active protection.
              </p>
            </div>

            {/* Why it matters */}
            <div className="flex flex-col gap-[2px]">
              <div
                className="
                  font-['Plus_Jakarta_Sans']
                  text-xs
                  font-bold
                  uppercase
                  leading-4
                  tracking-tight
                  text-[#073B47]
                "
              >
                Why it matters
              </div>

              <p
                className="
                  font-['Plus_Jakarta_Sans']
                  text-sm
                  font-normal
                  leading-5
                  text-[#3F6972]
                "
              >
                Active protection restricts new development along the
                corridor, supporting safer wildlife movement between reserves.
              </p>
            </div>

            {/* Safe region / authority */}
            <div className="flex flex-col gap-[2px]">
              <div
                className="
                  font-['Plus_Jakarta_Sans']
                  text-xs
                  font-bold
                  uppercase
                  leading-4
                  tracking-tight
                  text-[#073B47]
                "
              >
                Safe region / authority
              </div>

              <p
                className="
                  font-['Plus_Jakarta_Sans']
                  text-sm
                  font-normal
                  leading-5
                  text-[#3F6972]
                "
              >
                Pacific Northwest, USA — state wildlife authority
                (state-level).
              </p>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-[2px]">
              <div
                className="
                  font-['Plus_Jakarta_Sans']
                  text-xs
                  font-bold
                  uppercase
                  leading-4
                  tracking-tight
                  text-[#073B47]
                "
              >
                Status
              </div>

              <p
                className="
                  font-['Plus_Jakarta_Sans']
                  text-sm
                  font-normal
                  leading-5
                  text-[#3F6972]
                "
              >
                Conservation action update · Active / protected (previously
                Approved / funded)
              </p>
            </div>

            {/* Source basis */}
            <div className="flex flex-col gap-[2px]">
              <div
                className="
                  font-['Plus_Jakarta_Sans']
                  text-xs
                  font-bold
                  uppercase
                  leading-4
                  tracking-tight
                  text-[#073B47]
                "
              >
                Source basis
              </div>

              <p
                className="
                  font-['Plus_Jakarta_Sans']
                  text-sm
                  font-normal
                  leading-5
                  text-[#3F6972]
                "
              >
                Pacific Conservation Trust — official designation notice
                (primary document available).
              </p>
            </div>

            {/* What changed */}
            <div className="flex flex-col gap-[2px]">
              <div
                className="
                  font-['Plus_Jakarta_Sans']
                  text-xs
                  font-bold
                  uppercase
                  leading-4
                  tracking-tight
                  text-[#073B47]
                "
              >
                What changed
              </div>

              <p
                className="
                  font-['Plus_Jakarta_Sans']
                  text-sm
                  font-normal
                  leading-5
                  text-[#3F6972]
                "
              >
                Status moved from Approved / funded to Active / protected
                effective this week.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}