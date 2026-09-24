import Image from "next/image";
import Section from "./Section";
import { IMG, REPORT_URL } from "./content";
import { C } from "./theme";

const RESOURCES = [
  {
    icon: "icon-report.webp",
    title: "Report on Zoiko",
    body: "Use our dedicated animal welfare reporting tool to submit concerns with detailed context.",
    action: "Start Report",
    href: REPORT_URL,
    primary: true,
  },
  {
    icon: "icon-emergency.webp",
    title: "Emergency Services",
    body: "Contact animal control or local emergency services for immediate danger situations.",
    action: "Find Local Services",
    href: "/market-emergency-vet-care",
  },
  {
    icon: "icon-rescue.webp",
    title: "Rescue & Advocacy",
    body: "Connect with established animal welfare organizations in your region.",
    action: "View Directory",
    href: "/adopt-near-you",
  },
];

export default function Resources() {
  return (
    <Section id="resources" title="Resources and support">
      <div className="grid gap-4 pt-2 sm:gap-6 sm:pt-6 md:grid-cols-3">
        {RESOURCES.map((r) => (
          <div
            key={r.title}
            className="flex flex-col items-center gap-4 rounded-[20px] bg-white p-6 text-center sm:p-8"
            style={{ border: `1px solid ${C.line}` }}
          >
            <Image src={`${IMG}${r.icon}`} alt="" width={36} height={36} className="size-9" />
            <h3 className="text-base font-bold" style={{ color: C.brand }}>
              {r.title}
            </h3>
            <p className="max-w-[320px] text-sm leading-6" style={{ color: C.muted }}>
              {r.body}
            </p>
            <a
              href={r.href}
              className="mt-auto w-full rounded-xl px-5 py-3 text-sm font-bold transition hover:opacity-90"
              style={
                r.primary
                  ? { background: C.warm, color: "#fff" }
                  : { background: "#fff", color: C.ink, border: `1px solid ${C.line}` }
              }
            >
              {r.action}
            </a>
          </div>
        ))}
      </div>
    </Section>
  );
}
