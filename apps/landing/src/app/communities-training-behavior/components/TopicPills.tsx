import React from "react";

const TOPICS = [
  "All topics",
  "Puppy Training",
  "Leash Reactivity",
  "Separation Anxiety",
  "Enrichment",
  "Positive Reinforcement",
  "Socialization",
  "Resource Guarding",
];

export default function TopicPills() {
  return (
    <div className="w-full flex flex-wrap gap-2.5">
      {TOPICS.map((topic, idx) => (
        <div
          key={topic}
          className={`shrink-0 h-[37.5px] px-4 rounded-full flex items-center justify-center cursor-pointer whitespace-nowrap ${
            idx === 0
              ? "bg-cyan-800 outline outline-1 outline-offset-[-1px] outline-cyan-800"
              : "bg-white outline outline-1 outline-offset-[-1px] outline-zinc-200 hover:bg-zinc-50"
          }`}
        >
          <span
            className={`text-[13px] font-semibold font-['Plus_Jakarta_Sans'] ${
              idx === 0 ? "text-white" : "text-gray-500"
            }`}
          >
            {topic}
          </span>
        </div>
      ))}
    </div>
  );
}
