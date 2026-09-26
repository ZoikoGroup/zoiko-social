import { Plus, ChevronDown } from "lucide-react";

export default function FAQ() {
  const faqs = [
    "What is Zoiko Social?",
    "Who operates Zoiko Social?",
    "Where is Zoiko Social headquartered?",
    "How do I request a press release or spokesperson?",
    "Where can I find official logos and screenshots?",
    "How quickly will I receive a response?",
    "How do I verify official Zoiko Social information?",
  ];

  return (
    <section className="bg-white md:bg-[#f7f9fa] w-full">
      {/* === DESKTOP LAYOUT === */}
      <div className="hidden md:flex mx-auto flex-col gap-10 px-6 xl:px-20 py-[80px] max-w-[1440px]">
        {/* Header */}
        <h2 className="text-[#102a32] text-[36px] font-bold font-jakarta leading-tight tracking-[-0.36px] text-center">
          Frequently asked questions
        </h2>

        {/* Accordion List */}
        <div className="flex flex-col gap-4 w-full max-w-[760px] mx-auto">
          {faqs.map((question, idx) => (
            <div 
              key={idx}
              className="bg-white border border-[#dce5e8] rounded-[16px] px-6 py-[22px] flex justify-between items-center cursor-pointer transition-shadow hover:shadow-sm"
            >
              <h3 className="text-[#102a32] text-[15px] font-bold font-jakarta pr-4">
                {question}
              </h3>
              <div className="bg-[#eef8f9] text-[#066879] rounded-[8px] w-7 h-7 flex items-center justify-center shrink-0">
                <Plus size={16} strokeWidth={2.5} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* === MOBILE LAYOUT === */}
      <div className="flex md:hidden flex-col items-start px-[24px] pt-[47px] pb-[64px]">
        {/* Header */}
        <div className="flex flex-col pb-[24px]">
          <h2 className="text-[#102a32] text-[28px] font-extrabold font-jakarta leading-[33.6px] tracking-[-0.28px]">
            Frequently asked<br/>questions
          </h2>
        </div>

        {/* Accordion List */}
        <div className="flex flex-col gap-[16px] w-full">
          {faqs.map((question, idx) => (
            <div 
              key={idx}
              className="bg-white border border-[#dce5e8] rounded-[20px] p-[24px] flex justify-between items-center cursor-pointer"
            >
              <h3 className="text-[#102a32] text-[16px] font-bold font-jakarta pr-4 leading-normal">
                {question}
              </h3>
              <div className="text-[#066879] shrink-0">
                <ChevronDown size={20} strokeWidth={2} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
