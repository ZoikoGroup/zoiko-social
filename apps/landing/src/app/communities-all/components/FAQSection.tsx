import React from "react";

export default function FAQSection() {
  const faqs = [
    {
      question: "What is All Communities?",
      answer:
        "All Communities is the complete directory of communities on Zoiko Social. It brings every public community together in one place so you can browse by purpose, species, or interest instead of searching one category at a time.",
    },
    {
      question: "How do I find a community for a specific animal?",
      answer:
        "Use the search bar or the filters to narrow results by species, or open the By Species category to see communities grouped around dogs, cats, birds, horses, reptiles, and more.",
    },
    {
      question: "Can I find rescue and adoption communities?",
      answer:
        "Yes. The Rescue & Adoption category lists communities focused on fostering, rehoming, and adoption coordination. Communities run by verified rescues and shelters are clearly labelled.",
    },
    {
      question: "Are there communities for training and animal behavior?",
      answer:
        "Yes. The Training & Behavior category covers obedience, socialization, behavior challenges, and enrichment, with discussions led by both experienced owners and professional trainers.",
    },
    {
      question: "Are there communities run by professionals?",
      answer:
        "Yes. The Professional category lists communities led by verified veterinarians, trainers, groomers, and other specialists. A verification badge is only shown when the professional's credentials have been confirmed.",
    },
    {
      question: "How can I understand a community before joining?",
      answer:
        "Open any community to review its purpose, rules, moderation information, and recent public activity. You can read public posts before you join, so you can decide whether it is the right fit.",
    },
    {
      question: "What if I cannot find the right community?",
      answer:
        "Try a broader search or a different category. If nothing fits, you can create your own community once you have an account, as long as it follows our Community Standards.",
    },
  ];

  return (
    <section className="w-full max-w-[1232px] mx-auto pt-4 pb-14 flex flex-col justify-start items-start gap-3">
      {/* Header */}
      <div className="w-full pb-2.5 flex flex-col justify-start items-start">
        <h2 className="text-cyan-900 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
          Frequently asked questions
        </h2>
      </div>

      {/* FAQ Accordion List */}
      <div className="w-full flex flex-col gap-2.5">
        {faqs.map(({ question, answer }) => (
          <details
            key={question}
            className="w-full bg-white rounded-2xl border border-gray-200 hover:border-cyan-300 hover:shadow-sm transition-all group"
          >
            <summary className="w-full px-5 py-4 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-100 flex justify-between items-center text-left cursor-pointer list-none [&::-webkit-details-marker]:hidden">
              <span className="text-cyan-900 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5 pr-4">
                {question}
              </span>

              {/* Plus Icon — turns into a cross when open */}
              <span className="text-cyan-600 group-hover:text-cyan-700 text-2xl font-normal font-['Plus_Jakarta_Sans'] leading-none flex-shrink-0 transition-transform group-open:rotate-45">
                +
              </span>
            </summary>

            <p className="px-5 pb-4 -mt-1 text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-6">
              {answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
