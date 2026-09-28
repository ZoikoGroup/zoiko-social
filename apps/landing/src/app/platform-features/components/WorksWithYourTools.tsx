import Image from "next/image";
import { C } from "./theme";

const TOOLS = [
  { icon: "/platform-features/icon-calendar-integration.webp", label: "Calendar integration" },
  { icon: "/platform-features/icon-email-notifications.webp", label: "Email notifications" },
  { icon: "/platform-features/icon-mobile-apps.webp", label: "Mobile apps" },
  { icon: "/platform-features/icon-web-interface.webp", label: "Web interface" },
  { icon: "/platform-features/icon-privacy-security.webp", label: "Privacy & security" },
];

/** "Works with your tools" — 5 compatibility badges. */
export default function WorksWithYourTools() {
  return (
    <section className="w-full bg-white px-4 py-12 sm:px-8 sm:py-16 lg:px-[105px] lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-8 lg:gap-12">
        <h2
          className="text-center font-jakarta text-2xl font-extrabold tracking-[-0.36px] sm:text-3xl lg:text-4xl"
          style={{ color: C.ink }}
        >
          Works with your tools
        </h2>
        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:flex lg:flex-wrap lg:justify-center lg:gap-6">
          {TOOLS.map((tool) => (
            <div
              key={tool.label}
              className="flex flex-col items-center gap-4 rounded-[20px] border-2 px-4 py-6 lg:w-[224px]"
              style={{ borderColor: C.line }}
            >
              <Image src={tool.icon} alt="" width={48} height={48} />
              <span className="text-center text-[13px] font-semibold" style={{ color: C.muted }}>
                {tool.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
