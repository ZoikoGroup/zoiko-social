import { Plus_Jakarta_Sans } from "next/font/google";

// Optimize font loading in Next.js
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function FAQ() {
  const faqs = [
    {
      question: "What does Popular mean on Zoiko Social?",
      answer:
        "Popular shows communities with the most recent, genuine activity — new members, posts, and conversations — rather than simply the largest communities. It is a snapshot of where people are taking part right now.",
    },
    {
      question: "How often does Popular update?",
      answer:
        "The ranking refreshes regularly throughout the day, so communities can move up or down as activity changes.",
    },
    {
      question: "Does a higher position mean a community is safer or better?",
      answer:
        "No. Position reflects activity only. It is not an endorsement or a safety rating. Check each community's purpose, rules, and moderation information before you join.",
    },
    {
      question: "Can I browse communities another way?",
      answer:
        "Yes. You can browse All Communities, or explore by species, purpose, or category — such as Rescue & Adoption, Training & Behavior, Professional, and Wildlife & Conservation.",
    },
    {
      question: "Can I search within Popular?",
      answer:
        "Yes. Use the search bar and filters to narrow the Popular list by keyword, species, or topic. Results keep their popularity order.",
    },
    {
      question: "Why did the order change?",
      answer:
        "Popular is based on recent activity, so the order shifts as communities become more or less active. A community moving down does not mean anything is wrong with it.",
    },
    {
      question: "Are sponsored communities included in Popular?",
      answer:
        "Popular rankings cannot be bought. Any sponsored or promoted community is clearly labelled and kept separate from the organic ranking.",
    },
    {
      question: "How do I join a community?",
      answer:
        "Create a free account, open the community, and select Join. Public communities let you join straight away; private ones may ask you to request access and wait for a moderator to approve it.",
    },
  ];

  return (
    <section
      className={`w-full max-w-[1232px] pt-4 pb-14 flex flex-col justify-start items-start gap-2.5 ${plusJakartaSans.className}`}
    >
      {/* Header */}
      <div className="w-full pb-2.5 flex flex-col justify-start items-start">
        <h2 className="text-cyan-950 text-2xl font-extrabold leading-9">
          Frequently asked questions
        </h2>
      </div>

      {/* FAQ Items */}
      {faqs.map(({ question, answer }) => (
        <details
          key={question}
          className="w-full bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-cyan-200 hover:bg-slate-50 transition-colors group"
        >
          <summary className="w-full px-4 min-h-14 py-3 flex justify-between items-center text-left cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <span className="text-cyan-900 text-sm font-bold leading-5 pr-4">
              {question}
            </span>
            {/* Plus icon — turns into a cross when open */}
            <span className="text-cyan-700 text-xl font-normal leading-8 shrink-0 group-hover:text-cyan-900 transition-transform group-open:rotate-45">
              +
            </span>
          </summary>

          <p className="px-4 pb-4 text-slate-600 text-sm font-normal leading-6">
            {answer}
          </p>
        </details>
      ))}
    </section>
  );
}
