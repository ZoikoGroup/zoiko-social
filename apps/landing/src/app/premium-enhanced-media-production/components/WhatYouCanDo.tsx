const ITEMS = [
  { title: "Upload 4K photos", body: "Share high-resolution photos with detailed clarity and full color range." },
  { title: "Longer videos", body: "Record and upload videos up to 10 minutes on Premium plans." },
  { title: "Batch upload", body: "Upload multiple photos and videos at once to save time." },
  { title: "Edit before posting", body: "Crop, filter, and adjust media before publishing to communities." },
];

/**
 * "What you can do" — desktop-only 2x2 grid of plain text cards.
 *
 * Figma: desktop 732:518 (Container 732:522). Confirmed absent from the
 * mobile frame's node tree entirely — mobile has a different section in
 * this position ("Enhanced capabilities", see EnhancedCapabilities.tsx)
 * with different card titles/content, not a resized version of this one.
 * So this is rendered desktop-only (`hidden lg:block`) rather than shared.
 */
export default function WhatYouCanDo() {
  return (
    <section className="hidden w-full bg-white py-20 lg:block">
      <div className="mx-auto w-full max-w-[1440px] px-[105px]">
        <h2 className="font-jakarta text-[36px] font-extrabold leading-[45.8px] text-[#102a32]">What you can do</h2>
        <div className="mt-[47px] grid grid-cols-2 gap-6">
          {ITEMS.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-4 rounded-[20px] border border-[#dce5e8] bg-white px-6 pb-10 pt-6 drop-shadow-[0px_1px_1px_rgba(7,59,71,0.06)]"
            >
              <p className="font-jakarta text-[17px] font-bold leading-normal text-[#066879]">{item.title}</p>
              <p className="font-jakarta text-[16px] font-normal leading-[25.6px] text-[#5e7076]">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
