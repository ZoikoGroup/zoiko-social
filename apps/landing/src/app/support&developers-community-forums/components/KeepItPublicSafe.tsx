import Image from "next/image";
import { C } from "./theme";

const ITEMS = [
  { icon: "icon-lock", title: "Passwords", subtitle: null },
  { icon: "icon-hash", title: "Recovery codes", subtitle: null },
  { icon: "icon-key", title: "API keys", subtitle: "or tokens" },
  { icon: "icon-home", title: "Home addresses", subtitle: "or phone numbers" },
  { icon: "icon-chat", title: "Private support", subtitle: "case details" },
];

/** Section - 08 · KEEP IT PUBLIC-SAFE — "Never post" list of 5 sensitive-data reminders. */
export default function KeepItPublicSafe() {
  return (
    <section className="w-full bg-white px-4 py-10 sm:px-8 sm:py-14 lg:px-[105px] lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 lg:gap-10">
        <div className="flex flex-col gap-2.5">
          <h2 className="text-[28px] font-extrabold tracking-[-0.36px] sm:text-3xl lg:text-4xl" style={{ color: C.brandDeep }}>
            Keep it public-safe
          </h2>
          <p className="text-base leading-[27.2px] sm:text-[17px]" style={{ color: C.muted }}>
            Everything you post can be read by anyone.
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-3.5 sm:grid-cols-3 lg:flex lg:flex-nowrap lg:justify-center">
          {ITEMS.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center gap-2.5 rounded-[20px] border bg-white px-4 py-[22px] text-center lg:w-[234px]"
              style={{ borderColor: C.line }}
            >
              <span className="flex size-[52px] items-center justify-center rounded-2xl" style={{ backgroundColor: C.orangeFill }}>
                <Image src={`/support&developers-community-forums/${item.icon}.webp`} alt="" width={24} height={24} />
              </span>
              <p className="text-[14.5px] font-bold" style={{ color: C.brandDeep }}>
                {item.title}
              </p>
              {item.subtitle && (
                <p className="text-xs" style={{ color: C.muted }}>
                  {item.subtitle}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
