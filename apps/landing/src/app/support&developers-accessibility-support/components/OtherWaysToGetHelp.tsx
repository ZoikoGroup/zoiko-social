import Image from "next/image";
import { C } from "./theme";

const ARTICLES = [
  {
    photo: "other-ways-contact-us",
    alt: "Support agent taking a call in an office",
    icon: "icon-chat-card",
    title: "Contact Us",
    body: "Reach the support team directly.",
    cta: "Contact support",
  },
  {
    photo: "other-ways-help-center",
    alt: "Support agent smiling on a call",
    icon: "icon-book-card",
    title: "Help Center",
    body: "Step-by-step guides for every feature.",
    cta: "Visit the Help Center",
  },
  {
    photo: "other-ways-system-status",
    alt: "Support team working together in an office",
    icon: "icon-pulse-card",
    title: "System Status",
    body: "Check whether a problem affects everyone.",
    cta: "Check System Status",
  },
];

/** Section - 09 · OTHER WAYS TO GET HELP — "Other ways to get help", a 3-card grid. */
export default function OtherWaysToGetHelp() {
  return (
    <section className="w-full px-5 py-10 lg:px-[105px] lg:py-20" style={{ backgroundColor: C.panel }}>
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 lg:gap-10">
        <div className="flex flex-col gap-2.5 lg:gap-[11px] lg:max-w-[402px]">
          <h2 className="text-[26px] font-extrabold tracking-[-0.26px] lg:text-4xl lg:tracking-[-0.36px]" style={{ color: C.brandDeep }}>
            Other ways to get help
          </h2>
          <p className="text-base leading-[25.6px] lg:text-[17px] lg:leading-[27.2px]" style={{ color: C.muted }}>
            If the form doesn&apos;t work for you, use another route.
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-6">
          {ARTICLES.map((article) => (
            <article
              key={article.title}
              className="flex flex-1 flex-col overflow-hidden rounded-[20px] border bg-white"
              style={{ borderColor: C.line }}
            >
              <div className="relative h-[170px] w-full">
                <div
                  className="absolute inset-0"
                  style={{ backgroundImage: `linear-gradient(135deg, ${C.brand} 0%, ${C.orange} 100%)` }}
                />
                <Image
                  src={`/support&developers-accessibility-support/${article.photo}-mobile.webp`}
                  alt={article.alt}
                  fill
                  sizes="100vw"
                  className="object-cover lg:hidden"
                />
                <Image
                  src={`/support&developers-accessibility-support/${article.photo}.webp`}
                  alt={article.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, 100vw"
                  className="hidden object-cover lg:block"
                />
                <div
                  className="absolute -bottom-[22px] left-6 flex size-11 items-center justify-center rounded-xl border bg-white shadow-[0px_1px_1px_rgba(7,59,71,0.06)]"
                  style={{ borderColor: C.line }}
                >
                  <Image src={`/support&developers-accessibility-support/${article.icon}.webp`} alt="" width={20} height={20} />
                </div>
              </div>
              <div className="flex flex-col gap-2.5 px-7 pb-[26px] pt-9">
                <h3 className="text-[19px] font-bold tracking-[-0.095px]" style={{ color: C.brandDeep }}>
                  {article.title}
                </h3>
                <p className="min-h-[51px] text-base leading-[25.6px]" style={{ color: C.muted }}>
                  {article.body}
                </p>
                <div className="flex items-center gap-1">
                  <span className="text-[15px] font-semibold" style={{ color: C.brand }}>
                    {article.cta}
                  </span>
                  <Image src="/support&developers-accessibility-support/icon-chevron-right-sm.webp" alt="" width={16} height={16} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
