import React from "react";

const FAQS = [
  {
    question: "What are Rescue & Adoption communities?",
    answer:
      "They are communities where fosterers, rescuers, shelters, and adopters connect, share updates, and coordinate support. They are spaces for discussion and coordination, not official rescue services.",
  },
  {
    question: "How is this different from the Adopt destination?",
    answer:
      "Adopt is where you browse animals listed for adoption by rescues and shelters. Rescue & Adoption communities are for conversation, advice, and coordination around fostering, rescue, and adoption — they are not an animal listing directory.",
  },
  {
    question: "Can I get emergency help for an animal here?",
    answer:
      "No. Communities cannot guarantee a response. If an animal or person is in immediate danger, contact your local emergency services, animal-welfare organisation, or an emergency vet straight away.",
  },
  {
    question: "What do Fostering, Rescue, and Adoption Support mean?",
    answer:
      "Fostering communities support people caring for animals temporarily. Rescue communities focus on finding and helping animals in need. Adoption Support communities help people before, during, and after adopting an animal.",
  },
  {
    question: "How do I join a community?",
    answer:
      "Create a free account, open the community, and select Join. Some communities ask you to request access or answer a few questions before a moderator approves you.",
  },
  {
    question: "What if I see a scam, unsafe transfer, or misleading rescue claim?",
    answer:
      "Do not send money or hand over an animal. Report it through Report a Concern or from the community page. Our team reviews reports against our Community Standards and animal-welfare policies, and can remove content or communities that put animals or people at risk.",
  },
];

export default function FAQSection() {
  return (
    <div className="w-full flex flex-col gap-2.5">
      <div className="text-cyan-950 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9 pb-2">
        Frequently asked questions
      </div>

      {FAQS.map(({ question, answer }) => (
        <details
          key={question}
          className="w-full bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-200 hover:bg-zinc-50 transition-colors group"
        >
          <summary className="px-5 py-4 min-h-16 flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <span className="text-teal-950 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5">
              {question}
            </span>
            {/* Plus icon — turns into a cross when open */}
            <span className="text-cyan-800 text-xl font-normal font-['Plus_Jakarta_Sans'] leading-8 shrink-0 transition-transform group-open:rotate-45">
              +
            </span>
          </summary>

          <p className="px-5 pb-4 text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-6">
            {answer}
          </p>
        </details>
      ))}
    </div>
  );
}
