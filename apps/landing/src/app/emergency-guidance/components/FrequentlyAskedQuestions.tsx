"use client";
import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    question: "What if I'm not sure if it's a real emergency?",
    answer:
      "When in doubt, call. It's better to call 911 and it turn out to be a false alarm than to miss a real emergency. Emergency responders are trained to handle this. You won't get in trouble for calling.",
  },
  {
    question: "What if I don't know the person's location?",
    answer:
      "Tell the operator what you do know: what city they mentioned, what community they're in, any geographic details. Even partial information helps. If they're on Zoiko, tell the operator they posted on a social platform—there's usually a way to trace posts.",
  },
  {
    question: "Should I tell the person I'm reporting them?",
    answer:
      "If they're in immediate danger, report first, tell them after (if at all). If it's an emotional crisis, you might say, \"I care about you and I'm going to send you some resources.\" Honesty matters, but safety comes first.",
  },
  {
    question: 'What if the person says "don\'t call 911"?',
    answer:
      "Call anyway. People in crisis often don't want help—it's the illness/crisis talking, not their true self. You calling 911 might literally save their life. They might be angry at first. That's okay. They'll probably thank you later.",
  },
  {
    question: "Will Zoiko share their identity if I report?",
    answer:
      "For immediate emergencies (life-threatening situations, child safety), Zoiko will work with law enforcement to provide necessary information to save lives. We comply with emergency subpoenas. Your privacy is important, but lives come first.",
  },
  {
    question: "What if I'm the one in crisis?",
    answer:
      "You deserve help. Call 988 (Suicide & Crisis Lifeline), text 741741 (Crisis Text Line), or call 911 if you're in immediate danger. Tell someone you trust what you're experiencing. There's no shame in crisis—it's a moment in your life, not your whole life.",
  },
  {
    question: "Can I use Zoiko's emergency report button?",
    answer:
      'Yes. Every post and comment has a "Report" option. For emergencies, use it immediately, but also call 911. Zoiko reports go to our safety team, but emergency services are faster.',
  },
  {
    question: "What happens after I report someone?",
    answer:
      "Zoiko's safety team will review your report within minutes. If confirmed as an emergency, we alert law enforcement and work with them. You'll see your case number. Updates are confidential due to privacy laws, but you can check status in your safety dashboard.",
  },
  {
    question:
      "I'm worried about someone but they haven't said scary yet. What do I do?",
    answer:
      'Reach out to them directly if you feel safe doing so. "Hey, I noticed you\'ve been quiet lately. Everything okay?" Often, people in crisis are relieved someone noticed. Encourage them to talk to someone—you, a counselor, a hotline. Be specific with resources.',
  },
  {
    question: "What if I called for help and now feel guilty?",
    answer:
      "You did the right thing. You saved a life. You showed them someone cares. Any anger or guilt they felt is part of the crisis—not your fault. They'll likely be grateful after. You're a hero.",
  },
];

export default function FrequentlyAskedQuestions() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F9FA] py-16 px-4 md:px-8 font-sans text-[#1a2d37]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Heading */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2d37] tracking-tight">
            Frequently asked questions
          </h1>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl border border-[#DCE5E8] shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-6 md:p-8 flex items-center text-left space-x-4 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[#066879] flex-shrink-0">
                    {isOpen ? (
                      <Minus className="w-4 h-4 stroke-[3]" />
                    ) : (
                      <Plus className="w-4 h-4 stroke-[3]" />
                    )}
                  </div>
                  <span className="text-base md:text-lg font-bold text-[#066879]">
                    {faq.question}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 md:px-8 md:pb-8 pt-0 text-xs md:text-sm text-[#5a6e75] leading-relaxed border-t border-gray-100 mt-2">
                    <p className="pt-4">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
