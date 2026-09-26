import React from "react";
import Image from "next/image";

interface EmergencyCard {
  title: string;
  description: string;
  icon: string;
  buttonText: string;
}

const emergencies: EmergencyCard[] = [
  {
    title: "Immediate danger",
    description:
      "Someone is being harmed, attacked, or in physical danger right now. Report immediately.",
    icon: "/emergency/22.png",
    buttonText: "Report Now",
  },
  {
    title: "Suicidal thoughts",
    description:
      "Someone is expressing suicidal thoughts, self-harm plans, or severe depression. Get crisis support.",
    icon: "/emergency/23.png",
    buttonText: "Get Help",
  },
  {
    title: "Child safety",
    description:
      "A child is being exploited, abused, or endangered. Report to authorities immediately.",
    icon: "/emergency/24.png",
    buttonText: "Report to CyberTipline",
  },
  {
    title: "Abuse & harassment",
    description:
      "Someone is experiencing intimate partner violence, stalking, or coordinated harassment.",
    icon: "/emergency/25.png",
    buttonText: "Get Resources",
  },
  {
    title: "Overdose & addiction",
    description:
      "Someone is overdosing, experiencing severe withdrawal, or in danger from substance use.",
    icon: "/emergency/26.png",
    buttonText: "Call Poison Control",
  },
  {
    title: "Medical emergency",
    description:
      "Someone is experiencing a medical crisis: chest pain, difficulty breathing, severe allergic reaction.",
    icon: "/emergency/27.png",
    buttonText: "Call 911",
  },
];

export default function TypesOfEmergencies() {
  return (
    <div className="w-full min-h-screen bg-[#F7F9FA] py-16 px-4 md:px-8 font-sans text-[#1a2d37]">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Heading & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1a2d37] tracking-tight">
            Types of emergencies we help with
          </h1>
          <p className="text-[#5a6e75] text-sm md:text-base">
            If you&apos;re experiencing or witnessing any of these situations,
            you&apos;re in the right place. Get help right now.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {emergencies.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-sm border border-[#DCE5E8] flex flex-col justify-between space-y-6"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-2xl bg-[#EEF8F9] flex items-center justify-center p-2.5 relative">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h2 className="text-lg font-bold text-[#1a2d37]">
                    {item.title}
                  </h2>
                  <p className="text-[#5a6e75] text-xs md:text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <a
                  href="#"
                  className="w-full py-3.5 rounded-xl bg-[#066879] hover:bg-[#055563] text-white font-medium text-xs md:text-sm transition-colors text-center block shadow-sm"
                >
                  {item.buttonText}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
