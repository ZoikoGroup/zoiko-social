import React from "react";

export default function DiscoveryPathways() {
  const cards = [
    {
      title: "Animals for Adoption",
      description: "Browse animals currently presented as ready for adoption through verified rescue and shelter listings.",
      link: "View Animals for Adoption",
    },
    {
      title: "Animals Needing Foster",
      description: "Surface short- and long-term foster needs, kept clearly separate from adoption listings.",
      link: "View Foster Needs",
    },
    {
      title: "Recently Listed",
      description: "See newly available listings, sorted by when they were added.",
      link: "See Recently Listed",
    },
    {
      title: "Near You",
      description: "Prioritize listings near your set region or consented device location.",
      link: "Find Animals Near Me",
    }
  ];

  return (
    <div className="w-full flex flex-col gap-6 pt-2">
      <div className="text-cyan-950 text-2xl font-bold font-['Plus_Jakarta_Sans'] leading-[33px]">
        Ways to discover animals
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <div key={idx} className="p-6 bg-white rounded-3xl outline outline-1 outline-offset-[-1px] outline-zinc-200 flex flex-col gap-4">
            <div className="w-11 h-11 bg-zinc-100 rounded-full flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z" stroke="#00808B" strokeWidth="1.5"/>
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-cyan-950 text-lg font-bold font-['Plus_Jakarta_Sans'] leading-normal">
                {card.title}
              </div>
              <div className="text-teal-950 text-sm font-normal font-['Plus_Jakarta_Sans'] leading-[21px] min-h-[63px]">
                {card.description}
              </div>
            </div>
            <div className="flex items-center gap-1 cursor-pointer mt-auto pt-2">
              <span className="text-cyan-800 text-sm font-semibold font-['Plus_Jakarta_Sans'] hover:underline">
                {card.link}
              </span>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.41667 9.75L9.20833 5.95833L5.41667 2.16667" stroke="#00808B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
