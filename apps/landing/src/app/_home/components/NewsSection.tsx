"use client";

import Image from "next/image";
import {
    ArrowRight,
    MessageCircle,
    Flag,
} from "lucide-react";

const categories = [
    "Welfare",
    "Conservation",
    "Wildlife Crime",
    "Vet Science",
    "Rescue Response",
    "Policy",
];

const sideNews = [
    {
        image: "/images/canine-research.jpg",
        tier: "Tier 2 Source",
        title: "New Research on Canine Cognitive Development",
        description:
            "Veterinary study reveals breakthrough findings on early socialization impacts.",
        location: "United States",
        time: "5 hours ago",
    },
    {
        image: "/images/news/marine-rescue.jpg",
        tier: "Tier 1 Source",
        title: "Marine Life Rescue Operation Underway",
        description:
            "International teams coordinate response to stranded dolphins in coastal region.",
        location: "Australia",
        time: "8 hours ago",
    },
    {
        image: "/images/news/shelter-initiative-1.jpg",
        tier: "Tier 2 Source",
        title: "Animal Shelter Capacity Initiative Launched",
        description:
            "National program aims to increase shelter resources and adoption rates.",
        location: "United Kingdom",
        time: "12 hours ago",
    },
    {
        image: "/images/news/shelter-initiative-2.jpg",
        tier: "Tier 2 Source",
        title: "Animal Shelter Capacity Initiative Launched",
        description:
            "National program aims to increase shelter resources and adoption rates.",
        location: "United Kingdom",
        time: "12 hours ago",
    },
];

export default function NewsSection() {
    return (
        <section className="bg-white py-20">
            <div className="mx-auto max-w-7xl">

                <h2 className="text-center font-montserrat text-4xl font-extrabold text-gray-900">
                    World Animal News Verified, Contextual, Profanity-Free
                </h2>

                <div className="mt-10 flex flex-wrap justify-center gap-4">

                    {categories.map((category, index) => (
                        <button
                            key={category}
                            className={`rounded-full border-2 px-6 py-2 text-sm font-semibold transition ${index === 0
                                    ? "border-cyan-800 bg-cyan-800 text-white"
                                    : "border-gray-200 bg-white text-gray-700 hover:border-cyan-800 hover:text-cyan-800"
                                }`}
                        >
                            {category}
                        </button>
                    ))}

                </div>

                <div className="mt-14 grid gap-6 lg:grid-cols-2">

                    {/* Featured Article */}

                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                        <div className="relative h-80 w-full">

                            <Image
                                src="/images/wildlife-policy.jpg"
                                alt="Wildlife Policy"
                                fill
                                className="object-cover"
                            />

                        </div>

                        <div className="p-8">

                            <div className="flex flex-wrap items-center gap-3">

                                <span className="rounded-md bg-emerald-500 px-3 py-1 text-xs font-bold text-white">
                                    Tier 1 Source
                                </span>

                                <span className="rounded-md bg-sky-100 px-3 py-1 text-xs font-bold text-cyan-800">
                                    Verified
                                </span>

                                <span className="text-xs text-gray-500">
                                    Global
                                </span>

                                <span className="text-xs text-gray-400">
                                    2 hours ago
                                </span>

                            </div>

                            <h3 className="mt-6 text-3xl font-bold leading-tight text-gray-900">
                                Major Policy Update on Wildlife Trade Enforcement
                            </h3>

                            <p className="mt-5 text-base leading-7 text-gray-600">
                                International coalition announces strengthened measures to
                                combat illegal wildlife trafficking across 47 nations.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-4">

                                <button className="flex items-center gap-2 rounded-xl bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200">
                                    <ArrowRight size={18} />
                                    Learn More
                                </button>

                                <button className="flex items-center gap-2 rounded-xl bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200">
                                    <MessageCircle size={18} />
                                    Discuss in Community
                                </button>

                                <button className="flex items-center gap-2 rounded-xl bg-gray-100 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-200">
                                    <Flag size={18} />
                                    Report Issue
                                </button>

                            </div>

                        </div>

                    </div>

                    {/* Right Side Cards */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                        {sideNews.map((news, index) => (
                            <div
                                key={index}
                                className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-lg"
                            >
                                <div>
                                    <div className="mb-4 flex flex-wrap items-center gap-2">
                                        <span
                                            className={`rounded-md px-3 py-1 text-xs font-bold text-white ${news.tier === "Tier 1 Source"
                                                    ? "bg-emerald-500"
                                                    : "bg-emerald-500"
                                                }`}
                                        >
                                            {news.tier}
                                        </span>

                                        <span className="rounded-md bg-[#e6f3f7] px-3 py-1 text-xs font-bold text-[#066879]">
                                            Verified
                                        </span>

                                        <span className="ml-auto text-xs font-medium text-gray-400">
                                            {news.time}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold leading-tight text-gray-900">
                                        {news.title}
                                    </h3>

                                    <p className="mt-3 text-[14px] leading-6 text-gray-500">
                                        {news.description}
                                    </p>
                                </div>

                                <div className="mt-4">
                                    <span className="inline-flex rounded-md bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600">
                                        {news.location}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>

            </div>

            <div className="mt-16 flex justify-center">

                <button className="rounded-xl bg-cyan-800 px-24 py-4 text-base font-bold text-white transition hover:bg-cyan-900">
                    View All News
                </button>

            </div>

        </section>
    );
}