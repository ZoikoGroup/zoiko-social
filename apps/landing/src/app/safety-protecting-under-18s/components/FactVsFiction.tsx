interface FactMythItem {
  type: "MYTH" | "FACT";
  title: string;
  description: string;
}

const ITEMS: FactMythItem[] = [
  {
    type: "MYTH",
    title: "We automatically filter all bad content.",
    description:
      "Technology helps us find problematic content, but humans review and decide. Context matters, and we respect nuance.",
  },
  {
    type: "FACT",
    title: "You can appeal any moderation decision.",
    description:
      "Disagree with our decision? Submit an appeal and our team will review with fresh eyes and explain the outcome.",
  },
  {
    type: "MYTH",
    title: "We monitor everything young people do on our platform.",
    description:
      "We enforce our community standards, but we respect privacy. We don't track personal conversations or sell your data.",
  },
  {
    type: "FACT",
    title: "We work with law enforcement when needed.",
    description:
      "If we identify illegal activity involving minors, we report it to authorities. We take legal and moral obligations seriously.",
  },
];

export default function FactVsFiction() {
  return (
    <section className="w-full bg-white py-12 sm:py-0 sm:pb-24 lg:pb-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold tracking-tight text-[#0F2422] sm:text-3xl lg:text-[34px]">
          Separating Fact From Fiction
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:gap-8">
          {ITEMS.map((item) => {
            const isFact = item.type === "FACT";

            return (
              <div
                key={item.title}
                className={`flex flex-col rounded-2xl border border-gray-200/80 p-6 shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-md sm:p-7 ${
                  isFact
                    ? "bg-[#FFF6ED] sm:bg-white sm:border-l-4 sm:border-l-[#006D77]"
                    : "bg-white"
                }`}
              >
                <div className="mb-3.5 sm:mb-4">
                  <span
                    className={`inline-block rounded-md px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                      isFact
                        ? "bg-[#FEEBC8] text-[#C05621] sm:bg-[#E6F4F6] sm:text-[#006D77]"
                        : "bg-[#E0F2FE] text-[#0284C7] sm:bg-[#FFF3E8] sm:text-[#D97706]"
                    }`}
                  >
                    {item.type}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0F2422] sm:text-lg">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-[#5A7371] sm:mt-2.5 sm:text-sm">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
