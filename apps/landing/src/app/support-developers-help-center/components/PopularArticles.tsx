import React from "react";
import {
  Lock,
  Camera,
  User,
  ShieldCheck,
  AlertTriangle,
  Bell,
  ChevronRight,
} from "lucide-react";
import { HELP_TOPIC_HREF } from "@/lib/support-links";

const articles = [
  {
    icon: Lock,
    title: "Reset your password",
    category: "Account and sign-in",
  },
  {
    icon: Camera,
    title: "Fix photo uploads that fail",
    category: "Posts and media",
  },
  {
    icon: User,
    title: "Can't sign in to your account",
    category: "Account and sign-in",
  },
  {
    icon: ShieldCheck,
    title: "Control who sees your posts",
    category: "Privacy and safety",
  },
  {
    icon: AlertTriangle,
    title: "Report a post or account",
    category: "Privacy and safety",
  },
  {
    icon: Bell,
    title: "Manage notifications",
    category: "Account and sign-in",
  },
] as const;

export default function PopularArticles() {
  return (
    <section className="w-full bg-white py-12 px-4 flex justify-center font-sans">
      <div className="w-full max-w-7xl">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111827] tracking-tight mb-1.5">
            Popular articles
          </h2>
          <p className="text-sm text-gray-500 font-normal">
            What members look up most.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article, index) => {
            const IconComponent = article.icon;
            return (
              <a
                key={index}
                href={HELP_TOPIC_HREF[article.category] ?? "#"}
                className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#F0F9FA] flex items-center justify-center text-[#0A5C6F] shrink-0">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-[#111827] group-hover:text-[#0A5C6F] transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs text-gray-400 font-normal mt-0.5">
                      {article.category}
                    </p>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-[#0A5C6F] group-hover:translate-x-0.5 transition-all shrink-0 ml-2">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
