import Image from "next/image";
import { C } from "./theme";

const ARTICLES = [
  {
    photo: "help-center-photo",
    alt: "Person typing on a laptop",
    mobilePhoto: "help-center-photo-mobile",
    mobileAlt: "Black and white cat looking at the camera",
    icon: "icon-book",
    title: "Help Center",
    body: "Popular right now:",
    links: ["Reset your password", "Fix photo uploads that fail", "Manage notifications"],
  },
  {
    photo: "system-status-photo",
    alt: "Server room with status lights",
    mobilePhoto: "system-status-photo-mobile",
    mobileAlt: "Dog close-up on a pink background",
    icon: "icon-pulse",
    title: "System Status",
    body: "If something isn't working for anyone, it'll be posted there first, with timestamps.",
    cta: "Check System Status",
  },
];

/** Section - 03 · BEFORE YOU CONTACT — "Quicker answers first", two link-out cards. */
export default function BeforeYouContact() {
  return (
    <section className="w-full bg-white px-5 py-10 lg:px-[105px] lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 lg:gap-10">
        <div className="flex flex-col gap-2.5">
          <h2 className="text-[26px] font-extrabold tracking-[-0.26px] lg:text-4xl lg:tracking-[-0.36px]" style={{ color: C.brandDeep }}>
            Quicker answers first
          </h2>
          <p className="text-base leading-[25.6px] lg:text-[17px] lg:leading-[27.2px]" style={{ color: C.muted }}>
            These often solve it without waiting. You can still contact us anytime.
          </p>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-6">
          {ARTICLES.map((article) => (
            <article
              key={article.title}
              className="flex flex-1 flex-col overflow-hidden rounded-[20px] border bg-white"
              style={{ borderColor: C.line }}
            >
              <div className="relative h-[190px] w-full lg:h-[223px]">
                <div
                  className="absolute inset-0"
                  style={{ backgroundImage: `linear-gradient(130deg, ${C.brand} 0%, ${C.orange} 100%)` }}
                />
                <Image
                  src={`/support&developers-contact-us/${article.mobilePhoto}.webp`}
                  alt={article.mobileAlt}
                  fill
                  sizes="100vw"
                  className="object-cover lg:hidden"
                />
                <Image
                  src={`/support&developers-contact-us/${article.photo}.webp`}
                  alt={article.alt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="hidden object-cover lg:block"
                />
              </div>
              <div className="relative flex flex-col gap-2.5 px-7 pb-6 pt-[26px]">
                <div
                  className="absolute -top-[22px] left-7 flex size-11 items-center justify-center rounded-xl border bg-white shadow-[0px_1px_1px_rgba(7,59,71,0.06)]"
                  style={{ borderColor: C.line }}
                >
                  <Image src={`/support&developers-contact-us/${article.icon}.webp`} alt="" width={20} height={20} />
                </div>
                <h3 className="pt-1 text-[19px] font-bold tracking-[-0.095px]" style={{ color: C.brandDeep }}>
                  {article.title}
                </h3>
                <p className="text-base leading-[25.6px]" style={{ color: C.muted }}>
                  {article.body}
                </p>
                {article.links && (
                  <ul className="flex flex-col gap-1.5 pt-1">
                    {article.links.map((link) => (
                      <li key={link} className="flex items-center gap-2">
                        <Image src="/support&developers-contact-us/icon-chevron-right.webp" alt="" width={15} height={15} />
                        <span className="text-[14.5px] font-semibold" style={{ color: C.brand }}>
                          {link}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
                {article.cta && (
                  <div className="flex items-center gap-1 pt-[38px]">
                    <span className="text-[15px] font-semibold" style={{ color: C.brand }}>
                      {article.cta}
                    </span>
                    <Image src="/support&developers-contact-us/icon-chevron-right.webp" alt="" width={16} height={16} />
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
