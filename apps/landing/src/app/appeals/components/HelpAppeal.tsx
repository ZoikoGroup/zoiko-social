import Link from "next/link";
import Image from "next/image";

const supportOptions = [
  {
    icon: "/appeals/1.png",
    title: "Appeal Help Center",
    description:
      "Step-by-step guides for each type of appeal. Real examples. Common questions. Everything you need to write a strong appeal.",
    button: "Visit Help Center",
    href: "#",
  },
  {
    icon: "/appeals/2.png",
    title: "Talk to Support",
    description:
      "Questions about your case? Confused by our decision? Our support team can help clarify (though they can't change the decision).",
    button: "Contact Support",
    href: "#",
  },
  {
    icon: "/appeals/3.png",
    title: "Community Forum",
    description:
      "Other users have been through appeals. Share your experience. Get advice. Learn from real cases. Moderated for fairness.",
    button: "Join Forum",
    href: "#",
  },
  {
    icon: "/appeals/4.png",
    title: "Appeal Status Hotline",
    description:
      "In a rush? Need to know your status? Text your case number. We'll send you real-time updates on your appeal review.",
    button: "Text Status",
    href: "#",
  },
];

export default function HelpAppeal() {
  return (
    <section className="w-full bg-[#F7F9FA] px-6 py-12 sm:px-8 md:px-12 lg:px-20 xl:px-28 lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-6">
        {/* Heading */}
        <div className="flex w-full flex-col items-start">
          <h2 className="font-['Plus_Jakarta_Sans'] text-3xl font-extrabold leading-10 text-[#073B47] sm:text-4xl">
            Need help with your appeal?
          </h2>
        </div>

        {/* Subtitle */}
        <div className="flex w-full flex-col items-start">
          <p className="font-['Plus_Jakarta_Sans'] text-base font-normal leading-7 text-[#46636A]">
            We want you to succeed. Multiple ways to get support throughout
            your appeal.
          </p>
        </div>

        {/* Support Cards */}
        <div className="grid w-full grid-cols-1 gap-6 pt-2 md:grid-cols-2">
          {supportOptions.map((option) => (
            <div
              key={option.title}
              className="flex w-full flex-col items-start gap-3 rounded-[20px] border border-[#D5E7EA] bg-gradient-to-br from-[#F2F5F6] to-white p-6 sm:p-8"
            >
              {/* Icon + Title */}
              <div className="flex w-full items-center gap-2">
                <Image
                  src={option.icon}
                  alt=""
                  width={28}
                  height={28}
                  className="h-7 w-7 shrink-0 object-contain"
                />

                <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-[#00AFC7]">
                  {option.title}
                </h3>
              </div>

              {/* Description */}
              <div className="flex w-full flex-col items-start pb-2 sm:pb-5">
                <p className="font-['Plus_Jakarta_Sans'] text-sm font-normal leading-6 text-[#46636A]">
                  {option.description}
                </p>
              </div>

              {/* Button */}
              <Link
                href={option.href}
                className="inline-flex w-fit items-center justify-center rounded-xl bg-[#00AFC7] px-5 py-3 font-['Plus_Jakarta_Sans'] text-sm font-semibold text-white transition-opacity duration-200 hover:opacity-90"
              >
                {option.button}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}