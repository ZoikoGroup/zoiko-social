
const CENSORSHIP_ITEMS = {
  col1: [
    "Blanket ban on key language",
    "Opaque rules",
    "One-size-fits-all",
  ],
  col2: [
    "No context or intent",
    "No appeals",
  ],
};

const ZOIKO_ITEMS = {
  col1: [
    "Context drives every action",
    "Clear public policies",
    "Human judgement matters",
  ],
  col2: [
    "Nuance and education allowed",
    "Fair appeal process",
  ],
};

export default function NotCensorship() {
  return (
    <section className="w-full bg-[#F8FAFA] py-12 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-6 lg:px-8">
        <h2 className="text-left text-[26px] font-bold tracking-tight text-[#0F2422] sm:text-3xl lg:text-[34px]">
          Not Censorship. <br className="sm:hidden" />Thoughtful <br className="sm:hidden" />Moderation.
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:gap-6 lg:grid-cols-2">
          {/* Card 1: Censorship */}
          <div className="rounded-2xl border border-gray-200/90 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-8">
            <h3 className="flex items-center gap-2 text-base font-bold text-[#0F2422] sm:text-lg">
              <span className="text-sm sm:hidden">❌</span>
              <span>Censorship</span>
            </h3>

            <div className="mt-5 grid grid-cols-1 gap-y-3.5 sm:mt-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-4">
              <div className="space-y-3.5 sm:space-y-4">
                {CENSORSHIP_ITEMS.col1.map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <span className="text-sm font-semibold text-[#EA8A1A]">
                      ✓
                    </span>
                    <span className="text-xs leading-relaxed text-[#5A7371] sm:text-sm">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3.5 sm:space-y-4">
                {CENSORSHIP_ITEMS.col2.map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <span className="text-sm font-semibold text-[#EA8A1A]">
                      ✓
                    </span>
                    <span className="text-xs leading-relaxed text-[#5A7371] sm:text-sm">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Card 2: Zoiko's Approach (Warm peach/amber highlight) */}
          <div className="rounded-2xl border-2 border-[#EA8A1A] bg-[#FFF9F2] p-6 shadow-sm transition-shadow hover:shadow-md sm:border-[#EA8A1A]/50 sm:p-8">
            <h3 className="flex items-center gap-2 text-base font-bold text-[#0F2422] sm:text-lg">
              <span className="text-sm sm:hidden">✨</span>
              <span>Zoiko&apos;s Approach</span>
            </h3>

            <div className="mt-5 grid grid-cols-1 gap-y-3.5 sm:mt-6 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-4">
              <div className="space-y-3.5 sm:space-y-4">
                {ZOIKO_ITEMS.col1.map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <span className="text-sm font-semibold text-[#EA8A1A]">
                      ✓
                    </span>
                    <span className="text-xs leading-relaxed text-[#0F2422] font-medium sm:text-sm">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3.5 sm:space-y-4">
                {ZOIKO_ITEMS.col2.map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <span className="text-sm font-semibold text-[#EA8A1A]">
                      ✓
                    </span>
                    <span className="text-xs leading-relaxed text-[#0F2422] font-medium sm:text-sm">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
