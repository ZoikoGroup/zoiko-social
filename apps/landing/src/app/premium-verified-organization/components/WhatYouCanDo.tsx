import Image from "next/image";

/**
 * "What you can do with a verified badge" — two feature cards, each with a
 * real photo. Figma: desktop 732:1459, mobile 732:1717.
 * Desktop: side-by-side cards, photo (191x137) + text laid out horizontally.
 * Mobile: stacked cards, text only (no image — confirmed no image child in
 * mobile's card nodes).
 * Background: white both. Gutter 105px desktop / 16px mobile.
 */
const items = [
  {
    title: "Community leadership",
    body: "Host official community forums and lead larger discussions on Zoiko with credibility.",
    image: "/premium-verified-organization/community-leadership.webp",
    alt: "Community leader with volunteers",
  },
  {
    title: "Fundraising campaigns",
    body: "Run verified fundraising campaigns that build trust with your supporters.",
    image: "/premium-verified-organization/fundraising-campaigns.webp",
    alt: "Volunteers celebrating a fundraising campaign",
  },
];

export default function WhatYouCanDo() {
  return (
    <section className="w-full bg-white px-4 pb-32 pt-[47px] lg:px-[105px] lg:py-[80px]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-10 lg:gap-12">
        <h2 className="font-jakarta text-[24px] font-extrabold leading-[28.8px] tracking-[-0.24px] text-[#102a32] lg:text-[32px] lg:leading-[38.4px] lg:tracking-[-0.32px]">
          What you can do with a verified badge
        </h2>

        <div className="flex w-full flex-col items-start gap-6 lg:flex-row lg:justify-center lg:gap-9">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex w-full flex-col items-start gap-4 rounded-2xl border border-[#dce5e8] bg-white px-6 pb-10 pt-6 shadow-[0px_1px_1px_rgba(7,59,71,0.06)] lg:flex-1 lg:flex-row lg:items-center lg:gap-6"
            >
              <div className="relative hidden h-[137px] w-[191px] shrink-0 lg:block">
                <Image src={item.image} alt={item.alt} fill className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col items-start gap-[15px]">
                <h3 className="font-jakarta text-[17px] font-bold leading-normal text-[#066879]">{item.title}</h3>
                <p className="font-jakarta text-[16px] font-normal leading-[25.6px] text-[#5e7076]">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
