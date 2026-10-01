import React from "react";

const FAQS = [
  {
    question: "What are Wildlife & Conservation communities?",
    answer:
      "They are communities for people who follow, support, or take part in wildlife and conservation work — from habitat restoration and species monitoring to wildlife photography and citizen science.",
  },
  {
    question: "Are these communities official conservation organizations?",
    answer:
      "Not necessarily. Some are run by conservation organizations, but many are run by enthusiasts and volunteers. A verification badge is only shown when an organization's identity has been confirmed.",
  },
  {
    question: "Can I find communities by species?",
    answer:
      "Yes. Use the species filter or search, or browse By Species to find communities focused on birds, marine life, big cats, primates, and more.",
  },
  {
    question: "Can I find conservation work near me?",
    answer:
      "Yes. Use the region filter to find communities and projects in your area. Locations are shown at an approximate level only, to protect sensitive wildlife sites.",
  },
  {
    question: "Can I report harmful or illegal wildlife content?",
    answer:
      "Yes. Report content involving wildlife trafficking, poaching, cruelty, or the sale of protected species through Report a Concern or from the post itself. Our team reviews reports and can involve the relevant authorities where appropriate.",
  },
  {
    question: "Is this an emergency wildlife rescue service?",
    answer:
      "No. If you find an injured or distressed wild animal, contact a local wildlife rescue centre, wildlife hospital, or emergency vet straight away. Communities cannot guarantee a response.",
  },
  {
    question: "Can wildlife be adopted through this page?",
    answer:
      "No. This page never facilitates buying, selling, trading, or adopting wild animals. Some conservation groups offer symbolic adoption programs that fund their work, but no animal is transferred.",
  },
  {
    question: "How does Zoiko Social protect sensitive wildlife locations?",
    answer:
      "We never show precise locations for sensitive sites such as nests, dens, or habitats of endangered species. Location information is approximate, and posts that reveal sensitive locations can be reported and removed.",
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
