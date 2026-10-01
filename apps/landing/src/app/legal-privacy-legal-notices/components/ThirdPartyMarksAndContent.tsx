import React from "react";
import {
  Image as ImageIcon,
  Stamp,
  Newspaper,
  MapPin,
} from "lucide-react";

interface ThirdPartyItem {
  id: string;
  title: string;
  description: React.ReactNode;
  icon: React.ReactNode;
  badge: React.ReactNode;
}

const thirdPartyItems: ThirdPartyItem[] = [
  {
    id: "photography",
    title: "Photography",
    description:
      "Sample images on this design are from Unsplash, under the Unsplash License.",
    icon: <ImageIcon className="w-4 h-4 text-[#0A5C6F]" />,
    badge: (
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-dashed border-[#FBEAD4] bg-[#FEF6EE] text-xs font-medium text-[#B45309] shadow-2xs">
        Design review
      </span>
    ),
  },
  {
    id: "partner-names",
    title: "Partner and platform names",
    description: (
      <>
        Owned by their respective holders.{" "}
        <strong className="font-semibold text-[#111827]">
          Apple, App Store, Google Play and Android
        </strong>{" "}
        are trademarks of their respective owners.
      </>
    ),
    icon: <Stamp className="w-4 h-4 text-[#0A5C6F]" />,
    badge: (
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-200 bg-[#EEF8F9] text-xs font-medium text-gray-700 shadow-2xs">
        Registry
      </span>
    ),
  },
  {
    id: "news-sources",
    title: "News sources",
    description:
      "Credited on each article. Publisher name, source tier and timestamp shown on every article.",
    icon: <Newspaper className="w-4 h-4 text-[#0A5C6F]" />,
    badge: (
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-200 bg-[#EEF8F9] text-xs font-medium text-gray-700 shadow-2xs">
        Registry
      </span>
    ),
  },
  {
    id: "map-location",
    title: "Map and location data",
    description: "Map data © OpenStreetMap contributors (sample provider).",
    icon: <MapPin className="w-4 h-4 text-[#0A5C6F]" />,
    badge: (
      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-gray-200 bg-[#EEF8F9] text-xs font-medium text-gray-700 shadow-2xs">
        Registry
      </span>
    ),
  },
];

export default function ThirdPartyMarksAndContent() {
  return (
    <section className="w-full bg-[#F7F9FA] py-16 px-4 md:px-8 flex justify-center font-sans">
      <div className="w-full max-w-7xl flex flex-col gap-10">
        {/* Header Title & Description */}
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
            Third-party marks and content
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            Names, logos and media that belong to others.
          </p>
        </div>

        {/* List of Informational Cards */}
        <div className="flex flex-col gap-4">
          {thirdPartyItems.map((item) => (
            <div
              key={item.id}
              className="w-full bg-white rounded-3xl border border-gray-200 shadow-sm p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:border-gray-300"
            >
              <div className="flex items-start md:items-center gap-5">
                <div className="w-9 h-9 rounded-xl bg-[#F0F9FA] border border-[#E0F2F4] flex items-center justify-center shrink-0 mt-0.5 md:mt-0">
                  {item.icon}
                </div>

                <div className="flex flex-col gap-1">
                  <h3 className="text-base md:text-lg font-bold text-[#111827]">
                    {item.title}
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500 font-normal leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="shrink-0 self-start md:self-center">
                {item.badge}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
