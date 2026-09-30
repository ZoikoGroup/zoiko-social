import React from "react";
import Image from "next/image";
import {
  User,
  Camera,
  Users,
  Calendar,
  Home,
  Bell,
  CheckCircle2,
  Eye,
  ChevronRight,
} from "lucide-react";

interface ApiCatalogCard {
  title: string;
  description: string;
  imageSrc: string;
  badgeText: string;
  badgeType: "current" | "preview";
  icon: React.ReactNode;
  linkText: string;
  linkHref: string;
}

const catalogCards: ApiCatalogCard[] = [
  {
    title: "Profiles and accounts",
    description: "Member profiles and account details.",
    imageSrc: "/api/3.png",
    badgeText: "Current",
    badgeType: "current",
    icon: <User className="w-4 h-4 text-[#073B47]" />,
    linkText: "Open reference",
    linkHref: "#",
  },
  {
    title: "Posts and media",
    description: "Posts, comments, photos and video.",
    imageSrc: "/api/4.png",
    badgeText: "Current",
    badgeType: "current",
    icon: <Camera className="w-4 h-4 text-[#073B47]" />,
    linkText: "Open reference",
    linkHref: "#",
  },
  {
    title: "Communities",
    description: "Groups, members and community content.",
    imageSrc: "/api/5.png",
    badgeText: "Current",
    badgeType: "current",
    icon: <Users className="w-4 h-4 text-[#073B47]" />,
    linkText: "Open reference",
    linkHref: "#",
  },
  {
    title: "Events",
    description: "Event listings and attendance.",
    imageSrc: "/api/6.png",
    badgeText: "Preview",
    badgeType: "preview",
    icon: <Calendar className="w-4 h-4 text-[#073B47]" />,
    linkText: "Open reference",
    linkHref: "#",
  },
  {
    title: "Adoption listings",
    description: "Shelter and rescue listings.",
    imageSrc: "/api/7.png",
    badgeText: "Current",
    badgeType: "current",
    icon: <Home className="w-4 h-4 text-[#073B47]" />,
    linkText: "Open reference",
    linkHref: "#",
  },
  {
    title: "Notifications",
    description: "Delivery of member notifications.",
    imageSrc: "/api/8.png",
    badgeText: "Current",
    badgeType: "current",
    icon: <Bell className="w-4 h-4 text-[#073B47]" />,
    linkText: "Open reference",
    linkHref: "#",
  },
];

export default function ApiCatalog() {
  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col items-start">
          <h2 className="text-2xl md:text-3xl font-bold text-[#073B47] tracking-tight mb-1.5">
            API catalog
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Browse by area of Zoiko Social.
          </p>
        </div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {catalogCards.map((card, index) => (
            <div
              key={index}
              className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-gray-300 transition-colors"
            >
              {/* Image Container with Badge */}
              <div className="relative w-full h-[200px]">
                <Image
                  src={card.imageSrc}
                  alt={card.title}
                  fill
                  className="object-cover object-center"
                />
                <div className="absolute top-4 right-4 z-10">
                  {card.badgeType === "current" ? (
                    <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-md text-[#073B47] border border-gray-200/60 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                      <CheckCircle2 className="w-3 h-3 text-[#073B47]" />
                      {card.badgeText}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-md text-[#073B47] border border-gray-200/60 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
                      <Eye className="w-3 h-3 text-gray-500" />
                      {card.badgeText}
                    </span>
                  )}
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 flex flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0 mt-0.5">
                    {card.icon}
                  </div>
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-bold text-[#073B47]">
                      {card.title}
                    </h3>
                    <p className="text-xs text-gray-500 font-normal leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                <a
                  href={card.linkHref}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#073B47] hover:underline pt-2"
                >
                  {card.linkText}
                  <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
