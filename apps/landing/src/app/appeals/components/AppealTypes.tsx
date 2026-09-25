interface AppealType {
  number: string;
  title: string;
  description: string;
}

const appealTypes: AppealType[] = [
  {
    number: "1",
    title: "Content Removal",
    description:
      "Your post, comment, or image was removed. Appeal if you believe it didn't violate our community standards.",
  },
  {
    number: "2",
    title: "Account Suspension",
    description:
      "Your account is temporarily suspended (usually 7-30 days). Appeal if you believe the suspension was unfair.",
  },
  {
    number: "3",
    title: "Account Ban",
    description:
      "Your account was permanently banned. You can still appeal, but this is our strongest enforcement action. We listen to all appeals.",
  },
];

export default function AppealTypes() {
  return (
    <section className="w-full bg-[#F7F9F9]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start px-6 py-12 sm:px-8 sm:py-16 md:px-12 lg:px-20 lg:py-20 xl:px-28">
        <div className="flex w-full max-w-[1280px] flex-col items-start gap-6">
          {/* Heading */}
          <div className="flex w-full flex-col items-start">
            <h2 className="w-full text-3xl font-extrabold leading-10 text-[#073B47] sm:text-4xl">
              Three types of appeals
            </h2>
          </div>

          {/* Description */}
          <div className="flex w-full flex-col items-start">
            <p className="w-full text-base font-normal leading-7 text-[#46636A]">
              Different actions require different appeals. Choose the one that
              applies to your situation.
            </p>
          </div>

          {/* Cards */}
          <div className="grid w-full grid-cols-1 gap-6 pt-2 sm:pt-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {appealTypes.map((type) => (
              <div
                key={type.number}
                className="flex w-full flex-col items-center gap-3 rounded-[20px] border border-[#BFE7E9] bg-white p-6 sm:p-8"
              >
                {/* Number */}
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#00AFC7] to-[#0097B2]">
                  <span className="text-center text-3xl font-normal leading-none text-white">
                    {type.number}
                  </span>
                </div>

                {/* Title */}
                <div className="flex w-full flex-col items-center pt-[4.9px]">
                  <h3 className="text-center text-lg font-bold text-[#00AFC7]">
                    {type.title}
                  </h3>
                </div>

                {/* Description */}
                <div className="flex w-full flex-col items-center">
                  <p className="text-center text-sm font-normal leading-6 text-[#46636A]">
                    {type.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}