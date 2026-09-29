import Image from "next/image";
import Link from "next/link";
import React from "react";

interface SupportCard {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  mobileIcon: React.ReactNode;
  btnLabel: string;
  btnHref: string;
}

const SUPPORT_CARDS: SupportCard[] = [
  {
    title: "Report a Problem",
    description:
      "See something concerning? Report it directly within the app with one click. Our team reviews it within 24 hours.",
    imageSrc: "/zoiko Social-Trust&Safety-protecting-under-18s/zupu2.png",
    imageAlt: "Team members reviewing a reported problem document together",
    mobileIcon: (
      <div className="flex size-9 items-center justify-center rounded-lg bg-white shadow-xs text-xl">
        🗨️
      </div>
    ),
    btnLabel: "Report Now",
    btnHref: "/adopt-report-a-concern",
  },
  {
    title: "Crisis Support",
    description:
      "If you're in crisis or feeling unsafe, reach out to trusted adults or a crisis helpline. Links to resources available in-app.",
    imageSrc: "/zoiko Social-Trust&Safety-protecting-under-18s/zupu3.png",
    imageAlt: "People offering a supportive hug outdoors in crisis support",
    mobileIcon: (
      <div className="flex size-9 items-center justify-center rounded-lg bg-red-500 text-white font-bold text-xs shadow-xs">
        SOS
      </div>
    ),
    btnLabel: "Find Resources",
    btnHref: "/safety-support-resources",
  },
  {
    title: "Help Center",
    description:
      "Questions about safety features, how to report, or our policies? Visit our Help Center for detailed answers.",
    imageSrc: "/zoiko Social-Trust&Safety-protecting-under-18s/zupu4.png",
    imageAlt: "Help Center support representative smiling with headset",
    mobileIcon: (
      <div className="flex size-9 items-center justify-center rounded-lg bg-white shadow-xs text-xl">
        🛟
      </div>
    ),
    btnLabel: "Learn More",
    btnHref: "/safety-support-resources",
  },
];

export default function SupportWhenYouNeedIt() {
  return (
    <section className="w-full bg-white py-12 sm:py-0 sm:pb-24 lg:pb-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold tracking-tight text-[#0F2422] sm:text-3xl lg:text-[34px]">
          Support When You Need It
        </h2>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {SUPPORT_CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-md"
            >
              {/* Desktop Card Photo (Hidden on Mobile) */}
              <div className="relative hidden h-[200px] w-full overflow-hidden sm:block sm:h-[220px]">
                <Image
                  src={card.imageSrc}
                  alt={card.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>

              {/* Mobile Top Header with Icon (Hidden on Desktop) */}
              <div className="flex items-center bg-[#F0F8F9] px-5 py-4 sm:hidden">
                {card.mobileIcon}
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-5 sm:p-7">
                <div>
                  <h3 className="text-base font-bold text-[#0F2422] sm:text-lg">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-[#5A7371] sm:mt-2.5 sm:text-sm">
                    {card.description}
                  </p>
                </div>

                <div className="mt-5 pt-1 sm:mt-6 sm:pt-2">
                  <Link
                    href={card.btnHref}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#006D77] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#005B63] sm:text-sm"
                  >
                    <span>{card.btnLabel}</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
