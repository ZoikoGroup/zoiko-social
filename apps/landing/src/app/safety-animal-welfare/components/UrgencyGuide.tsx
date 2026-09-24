import Section from "./Section";
import { REPORT_URL } from "./content";
import { C } from "./theme";

const LEVELS = [
  {
    icon: "🚨",
    title: "Immediate danger",
    body: "Animal is being actively harmed, in severe distress, or in life-threatening condition.",
    action: "Contact emergency services or animal control immediately",
    // Zoiko can't dial local services, so this points at where to find them.
    href: "#resources",
    color: C.danger,
    fill: C.dangerFill,
  },
  {
    icon: "⚠️",
    title: "Suspected welfare concern",
    body: "Signs of neglect, mistreatment, or conditions that need investigation but not immediately life-threatening.",
    action: "Report through Zoiko for specialist review",
    href: REPORT_URL,
    color: C.warm,
    fill: C.warmFill,
  },
];

export default function UrgencyGuide() {
  return (
    <Section
      title="Is there immediate danger?"
      intro="Understanding the urgency of a situation helps us respond appropriately. Choose the option that best describes what you’ve observed."
    >
      <div className="grid gap-4 py-2 sm:gap-8 sm:py-6 md:grid-cols-2">
        {LEVELS.map((l) => (
          <div
            key={l.title}
            className="flex flex-col gap-3 rounded-[20px] px-6 pb-8 pt-6 sm:px-8 sm:pb-12 sm:pt-8"
            style={{ background: l.fill, borderLeft: `4px solid ${l.color}` }}
          >
            <span className="text-3xl sm:text-4xl" aria-hidden>
              {l.icon}
            </span>
            <h3 className="text-base font-bold" style={{ color: l.color }}>
              {l.title}
            </h3>
            <p className="text-base leading-6" style={{ color: C.muted }}>
              {l.body}
            </p>
            <a href={l.href} className="pt-1 text-xs font-semibold leading-5 underline underline-offset-2" style={{ color: l.color }}>
              {l.action}
            </a>
          </div>
        ))}
      </div>
      <p
        role="note"
        className="rounded-[20px] p-5 text-sm leading-6 sm:p-8"
        style={{ background: C.noteFill, border: `2px solid ${C.warm}`, color: C.muted }}
      >
        <strong>Important:</strong> Moderator review is not a substitute for emergency services. If an animal is in
        immediate danger, contact your local emergency services, animal control, or animal welfare authority
        immediately.
      </p>
    </Section>
  );
}
