import Image from "next/image";

interface TimelineItem {
  day: string;
  title: string;
  description: string;
}

interface StatusCard {
  icon: string;
  title: string;
  description: string;
}

const timelineItems: TimelineItem[] = [
  {
    day: "Day 1",
    title: "You submit appeal",
    description:
      "Click the appeal button in your enforcement notice. Write your explanation. Submit. You get a case number immediately and can track status anytime.",
  },
  {
    day: "Days 2-4",
    title: "Initial review",
    description:
      "A fresh team reviews your case. They read your explanation. They check the original content. They evaluate against our policies. Usually completes in 2-4 business days.",
  },
  {
    day: "Day 5",
    title: "Decision made",
    description:
      "The review team makes a decision: Overturn, Uphold, or Modify. They document their reasoning.",
  },
  {
    day: "Day 5-6",
    title: "You're notified",
    description:
      "You get a notification with the decision and full explanation. If overturned, action is immediately reversed (content restored, account unsuspended, etc).",
  },
];

const statusCards: StatusCard[] = [
  {
    icon: "/appeals/icon1.png",
    title: "In Review",
    description:
      "Your case is being evaluated. You'll be notified when a decision is made.",
  },
  {
    icon: "/appeals/icon2.png",
    title: "Decided",
    description:
      "A decision has been made. Check your notifications for the full explanation.",
  },
  {
    icon: "/appeals/icon3.png",
    title: "Track All Appeals",
    description:
      "View your full appeal history, decisions, and status anytime in your account.",
  },
];

export default function Timeline() {
  return (
    <section className="w-full bg-[#F7F9FA]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start px-6 py-12 sm:px-8 sm:py-16 md:px-12 lg:px-20 lg:py-20 xl:px-28">
        <div className="flex w-full max-w-[1280px] flex-col items-start gap-6">
          {/* Heading */}
          <div className="flex w-full flex-col items-start">
            <h2 className="w-full text-3xl font-extrabold leading-10 text-[#073B47] sm:text-4xl">
              What to expect: Timeline &amp; status tracking
            </h2>
          </div>

          {/* Description */}
          <div className="flex w-full flex-col items-start">
            <p className="w-full text-base font-normal leading-7 text-[#46636A]">
              Here&apos;s what happens at each stage and how long it typically
              takes.
            </p>
          </div>

          {/* Timeline */}
          <div className="flex w-full flex-col items-start pt-2 sm:pt-6">
            {timelineItems.map((item, index) => (
              <div
                key={item.title}
                className={`flex w-full flex-col gap-4 py-6 sm:flex-row sm:items-start sm:gap-6 ${
                  index !== timelineItems.length - 1
                    ? "border-b border-[#D5E7EA]"
                    : ""
                }`}
              >
                {/* Day Badge */}
                <div className="flex w-fit shrink-0 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#F2F4F5] to-[#FFFFFF] px-5 py-3 sm:w-28 sm:px-4 sm:pb-4">
                  <span className="text-center text-sm font-bold text-[#00AFC7]">
                    {item.day}
                  </span>
                </div>

                {/* Content */}
                <div className="flex min-w-0 flex-1 flex-col items-start gap-2.5">
                  <h3 className="w-full text-lg font-bold text-[#073B47]">
                    {item.title}
                  </h3>

                  <p className="w-full text-sm font-normal leading-6 text-[#46636A]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Status Heading */}
          <div className="flex w-full flex-col items-start pt-6 sm:pt-10">
            <h3 className="text-lg font-bold text-[#073B47]">
              Check your appeal status anytime
            </h3>
          </div>

          {/* Status Cards */}
          <div className="grid w-full grid-cols-1 gap-6 pt-2 sm:pt-6 md:grid-cols-3">
            {statusCards.map((card) => (
              <div
                key={card.title}
                className="flex min-h-[224px] w-full flex-col items-start justify-start gap-3 rounded-[20px] border border-[#D5E7EA] bg-white p-6"
              >
                {/* Icon */}
                <div className="flex w-full items-center justify-center pb-px">
                  <Image
                    src={card.icon}
                    alt=""
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain"
                  />
                </div>

                {/* Title */}
                <div className="flex w-full flex-col items-center pt-1">
                  <h4 className="text-center text-lg font-bold text-[#00AFC7]">
                    {card.title}
                  </h4>
                </div>

                {/* Description */}
                <div className="flex w-full flex-col items-center">
                  <p className="max-w-[300px] text-center text-xs font-normal leading-5 text-[#46636A]">
                    {card.description}
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