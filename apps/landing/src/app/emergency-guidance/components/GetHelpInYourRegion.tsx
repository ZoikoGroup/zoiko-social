"use client"
import React, { useState } from "react";

interface RegionResource {
  category: string;
  number: string;
  title: string;
  description: string;
  availability: string;
  icon: string;
}

const regionsData: Record<string, RegionResource[]> = {
  "North America": [
    {
      category: "Immediate Help",
      number: "911",
      title: "Call now for",
      description:
        "Active violence, medical emergency, overdose, immediate danger",
      availability: "Available: 24/7/365 - English & Spanish speakers",
      icon: "SOS",
    },
    {
      category: "Suicidal Thoughts",
      number: "988",
      title: "US Suicide & Crisis Lifeline",
      description:
        "Free, confidential, 24/7. Call or text - No matter what you're facing",
      availability: "Call or text - No matter what you're facing",
      icon: "💬",
    },
    {
      category: "Crisis Text",
      number: "Text HOME to 741741",
      title: "Crisis Text Line",
      description:
        "When you can't talk on the phone. Free, anonymous, 24/7 - Trained counselors",
      availability: "Free, anonymous, 24/7 - Trained counselors",
      icon: "💬",
    },
    {
      category: "Child Safety",
      number: "1-800-843-5678",
      title: "National Child Abuse Hotline",
      description:
        "Report abuse or get help as a child. Call or text - Confidential - 24/7",
      availability: "Call or text - Confidential - 24/7",
      icon: "🧒",
    },
    {
      category: "Domestic Violence",
      number: "1-800-799-7233",
      title: "National Domestic Violence Hotline",
      description:
        "Abuse, threats, stalking. Call or chat - Safe & confidential",
      availability: "Call or chat - Safe & confidential",
      icon: "💔",
    },
    {
      category: "Poison & Overdose",
      number: "1-800-222-1222",
      title: "Poison Control",
      description:
        "Drug overdose, toxic substance, accidental poisoning. Call now - Expert medical advice",
      availability: "Call now - Expert medical advice",
      icon: "☠️",
    },
  ],
  Europe: [
    {
      category: "Immediate Help",
      number: "112",
      title: "Emergency Services",
      description:
        "Pan-European emergency number for police, ambulance, and fire",
      availability: "Available: 24/7/365 - Multi-language support",
      icon: "SOS",
    },
    {
      category: "Suicidal Thoughts",
      number: "116 123",
      title: "Emotional Support Helpline",
      description:
        "Free, confidential emotional support for anyone in distress",
      availability: "Available 24/7",
      icon: "💬",
    },
    {
      category: "Crisis Text",
      number: "Text SUPPORT to 85258",
      title: "Crisis Text Service",
      description:
        "Free, confidential, 24/7 text support across select European regions",
      availability: "Available 24/7",
      icon: "💬",
    },
    {
      category: "Child Safety",
      number: "116 111",
      title: "Child Helpline",
      description:
        "Free and confidential helpline for children and young people",
      availability: "Available 24/7",
      icon: "🧒",
    },
    {
      category: "Domestic Violence",
      number: "116 016",
      title: "Helpline against Violence",
      description: "Support for victims of domestic abuse and violence",
      availability: "Available 24/7 - Confidential",
      icon: "💔",
    },
    {
      category: "Poison & Overdose",
      number: "112",
      title: "Medical Emergency",
      description:
        "Contact local emergency services immediately for acute poisoning or overdose",
      availability: "Available 24/7",
      icon: "☠️",
    },
  ],
  "Asia Pacific": [
    {
      category: "Immediate Help",
      number: "000 / 112",
      title: "Emergency Services",
      description:
        "Primary emergency response numbers for police, fire, and ambulance",
      availability: "Available 24/7",
      icon: "SOS",
    },
    {
      category: "Suicidal Thoughts",
      number: "13 11 14",
      title: "Lifeline Crisis Support",
      description: "24/7 crisis support and suicide prevention services",
      availability: "Available 24/7",
      icon: "💬",
    },
    {
      category: "Crisis Text",
      number: "Text 0477 13 11 14",
      title: "Text Support Service",
      description: "Confidential text-based crisis support",
      availability: "Available 24/7",
      icon: "💬",
    },
    {
      category: "Child Safety",
      number: "1800 55 1800",
      title: "Kids Helpline",
      description:
        "Free, private and confidential counseling service for young people",
      availability: "Available 24/7",
      icon: "🧒",
    },
    {
      category: "Domestic Violence",
      number: "1800 737 732",
      title: "National Domestic Support",
      description:
        "Dedicated support for sexual assault, domestic and family violence",
      availability: "Available 24/7",
      icon: "💔",
    },
    {
      category: "Poison & Overdose",
      number: "13 11 26",
      title: "Poisons Information Centre",
      description: "Expert clinical advice on poisoning, bites, and stings",
      availability: "Available 24/7",
      icon: "☠️",
    },
  ],
  "Latin America": [
    {
      category: "Immediate Help",
      number: "911",
      title: "Emergency Services",
      description:
        "Unified emergency number across multiple Latin American countries",
      availability: "Available 24/7",
      icon: "SOS",
    },
    {
      category: "Suicidal Thoughts",
      number: "800 911 2000",
      title: "National Crisis Line",
      description: "Psychological support and crisis intervention",
      availability: "Available 24/7",
      icon: "💬",
    },
    {
      category: "Crisis Text",
      number: "Text AYUDA",
      title: "Regional Text Support",
      description: "Text support services for immediate crisis assistance",
      availability: "Available 24/7",
      icon: "💬",
    },
    {
      category: "Child Safety",
      number: "01800 008 5398",
      title: "Child Protection Line",
      description: "Reporting and support for minor safety and exploitation",
      availability: "Available 24/7",
      icon: "🧒",
    },
    {
      category: "Domestic Violence",
      number: "911 / 144",
      title: "Gender & Domestic Violence Support",
      description: "Specialized assistance for domestic violence and abuse",
      availability: "Available 24/7",
      icon: "💔",
    },
    {
      category: "Poison & Overdose",
      number: "911",
      title: "Emergency Medical Response",
      description: "Immediate dispatch for toxic ingestion or severe overdose",
      availability: "Available 24/7",
      icon: "☠️",
    },
  ],
};

