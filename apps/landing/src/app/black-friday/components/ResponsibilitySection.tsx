import Link from "next/link";
import { CircleCheck, Send, Shield, TriangleAlert, type LucideIcon } from "lucide-react";
import SaleSticker from "./SaleSticker";

const STANDARDS: { title: string; body: string; Icon: LucideIcon }[] = [
  { title: "Respect animals first", body: "Content that encourages harm, illegal trade or cruelty is not allowed.", Icon: CircleCheck },
  { title: "Sensitive locations protected", body: "Sensitive wildlife locations can be withheld to reduce real-world risk.", Icon: Shield },
  { title: "Report & moderation", body: "Report concerns on any community; moderation is separate from community names.", Icon: Send },
  { title: "Not an emergency service", body: "For an injured or distressed animal, contact a local authority or vet.", Icon: TriangleAlert },
];

const REPORT_REASONS = [
  "Animal harm or cruelty",
  "Illegal wildlife trade",
  "Sensitive-location exposure",
  "Dangerous interaction",
  "Impersonation / misrepresentation",
  "Misinformation",
];

export default function ResponsibilitySection() {
  return (
    <section className="mx-auto max-w-[1232px] px-4 py-10 sm:px-6 lg:px-8">
      <div className="relative rounded-3xl bg-gradient-to-br from-[#0A4F5E] via-[#0B6475] to-[#1A8A6A] p-8 md:p-12">
        <SaleSticker className="-right-6 -top-4" />

        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Belonging comes with responsibility.</h2>
        <p className="mt-3 max-w-[560px] leading-relaxed text-white/80">
          Community discussion is not official authority. These standards apply across every
          community — and reporting tools are always available.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {STANDARDS.map(({ title, body, Icon }) => (
            <div key={title} className="flex gap-4 rounded-xl bg-[#0A3F4A]/70 p-5">
              <Icon className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" aria-hidden />
              <div>
                <h3 className="font-bold text-white">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-white/70">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <ul className="mt-6 flex flex-wrap gap-2">
          {REPORT_REASONS.map((r) => (
            <li key={r}>
              <Link
                href="/safety-report-concern"
                className="inline-block rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs text-white/80 hover:bg-white/15"
              >
                {r}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
