import Image from "next/image";
import { C } from "./theme";

/** The two lists from the design. */
const CONCERNS: readonly { title: string; items: readonly string[] }[] = [
  {
    title: "Content Concerns",
    items: [
      "Harmful or dangerous content",
      "Misinformation or false claims",
      "Copyright or IP violations",
      "Spam or bot activity",
    ],
  },
  {
    title: "User Behavior Concerns",
    items: [
      "Harassment or abuse",
      "Suspicious account activity",
      "Community guideline violations",
      "Inappropriate or offensive behavior",
    ],
  },
];

export default function WhatCanYouReport() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1280px] px-4 py-20 sm:px-6">
        <div className="flex flex-col gap-12">
          <h2 className="text-3xl font-extrabold leading-10" style={{ color: C.ink }}>
            What can you report?
          </h2>

          <div className="flex flex-col gap-12 lg:flex-row lg:items-center">
            {/* Photo with caption bar */}
            <div className="flex w-full flex-1 flex-col items-center overflow-hidden rounded-3xl lg:w-[612px]">
              <div className="relative h-[546px] w-full">
                <Image
                  src="/safety-report-concern/ii.png"
                  alt="Hands holding a phone reviewing a report form"
                  fill
                  sizes="(min-width: 1024px) 612px, 100vw"
                  className="object-cover"
                />
              </div>
              <div
                className="flex w-full items-center rounded-bl-3xl rounded-br-3xl border-b border-l border-r p-4"
                style={{ background: C.brand, borderColor: C.line }}
              >
                <p className="text-xs font-semibold text-white">
                  Report concerns about posts, comments, user behavior, or
                  community violations
                </p>
              </div>
            </div>

            {/* Concern lists */}
            <div className="flex flex-1 flex-col gap-8">
              {CONCERNS.map((group) => (
                <div
                  key={group.title}
                  className="flex flex-col justify-between rounded-[20px] px-8 py-7 w-full lg:w-[591px] lg:h-[219px]"
                  style={{ background: C.white, border: `1px solid ${C.line}` }}
                >
                  <h3 className="text-base font-bold" style={{ color: C.brand }}>
                    {group.title}
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {group.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-base font-normal"
                        style={{ color: C.ink }}
                      >
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ background: C.ink }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}