const regionsList = [
  { name: "North America", flag: "🇺🇸" },
  { name: "Europe", flag: "🇪🇺" },
  { name: "Asia Pacific", flag: "🌏" },
  { name: "Latin America", flag: "🌎" },
];

export default function GetHelpInYourRegion() {
  const [selectedRegion, setSelectedRegion] = useState("North America");

  const currentResources =
    regionsData[selectedRegion] || regionsData["North America"];

  return (
    <div className="w-full min-h-screen bg-[#FFFFFF] py-16 px-4 md:px-8 font-sans text-[#1a2d37]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Heading & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2d37] tracking-tight">
            Get help in your region
          </h1>
          <p className="text-[#5a6e75] text-sm md:text-base">
            Different regions have different services. Select your location to
            see local resources.
          </p>
        </div>

        {/* Region Selector Box */}
        <div className="bg-[#EEF8F9] border border-[#DCE5E8] rounded-3xl p-6 md:p-8 space-y-6 shadow-sm text-center">
          <div className="text-sm font-bold text-[#1a2d37]">
            Where are you located?
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {regionsList.map((region) => {
              const isSelected = selectedRegion === region.name;
              return (
                <button
                  key={region.name}
                  onClick={() => setSelectedRegion(region.name)}
                  className={`py-3.5 px-4 rounded-2xl font-medium text-sm flex items-center justify-center space-x-2 transition-all shadow-sm ${
                    isSelected
                      ? "bg-[#066879] text-white shadow-md"
                      : "bg-white text-[#1a2d37] border border-[#DCE5E8] hover:bg-gray-50"
                  }`}
                >
                  <span>{region.flag}</span>
                  <span>{region.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentResources.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#DCE5E8] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-[#066879] uppercase tracking-wider">
                  <span className="w-5 h-5 rounded-full bg-[#EEF8F9] flex items-center justify-center text-[10px]">
                    {item.icon}
                  </span>
                  <span>{item.category}</span>
                </div>

                <div className="text-xl md:text-2xl font-bold text-[#1a2d37]">
                  {item.number}
                </div>

                <div className="text-xs md:text-sm font-bold text-[#1a2d37]">
                  {item.title}:{" "}
                  <span className="font-normal text-[#5a6e75]">
                    {item.description}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#DCE5E8] text-[11px] text-[#5a6e75]">
                {item.availability}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
