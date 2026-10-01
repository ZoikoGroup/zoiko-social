import Image from "next/image";

const ITEMS = [
  {
    icon: "icon-shield",
    title: "No diagnosis needed",
    body: "Getting help never asks about a disability.",
  },
  {
    icon: "icon-eye-off",
    title: "Share only what helps",
    body: "Most details are optional.",
  },
  {
    icon: "icon-chat-note",
    title: "Another way if you need it",
    body: "If a form is hard to use, Contact Us works too.",
  },
];

/**
 * Note - How we handle your request — dark teal band right after the hero.
 *
 * Three reassurance items (shield / eye-off / chat icons): no diagnosis
 * needed, share only what helps, another way if you need it. Matches Figma
 * node 1274:4203.
 */
export default function NoteHowWeHandle() {
  return (
    <section className="w-full px-4 py-6 sm:px-8 lg:px-[105px] lg:py-9" style={{ backgroundColor: "#073B47" }}>
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-start gap-5 sm:flex-row sm:flex-wrap sm:justify-center lg:gap-7">
        {ITEMS.map((item) => (
          <div key={item.title} className="flex w-full items-start gap-4 sm:w-[391px]">
            <span
              className="flex size-11 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
            >
              <Image src={`/support&developers-accessibility-support/${item.icon}.png`} alt="" width={22} height={22} />
            </span>
            <div className="flex flex-col">
              <p className="text-[17px] font-bold leading-[27.2px] text-white">{item.title}</p>
              <p className="text-[14.5px] leading-[23.2px]" style={{ color: "#BFE3E8" }}>
                {item.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
