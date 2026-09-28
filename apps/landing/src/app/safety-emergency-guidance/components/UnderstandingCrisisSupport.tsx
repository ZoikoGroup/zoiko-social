import React from "react";
import { Check } from "lucide-react";

const callOrTextItems: string[] = [
  "A trained counselor answers (usually within minutes)",
  "They listen without judgment—no lectures, no calls to police unless you're in immediate danger",
  "You can share as much or as little as you want",
  "It's confidential (except in immediate safety situations)",
  "You won't be \"forced\" to do anything—it's your choice",
  "The conversation is free, always",
];

const conversationItems: string[] = [
  "They'll ask what's happening and listen to your story",
  "They might ask clarifying questions to understand better",
  "They'll help you identify immediate safety concerns",
  "They may suggest coping strategies or resources",
  "They'll help connect you to longer-term help if needed",
  "You can call back anytime, 24/7—there's no limit",
];

const commonConcerns: string[] = [
  '"Will they call the police?" (Only if you\'re in immediate danger)',
  '"Will they judge me?" (No—they\'ve heard everything)',
  '"Will they try to force me into a hospital?" (No—it\'s your choice)',
  '"Am I taking resources from someone in worse shape?" (No—there are unlimited resources; your pain matters)',
  '"What if I break down on the call?" (That\'s okay and normal—they help with that)',
];

export default function UnderstandingCrisisSupport() {
  return (
    <div className="w-full min-h-screen bg-[#F7F9FA] py-16 px-4 md:px-8 font-sans text-[#1a2d37]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Section Heading & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2d37] tracking-tight">
            Understanding crisis support: What to expect
          </h1>
          <p className="text-[#5a6e75] text-sm md:text-base">
            If you&apos;re calling a hotline for the first time, here&apos;s
            what you can expect from the process.
          </p>
        </div>

        {/* Top Two Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: When you call or text */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#DCE5E8] flex flex-col justify-between space-y-6">
            <h2 className="text-lg font-bold text-[#066879]">
              When you call or text
            </h2>
            <ul className="space-y-4">
              {callOrTextItems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start space-x-3 text-xs md:text-sm text-[#5a6e75]"
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[#28A745] flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 2: What happens in the conversation */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#DCE5E8] flex flex-col justify-between space-y-6">
            <h2 className="text-lg font-bold text-[#066879]">
              What happens in the conversation
            </h2>
            <ul className="space-y-4">
              {conversationItems.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start space-x-3 text-xs md:text-sm text-[#5a6e75]"
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-[#28A745] flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Card: Worried about calling? */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#DCE5E8] space-y-4">
          <h2 className="text-lg font-bold text-[#066879]">
            Worried about calling?
          </h2>
          <div className="text-xs font-semibold text-[#1a2d37] uppercase tracking-wider">
            Common concerns:
          </div>
          <ul className="list-disc list-inside space-y-2 text-xs md:text-sm text-[#5a6e75] pl-1">
            {commonConcerns.map((concern, index) => (
              <li key={index} className="leading-relaxed">
                <span>{concern}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
