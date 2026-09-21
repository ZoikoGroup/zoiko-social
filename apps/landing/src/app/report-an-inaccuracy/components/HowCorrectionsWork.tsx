import Image from "next/image";

export default function HowCorrectionsWork() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-24 pb-16">
      <h2 className="text-[#073B47] text-3xl font-extrabold text-center mb-12">How corrections work</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            step: 1,
            title: "Submit",
            desc: "Identify the story, the issue, and what you believe is wrong.",
            img: "typing-notes-7fac45.png"
          },
          {
            step: 2,
            title: "Review",
            desc: "Our editorial team checks the claim against the original source and evidence.",
            img: "editorial-team-61700d.png"
          },
          {
            step: 3,
            title: "Outcome",
            desc: "We correct, clarify, or explain why no change was made — never a public debate.",
            img: "hand-marking-61700d.png"
          },
          {
            step: 4,
            title: "Propagation",
            desc: "Material corrections carry through to summaries and derivatives that repeated the claim.",
            img: "network-7fac45.png"
          }
        ].map((item) => (
          <div key={item.step} className="bg-white rounded-[20px] p-4 border border-[#E5E7EB]">
            <div className="relative h-32 rounded-xl overflow-hidden mb-5">
              <Image 
                src={`/report-an-inaccuracy/${item.img}`} 
                alt={item.title} 
                fill 
                className="object-cover"
              />
              <div className="absolute top-2 left-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-[#073B47] shadow-sm">
                {item.step}
              </div>
            </div>
            <h4 className="font-bold text-[#102A32] text-[13.5px] mb-1 px-1">{item.title}</h4>
            <p className="text-[#5E7076] text-xs leading-relaxed px-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
