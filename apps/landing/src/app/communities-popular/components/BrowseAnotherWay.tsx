import { Plus_Jakarta_Sans } from "next/font/google";

// Optimize font loading in Next.js
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"] });

export default function BrowseAnotherWay() {
  const categories = [
    {
      title: "All Communities",
      description: "Browse every community available for discovery.",
      icon: (
        <div className="w-4 h-4 relative overflow-hidden shrink-0">
          <div className="w-3 h-3 left-[3px] top-[3px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-cyan-700 rounded-sm" />
          <div className="w-1.5 h-[3px] left-[6px] top-[6.75px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-cyan-700" />
        </div>
      ),
    },
    {
      title: "By Species",
      description: "Find a community for a specific animal.",
      icon: (
        <div className="w-4 h-4 relative overflow-hidden shrink-0">
          <div className="w-1.5 h-1.5 left-[6px] top-[3px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-cyan-700 rounded-full" />
          <div className="w-3 h-1 left-[3px] top-[11.25px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-cyan-700 rounded-sm" />
        </div>
      ),
    },
    {
      title: "Professional",
      description:
        "Explore communities run by vets, trainers, and shelters where source classification supports it.",
      icon: (
        <div className="w-4 h-4 relative overflow-hidden shrink-0">
          <div className="w-3 h-3.5 left-[3px] top-[1.50px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-cyan-700 rounded-sm" />
        </div>
      ),
    },
    {
      title: "Rescue & Adoption",
      description:
        "Explore communities focused on fostering, rescue, and adoption.",
      icon: (
        <div className="w-4 h-4 relative overflow-hidden shrink-0">
          <div className="w-3.5 h-3 left-[1.50px] top-[2.55px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-cyan-700 rounded-sm" />
        </div>
      ),
    },
    {
      title: "Training & Behavior",
      description: "Explore communities about training and animal behavior.",
      icon: (
        <div className="w-4 h-4 relative overflow-hidden shrink-0">
          <div className="w-3.5 h-3.5 left-[2.25px] top-[2.25px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-cyan-700 rounded-sm" />
          <div className="w-0.5 h-1.5 left-[9px] top-[6px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-cyan-700" />
        </div>
      ),
    },
    {
      title: "Wildlife & Conservation",
      description:
        "Explore communities following conservation work around the world.",
      icon: (
        <div className="w-4 h-4 relative overflow-hidden shrink-0">
          <div className="w-3 h-3 left-[3px] top-[3px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-cyan-700 rounded-sm" />
        </div>
      ),
    },
    {
      title: "Memorial & Support",
      description: "Find spaces for remembrance and mutual support.",
      icon: (
        <div className="w-4 h-4 relative overflow-hidden shrink-0">
          <div className="w-3 h-3.5 left-[3px] top-[1.50px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-cyan-700 rounded-sm" />
        </div>
      ),
    },
  ];

  return (
    <section
      className={`w-full max-w-[1232px] pt-11 pb-4 flex flex-col justify-start items-start gap-5 ${plusJakartaSans.className}`}
    >
      {/* Header */}
      <div className="w-full flex flex-col justify-start items-start">
        <h2 className="text-cyan-950 text-xl font-extrabold leading-8">
          Browse another way
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <div
            key={index}
            className="flex flex-col justify-start items-start gap-3 p-5 bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-cyan-200 hover:shadow-sm transition-shadow cursor-pointer"
          >
            {/* Icon Wrapper */}
            <div className="w-9 h-9 bg-slate-50 rounded-xl flex justify-center items-center shrink-0">
              {category.icon}
            </div>

            {/* Text Content */}
            <div className="flex flex-col gap-1">
              <h3 className="text-cyan-900 text-sm font-bold leading-5">
                {category.title}
              </h3>
              <p className="text-slate-600 text-xs font-normal leading-5">
                {category.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
