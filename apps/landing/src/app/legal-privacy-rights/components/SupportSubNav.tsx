"use client"
import React, { useState } from "react";
import {
  Info,
  Send,
  UserCheck,
  Inbox,
  Trash2,
  Download,
  Users,
  Scale,
  HelpCircle,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    id: "before-you-submit",
    label: "Before you submit",
    icon: <Info className="w-4 h-4 text-gray-600" />,
  },
  {
    id: "start-a-request",
    label: "Start a request",
    icon: <Send className="w-4 h-4 text-gray-600" />,
  },
  {
    id: "identity",
    label: "Identity",
    icon: <UserCheck className="w-4 h-4 text-gray-600" />,
  },
  {
    id: "track-a-request",
    label: "Track a request",
    icon: <Inbox className="w-4 h-4 text-gray-600" />,
  },
  {
    id: "deletion",
    label: "Deletion",
    icon: <Trash2 className="w-4 h-4 text-gray-600" />,
  },
  {
    id: "export",
    label: "Export",
    icon: <Download className="w-4 h-4 text-gray-600" />,
  },
  {
    id: "on-someones-behalf",
    label: "On someone's behalf",
    icon: <Users className="w-4 h-4 text-gray-600" />,
  },
  {
    id: "decisions",
    label: "Decisions",
    icon: <Scale className="w-4 h-4 text-gray-600" />,
  },
  {
    id: "faq",
    label: "FAQ",
    icon: <HelpCircle className="w-4 h-4 text-gray-600" />,
  },
];

export default function SupportSubNav() {
  const [activeId, setActiveId] = useState<string>("before-you-submit");

  return (
    <nav className="w-full bg-white border-b border-gray-200 py-3 px-4 md:px-8 font-sans overflow-x-auto shadow-xs">
      <div className="w-full max-w-7xl mx-auto flex items-center gap-2 md:gap-6 min-w-max">
        {navItems.map((item) => {
          const isActive = activeId === item.id;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveId(item.id)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs md:text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? "text-gray-600 font-bold"
                  : "text-gray-600 hover:text-gray-600 hover:bg-gray-50"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
