import React from "react";

interface DecisionStep {
  question: string;
  examples: string;
  actionText: string;
}

const decisionSteps: DecisionStep[] = [
  {
    question: "Is someone in immediate physical danger right now?",
    examples:
      "Active violence, overdose, can't breathe, choking, unconscious, severe injury",
    actionText: "CALL 911 (Immediately. Don't wait. This is #1 priority.)",
  },
  {
    question:
      "Is someone expressing suicidal intent or active self-harm right now?",
    examples:
      'Examples: "I\'m going to kill myself tonight", showing fresh cuts, describing a specific plan',
    actionText:
      "CALL 988 (US Suicide & Crisis Lifeline) or text HOME to 741741 (Crisis Text Line).",
  },
  {
    question: "Is a child being exploited, abused, or endangered?",
    examples: "CSAM, child abuse, trafficking, predatory behavior",
    actionText: "REPORT to CyberTipline.org AND your local law enforcement.",
  },
  {
    question:
      "Is someone being harassed, stalked, or in danger from intimate partner violence?",
    examples:
      "Threats, coordinated harassment, doxxing, stalking, domestic violence",
    actionText:
      "REPORT to Zoiko. Get them safety resources. Call local hotline if needed.",
  },
  {
    question: "Is someone showing signs of crisis but not immediate danger?",
    examples:
      "Expressing depression, isolation, hopelessness, gradual withdrawal",
    actionText:
      "REACH OUT to them. Encourage professional help. Send resources.",
  },
];

export default function QuickDecisionGuide() {
  return (
    <div className="w-full min-h-screen bg-[#F7F9FA] py-16 px-4 md:px-8 font-sans text-[#1a2d37]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Heading & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2d37] tracking-tight">
            What should you do? Quick decision guide
          </h1>
          <p className="text-[#5a6e75] text-sm md:text-base">
            Follow this flow to know exactly what to do in an emergency.
          </p>
        </div>

        {/* Outer Container Card */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-[#DCE5E8] space-y-6">
          {decisionSteps.map((item, index) => (
            <div
              key={index}
              className="bg-[#F7F9FA] rounded-2xl p-6 border border-[#DCE5E8] border-l-4 border-l-[#066879] space-y-2"
            >
              <h2 className="text-sm md:text-base font-bold text-[#1a2d37]">
                {item.question}
              </h2>
              <p className="text-xs text-[#5a6e75]">
                <span className="font-medium text-[#1a2d37]">Examples:</span>{" "}
                {item.examples.replace(/^Examples:\s*/, "")}
              </p>
              <div className="pt-2">
                <a
                  href="#"
                  className="text-xs md:text-sm font-bold text-[#066879] hover:underline inline-block"
                >
                  {item.actionText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
