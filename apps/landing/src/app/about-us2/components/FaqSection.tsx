import { Plus } from "lucide-react";
import { C } from "./theme";
import { Band, SectionHeading } from "./primitives";

/*
  Answers are drawn from the copy elsewhere on this page. The comp only shows
  the collapsed state, so the wording here is ours to keep in step with the
  sections above it.
*/
const FAQS = [
  {
    q: "What is Zoiko Social?",
    a: "Zoiko Social is a global social platform built for animal communities, welfare, and verified news. It brings communities, animal welfare reporting, and adoption support together in one governed place, so individuals, professionals, and organizations can connect around animal life rather than compete for attention in a general-purpose feed.",
  },
  {
    q: "How does Zoiko Social approach safety and privacy?",
    a: "Moderation is institutional-grade and built in from day one, not added after the fact. Automated and human review keep spaces profanity-free, enforcement follows a clear published process that can be appealed, and you control what you share — protected in line with our published privacy policy.",
  },
  {
    q: "Where is Zoiko Social based?",
    a: "We operate from two hubs: our headquarters in Sacramento, California, and our European headquarters in London, United Kingdom. Both support a community that spans the globe.",
  },
  {
    q: "How can I work with or contact Zoiko Social?",
    a: "There are three approved routes: Careers for open roles, Press & Media for story inquiries and brand assets, and Contact for general or business questions. Each is linked in the “Approved ways to connect” section above.",
  },
];

/**
 * "Common questions".
 *
 * Built on <details>/<summary> so the accordion works without JavaScript and
 * without making the page a client component. The plus sign rotates 45° into
 * a close icon when its own <details> is open.
 */
export default function FaqSection() {
  return (
    <Band>
      <SectionHeading title="Common questions" />

      <div className="mx-auto mt-12 flex max-w-[760px] flex-col gap-4">
        {FAQS.map(({ q, a }) => (
          <details
            key={q}
            className="group overflow-hidden rounded-2xl bg-white"
            style={{ border: `1px solid ${C.line}` }}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 [&::-webkit-details-marker]:hidden">
              <span
                className="text-base font-bold leading-6"
                style={{ color: C.inkDeep }}
              >
                {q}
              </span>
              <span
                className="flex size-7 shrink-0 items-center justify-center rounded-lg transition-transform group-open:rotate-45"
                style={{ background: C.chip }}
              >
                <Plus size={14} strokeWidth={2.2} style={{ color: C.ink }} />
              </span>
            </summary>
            <p
              className="px-6 pb-5 text-sm leading-6"
              style={{ color: C.muted }}
            >
              {a}
            </p>
          </details>
        ))}
      </div>
    </Band>
  );
}
