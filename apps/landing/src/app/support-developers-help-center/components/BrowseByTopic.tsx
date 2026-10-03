import React from "react";
import Image from "next/image";
import {
  PenTool,
  Lock,
  ShieldCheck,
  Users,
  Camera,
  Store,
  ChevronRight,
} from "lucide-react";
import { HELP_TOPIC_HREF } from "@/lib/support-links";

const topics = [
  {
    image: "/help/2.png",
    icon: PenTool,
    title: "Getting started",
    description: "Create an account and find your way around.",
    guides: "3 guides",
  },
  {
    image: "/help/3.png",
    icon: Lock,
    title: "Account and sign-in",
    description: "Passwords, verifhcation and account settings.",
    guides: "4 guides",
  },
  {
    image: "/help/4.png",
    icon: ShieldCheck,
    title: "Privacy and safety",
    description: "Control who sees what, and report concerns.",
    guides: "3 guides",
  },
  {
    image: "/help/5.png",
    icon: Users,
    title: "Communities",
    description: "Join, start and manage communities.",
    guides: "2 guides",
  },
  {
    image: "/help/6.png",
    icon: Camera,
    title: "Posts and media",
    description: "Share posts, photos and videos.",
    guides: "2 guides",
  },
  {
    image: "/help/7.png",
    icon: Store,
    title: "Adoption and Market",
    description: "Listings, shelters and buying safely.",
    guides: "2 guides",
  },
] as const;

export default function BrowseByTopic() {
  return (
    <section id="browse-topics" className="w-full bg-[#F7F9FA] py-12 px-4 flex justify-center font-sans">
      <div className="w-full max-w-7xl">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight mb-1.5">
            Browse by topic
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Pick an area to see every guide in it.
          </p>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, index) => {
            const IconComponent = topic.icon;
            return (
              <a
                key={index}
                href={HELP_TOPIC_HREF[topic.title] ?? "#"}
                className="group flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all overflow-hidden"
              >
                {/* Image Container */}
                <div className="relative w-full h-44 overflow-hidden">
                  <Image
                    src={topic.image}
                    alt={topic.title}
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content Container */}
                <div className="p-6 relative flex flex-col flex-grow">
                  {/* Floating Icon */}
                  <div className="absolute -top-6 left-6 w-12 h-12 rounded-xl bg-white shadow-md border border-gray-100 flex items-center justify-center text-[#0A5C6F]">
                    <IconComponent className="w-5 h-5" />
                  </div>

                  {/* Text Details */}
                  <div className="mt-4">
                    <h3 className="text-base font-bold text-[#111827] group-hover:text-[#0A5C6F] transition-colors mb-1">
                      {topic.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-normal mb-6 leading-relaxed">
                      {topic.description}
                    </p>

                    {/* Guides Count Link */}
                    <div className="flex items-center text-xs font-semibold text-[#0A5C6F]">
                      <span>{topic.guides}</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
