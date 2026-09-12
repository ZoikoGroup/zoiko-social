import React from "react";

const CATEGORIES = [
  {
    id: "all",
    title: "All Communities",
    description: "Browse every community available for discovery.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.75 3H5.25C4.00736 3 3 4.00736 3 5.25V12.75C3 13.9926 4.00736 15 5.25 15H12.75C13.9926 15 15 13.9926 15 12.75V5.25C15 4.00736 13.9926 3 12.75 3Z" stroke="#066879" strokeWidth="1.5"/>
        <path d="M6 6.75H12M6 9.75H9.75" stroke="#066879" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: "popular",
    title: "Popular",
    description: "See communities with strong current activity.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 15.75C12.7279 15.75 15.75 12.7279 15.75 9C15.75 5.27208 12.7279 2.25 9 2.25C5.27208 2.25 2.25 5.27208 2.25 9C2.25 12.7279 5.27208 15.75 9 15.75Z" stroke="#066879" strokeWidth="1.5"/>
        <path d="M9 6V9L11.25 11.25" stroke="#066879" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: "by-species",
    title: "By Species",
    description: "Find a community for a specific animal.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.75 1.5L2.25 10.5H7.5L6.75 16.5L15 6H9.75V1.5Z" stroke="#066879" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: "professional",
    title: "Professional",
    description: "Communities associated with vets, trainers, and shelters.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 15.75C5.625 14.25 3 11.25 3 7.5V4.5L9 1.5L15 4.5V7.5C15 11.25 12.375 14.25 9 15.75Z" stroke="#066879" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: "training-behavior",
    title: "Training & Behavior",
    description: "Explore communities about training and animal behavior.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 9C10.6569 9 12 7.65685 12 6C12 4.34315 10.6569 3 9 3C7.34315 3 6 4.34315 6 6C6 7.65685 7.34315 9 9 9Z" stroke="#066879" strokeWidth="1.5"/>
        <path d="M3 15.75C3 12.75 6 11.25 9 11.25C12 11.25 15 12.75 15 15.75" stroke="#066879" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: "wildlife-conservation",
    title: "Wildlife & Conservation",
    description: "Explore communities following conservation work around the world.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 1.5L15 4.5V9C15 12.75 12.375 15.375 9 16.5C5.625 15.375 3 12.75 3 9V4.5L9 1.5Z" stroke="#066879" strokeWidth="1.5"/>
      </svg>
    ),
  },
  {
    id: "memorial-support",
    title: "Memorial & Support",
    description: "Find spaces for remembrance and mutual support.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 15C6 9 9 6 15 3M3 3C6 6 9 9 15 15" stroke="#066879" strokeWidth="1.5"/>
      </svg>
    ),
  },
];

export default function BrowseAnotherWay() {
  return (
    <div className="w-full flex flex-col gap-8">
      <div className="text-cyan-950 text-xl font-extrabold font-['Plus_Jakarta_Sans'] leading-8">
        Browse another way
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-[20px] outline outline-1 outline-offset-[-1px] outline-zinc-200 p-5 flex flex-col gap-4 cursor-pointer hover:shadow-[0_8px_24px_rgba(7,59,71,0.08)] transition-shadow"
          >
            <div className="size-9 bg-slate-100 rounded-xl flex items-center justify-center">
              {category.icon}
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-teal-950 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5">
                {category.title}
              </div>
              <div className="text-gray-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-5">
                {category.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
