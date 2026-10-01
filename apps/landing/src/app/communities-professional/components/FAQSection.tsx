import React from "react";

const FAQS = [
  {
    question: "What does “Professional” mean on Zoiko Social?",
    answer:
      "Professional communities are run by, or closely associated with, animal professionals such as veterinarians, trainers, groomers, and shelters. The label describes who operates the community, based on information approved for display on Zoiko Social.",
  },
  {
    question:
      "Does a “Vet” or “Trainer” label mean Zoiko Social verified their credentials?",
    answer:
      "Not on its own. A role label describes the operator's stated context. Only communities showing a Verified badge have had credentials confirmed by our team. Either way, a label is not an endorsement of advice and does not create a professional-client relationship.",
  },
  {
    question: "Can I get emergency veterinary help through these communities?",
    answer:
      "No. Communities are for discussion and general guidance, not emergency care. If your animal is in danger, contact your local vet or emergency animal hospital straight away.",
  },
  {
    question:
      "How is Professional different from Rescue & Adoption or Training & Behavior?",
    answer:
      "Professional groups communities by who runs them. Rescue & Adoption and Training & Behavior group communities by topic. A trainer-led community can appear in both Professional and Training & Behavior.",
  },
  {
    question: "How do I join a professional-led community?",
    answer:
      "Create a free account, open the community, and select Join. Some professional communities are open to everyone; others may ask you to request access or answer a few questions before a moderator approves you.",
  },
  {
    question: "What if a community’s professional identity looks misleading?",
    answer:
      "Report it from the community page or through Report a Concern. Our team reviews reports against our Community Standards and can remove labels or take action against communities that misrepresent themselves.",
  },
];

export default function FAQSection() {
  return (
    <div className="w-full max-w-[1232px] pt-4 flex flex-col gap-3.5">
      {/* Title */}
      <div className="h-9 text-cyan-950 text-2xl font-extrabold font-['Plus_Jakarta_Sans'] leading-9">
        Frequently asked questions
      </div>

      {FAQS.map(({ question, answer }) => (
        <details
          key={question}
          className="w-full bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-zinc-200 group"
        >
          <summary className="min-h-16 px-[19px] py-3 flex items-center justify-between gap-4 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            <span className="text-teal-950 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5">
              {question}
            </span>
            {/* Plus icon — turns into a cross when open */}
            <span className="text-cyan-800 text-xl font-normal font-['Plus_Jakarta_Sans'] leading-8 shrink-0 transition-transform group-open:rotate-45">
              +
            </span>
          </summary>

          <p className="px-[19px] pb-4 text-slate-600 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-6">
            {answer}
          </p>
        </details>
      ))}
    </div>
  );
}
