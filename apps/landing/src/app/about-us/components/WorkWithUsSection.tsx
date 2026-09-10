import Image from "next/image";
import Link from "next/link";
import { Users, Flag, Send, type LucideIcon } from "lucide-react";
import { APP_LINKS, appUrl } from "@/lib/app-links";
import { IMAGES } from "./images";
import { C } from "./theme";
import { Eyebrow } from "./primitives";

const ROUTES: {
  icon: LucideIcon;
  tone: "neutral" | "warm";
  title: string;
  body: string;
  href: string;
}[] = [
  {
    icon: Users,
    tone: "neutral",
    title: "Careers",
    body: "View open roles and life at Zoiko Social.",
    href: appUrl("/careers"),
  },
  {
    icon: Flag,
    tone: "warm",
    title: "Press & Media",
    body: "Media inquiries and brand assets.",
    href: appUrl("/press"),
  },
  {
    icon: Send,
    tone: "neutral",
    title: "Contact",
    body: "Reach our team for general or business inquiries.",
    href: APP_LINKS.docs,
  },
];

/** "Approved ways to connect" — three routes in, beside the workspace photo. */
export default function WorkWithUsSection() {
  return (
    <section className="mx-auto max-w-[1280px] px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
      <div className="flex flex-col items-center gap-10 lg:flex-row lg:gap-16">
        <div className="w-full flex-1">
          <Eyebrow>Work with us</Eyebrow>

          <h2
            className="mt-4 text-2xl font-extrabold leading-tight lg:text-3xl lg:leading-10"
            style={{ color: C.ink }}
          >
            Approved ways to connect
          </h2>

          <p className="mt-4 text-base leading-6" style={{ color: C.muted }}>
            Whether you&apos;re looking to join the team, cover a story, or get
            in touch — here&apos;s where to go.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            {ROUTES.map(({ icon: Icon, tone, title, body, href }) => (
              <Link
                key={title}
                href={href}
                className="flex items-center gap-4 rounded-2xl p-4 transition hover:bg-white"
                style={{ background: C.page, border: `1px solid ${C.line}` }}
              >
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-[10px]"
                  style={{ background: tone === "warm" ? C.chipWarm : C.chip }}
                >
                  <Icon
                    size={16}
                    strokeWidth={1.9}
                    style={{ color: tone === "warm" ? C.warm : C.ink }}
                  />
                </span>
                <span className="flex-1">
                  <span
                    className="block text-base font-bold leading-6"
                    style={{ color: C.inkDeep }}
                  >
                    {title}
                  </span>
                  <span
                    className="block text-sm leading-5"
                    style={{ color: C.muted }}
                  >
                    {body}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>

        <div
          className="w-full flex-1 overflow-hidden rounded-3xl bg-white shadow-[0_8px_24px_rgba(7,59,71,0.10)]"
          style={{ border: `1px solid ${C.line}` }}
        >
          <div className="relative aspect-[583/378]">
            <Image
              src={IMAGES.workspace}
              alt="A laptop open on a desk beside a mug and fairy lights"
              fill
              sizes="(max-width: 1024px) 100vw, 583px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
