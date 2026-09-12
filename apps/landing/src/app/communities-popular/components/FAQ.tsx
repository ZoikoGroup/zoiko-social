import { Plus_Jakarta_Sans } from "next/font/google";

// Optimize font loading in Next.js
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function FAQ() {
  const faqs = [
    "What does Popular mean on Zoiko Social?",
    "How often does Popular update?",
    "Does a higher position mean a community is safer or better?",
    "Can I browse communities another way?",
    "Can I search within Popular?",
    "Why did the order change?",
    "Are sponsored communities included in Popular?",
    "How do I join a community?",
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
      {faqs.map((question, index) => (
        <button
          key={index}
          className="w-full px-4 h-14 bg-white rounded-2xl outline outline-1 outline-offset-[-1px] outline-cyan-200 hover:bg-slate-50 transition-colors flex justify-between items-center text-left cursor-pointer group"
        >
          <span className="text-cyan-900 text-sm font-bold leading-5 pr-4">
            {question}
          </span>
          <span className="text-cyan-700 text-xl font-normal leading-8 shrink-0 group-hover:text-cyan-900 transition-colors">
            +
          </span>
        </button>
      ))}
    </section>
  );
}
