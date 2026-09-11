import React from "react";
import Link from "next/link";

export default function BrowseCategories() {
  const categories = [
    {
      title: "Popular",
      description: "The most active communities right now.",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
      href: "/communities/popular",
    },
    {
      title: "By Species",
      description: "Find a community for a specific animal.",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
          />
        </svg>
      ),
      href: "/communities/species",
    },
    {
      title: "Professional",
      description: "Communities run by vets, trainers, and shelters.",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
      href: "/communities/professional",
    },
    {
      title: "Rescue & Adoption",
      description: "Coordinate fostering, rescue, and adoption.",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
      href: "/communities/rescue",
    },
    {
      title: "Training & Behavior",
      description: "Share advice on training and animal behavior.",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      href: "/communities/training",
    },
    {
      title: "Wildlife & Conservation",
      description: "Follow conservation work around the world.",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      href: "/communities/conservation",
    },
    {
      title: "Memorial & Support",
      description: "A space to remember and support one another.",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      href: "/communities/memorial",
    },
  ];

  return (
    <section className="w-full max-w-[1232px] mx-auto pt-12 pb-8 flex flex-col gap-6">
      {/* Header */}
      <div>
        <h2 className="text-cyan-900 text-xl font-extrabold font-['Plus_Jakarta_Sans'] leading-8">
          Browse another way
        </h2>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <Link
            key={index}
            href={category.href}
            className="group flex flex-col gap-4 p-5 bg-white rounded-2xl border border-gray-200 hover:border-cyan-400 hover:shadow-md transition-all duration-200 min-h-[160px]"
          >
            {/* Icon Box */}
            <div className="w-10 h-10 bg-gray-100 group-hover:bg-cyan-50 rounded-xl flex justify-center items-center text-cyan-700 transition-colors">
              {category.icon}
            </div>

            {/* Text Content */}
            <div className="flex flex-col gap-1">
              <h3 className="text-cyan-900 text-sm font-bold font-['Plus_Jakarta_Sans'] leading-5">
                {category.title}
              </h3>
              <p className="text-slate-500 text-xs font-normal font-['Plus_Jakarta_Sans'] leading-5">
                {category.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
