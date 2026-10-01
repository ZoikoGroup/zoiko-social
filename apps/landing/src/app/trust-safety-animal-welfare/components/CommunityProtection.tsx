import Image from "next/image";

const CHECKLIST_ITEMS = [
  "24/7 moderation team",
  "AI-powered harm detection",
  "User reporting & escalation",
  "Appeal process for users",
  "Monthly transparency reports",
];

export default function CommunityProtection() {
  return (
    <section className="w-full bg-white pb-20 sm:pb-24 lg:pb-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Column: Image zuaw2.png */}
          <div className="relative h-[320px] w-full overflow-hidden rounded-3xl shadow-sm sm:h-[400px] lg:h-[440px]">
            <Image
              src="/zoiko Social-trust&Safety-animal-welfare/zuaw2.png"
              alt="Diverse group of cheerful community members standing together"
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover object-center"
            />
          </div>

          {/* Right Column: Copy & Checklist */}
          <div className="max-w-[520px]">
            <h2 className="text-2xl font-bold tracking-tight text-[#0F2422] sm:text-3xl lg:text-[34px] lg:leading-[1.25]">
              Community-Powered Protection
            </h2>

            <p className="mt-5 text-sm leading-relaxed text-[#5A7371] sm:text-base sm:leading-7">
              Our moderation system combines human experts with AI detection to
              keep harmful content off the platform. Members report concerns,
              our team investigates, and we take action — transparently and
              fairly.
            </p>

            <ul className="mt-6 space-y-3.5 text-xs font-medium sm:mt-7 sm:text-sm">
              {CHECKLIST_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-3 text-[#5A7371]">
                  <span className="flex size-5 shrink-0 items-center justify-center font-bold text-[#EA8A1A]">
                    ✓
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
