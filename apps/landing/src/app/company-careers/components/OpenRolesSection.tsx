"use client";

import { useState, useMemo } from "react";
import { C } from "./theme";

type Job = {
  id: string;
  title: string;
  posted: string;
  team: string;
  location: string;
  type: string;
  description: string;
  reqId: string;
};

const INITIAL_JOBS: Job[] = [
  {
    id: "job-1",
    title: "Senior Product Manager — Community & Safety",
    posted: "Posted 5 days ago",
    team: "Product & Design",
    location: "Remote",
    type: "Full-time",
    description:
      "Lead product strategy for community tools, moderation systems, and safety features that protect users and animals. Work with engineering, trust and operations to design governance at scale.",
    reqId: "Req ID: PM-2026-001",
  },
  {
    id: "job-2",
    title: "Staff Engineer — Safety & Moderation Systems",
    posted: "Posted 3 days ago",
    team: "Engineering",
    location: "London, UK",
    type: "Full-time",
    description:
      "Design and build scalable safety infrastructure serving millions of users across languages and regions. Collaborate with trust, policy, and product teams on content moderation, identity verification, and abuse prevention.",
    reqId: "Req ID: ENG-2026-012",
  },
  {
    id: "job-3",
    title: "Trust & Safety Lead — Animal Welfare",
    posted: "Posted 1 week ago",
    team: "Trust & Safety",
    location: "Sacramento, CA",
    type: "Full-time",
    description:
      "Develop and execute animal welfare policies, anti-trafficking controls, and verification systems. Directly shape governance for adoption, rescue operations, and commercial safety on the platform.",
    reqId: "Req ID: TS-2026-005",
  },
  {
    id: "job-4",
    title: "Content Strategist — Verified Information",
    posted: "Posted 4 days ago",
    team: "Content & Editorial",
    location: "Remote",
    type: "Full-time",
    description:
      "Lead editorial strategy for animal welfare, conservation and veterinary content. Work with institutional sources, preserve editorial standards, and help build trust through verified information.",
    reqId: "Req ID: CON-2026-003",
  },
  {
    id: "job-5",
    title: "Data Analyst — Platform Intelligence",
    posted: "Posted 2 days ago",
    team: "Data & AI",
    location: "Remote",
    type: "Full-time",
    description:
      "Build analytics and intelligence systems for platform health, safety and community outcomes. Work with product, engineering and trust teams on decision support and responsible metrics.",
    reqId: "Req ID: DATA-2026-007",
  },
];

export default function OpenRolesSection() {
  const [search, setSearch] = useState("");
  const [selectedTeam, setSelectedTeam] = useState("All teams");
  const [selectedLocation, setSelectedLocation] = useState("All locations");
  const [selectedType, setSelectedType] = useState("All types");
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  const filteredJobs = useMemo(() => {
    return INITIAL_JOBS.filter((job) => {
      const matchesSearch =
        search.trim() === "" ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.team.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase());

      const matchesTeam =
        selectedTeam === "All teams" || job.team === selectedTeam;

      const matchesLocation =
        selectedLocation === "All locations" ||
        job.location === selectedLocation;

      const matchesType =
        selectedType === "All types" || job.type === selectedType;

      return matchesSearch && matchesTeam && matchesLocation && matchesType;
    });
  }, [search, selectedTeam, selectedLocation, selectedType]);

  const handleClear = () => {
    setSearch("");
    setSelectedTeam("All teams");
    setSelectedLocation("All locations");
    setSelectedType("All types");
  };

  return (
    <section
      id="open-roles"
      className="py-12 sm:py-16 lg:py-24 scroll-mt-20"
      style={{ background: C.athensGray }}
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="max-w-[800px]">
          <h2
            className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold leading-[1.2] tracking-[-0.01em]"
            style={{ color: C.firefly }}
          >
            Open roles
          </h2>
          <p
            className="mt-2 sm:mt-3 text-sm sm:text-base lg:text-[17px] leading-relaxed sm:leading-[28px]"
            style={{ color: C.nevada }}
          >
            Search and filter current opportunities at Zoiko Social. Jobs below are
            synced from our ATS and updated in real time.
          </p>
        </div>

        {/* Filter Box */}
        <div
          className="mt-6 sm:mt-8 rounded-[16px] sm:rounded-[20px] p-5 sm:p-6 lg:p-8 border"
          style={{
            background: C.blackSqueeze,
            borderColor: C.geyser,
          }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {/* Search Input */}
            <div>
              <label
                htmlFor="job-search"
                className="block text-xs font-semibold uppercase tracking-wider mb-1.5 sm:mb-2"
                style={{ color: C.firefly }}
              >
                Search
              </label>
              <input
                id="job-search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Job title, team, or skill..."
                className="w-full rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm transition border focus:outline-none focus:border-[#066879]"
                style={{
                  background: C.white,
                  borderColor: C.geyser,
                  color: C.firefly,
                }}
              />
            </div>

            {/* Team Dropdown */}
            <div>
              <label
                htmlFor="job-team"
                className="block text-xs font-semibold uppercase tracking-wider mb-1.5 sm:mb-2"
                style={{ color: C.firefly }}
              >
                Team
              </label>
              <select
                id="job-team"
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
                className="w-full rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm transition border focus:outline-none focus:border-[#066879] cursor-pointer"
                style={{
                  background: C.white,
                  borderColor: C.geyser,
                  color: C.firefly,
                }}
              >
                <option value="All teams">All teams</option>
                <option value="Product & Design">Product & Design</option>
                <option value="Engineering">Engineering</option>
                <option value="Trust & Safety">Trust & Safety</option>
                <option value="Content & Editorial">Content & Editorial</option>
                <option value="Data & AI">Data & AI</option>
              </select>
            </div>

            {/* Location Dropdown */}
            <div>
              <label
                htmlFor="job-location"
                className="block text-xs font-semibold uppercase tracking-wider mb-1.5 sm:mb-2"
                style={{ color: C.firefly }}
              >
                Location
              </label>
              <select
                id="job-location"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm transition border focus:outline-none focus:border-[#066879] cursor-pointer"
                style={{
                  background: C.white,
                  borderColor: C.geyser,
                  color: C.firefly,
                }}
              >
                <option value="All locations">All locations</option>
                <option value="Remote">Remote</option>
                <option value="London, UK">London, UK</option>
                <option value="Sacramento, CA">Sacramento, CA</option>
              </select>
            </div>

            {/* Type Dropdown */}
            <div>
              <label
                htmlFor="job-type"
                className="block text-xs font-semibold uppercase tracking-wider mb-1.5 sm:mb-2"
                style={{ color: C.firefly }}
              >
                Type
              </label>
              <select
                id="job-type"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full rounded-xl px-3.5 sm:px-4 py-2.5 sm:py-3 text-sm transition border focus:outline-none focus:border-[#066879] cursor-pointer"
                style={{
                  background: C.white,
                  borderColor: C.geyser,
                  color: C.firefly,
                }}
              >
                <option value="All types">All types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => {}}
              className="w-full sm:flex-1 rounded-xl py-3 px-5 text-sm font-semibold text-white transition hover:opacity-90 text-center"
              style={{ background: C.mosque }}
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="w-full sm:flex-1 rounded-xl py-3 px-5 text-sm font-semibold border transition hover:bg-slate-50 text-center"
              style={{
                background: C.white,
                borderColor: C.geyser,
                color: C.firefly,
              }}
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Jobs List */}
        <div className="mt-6 sm:mt-8 flex flex-col gap-4">
          {filteredJobs.length === 0 ? (
            <div
              className="rounded-[16px] sm:rounded-[20px] p-8 sm:p-10 text-center border"
              style={{ background: C.white, borderColor: C.geyser }}
            >
              <p className="text-base font-medium" style={{ color: C.nevada }}>
                No open roles found matching your criteria.
              </p>
              <button
                type="button"
                onClick={handleClear}
                className="mt-4 inline-flex items-center text-sm font-semibold underline"
                style={{ color: C.zest }}
              >
                Reset filters
              </button>
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div
                key={job.id}
                className="rounded-[16px] sm:rounded-[20px] p-5 sm:p-6 border transition hover:shadow-sm"
                style={{
                  background: C.white,
                  borderColor: C.geyser,
                }}
              >
                {/* Job Title and Posted Date */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 sm:gap-2">
                  <h3
                    className="text-base sm:text-lg lg:text-[20px] font-bold leading-tight"
                    style={{ color: C.mosque }}
                  >
                    {job.title}
                  </h3>
                  <span
                    className="text-xs sm:text-[13px] font-normal shrink-0"
                    style={{ color: C.nevada }}
                  >
                    {job.posted}
                  </span>
                </div>

                {/* Badges */}
                <div className="mt-3 flex flex-wrap gap-1.5 sm:gap-2">
                  <span
                    className="rounded-xl px-2.5 py-1 text-xs sm:text-[13px] font-semibold"
                    style={{ background: C.blackSqueeze, color: C.mosque }}
                  >
                    {job.team}
                  </span>
                  <span
                    className="rounded-xl px-2.5 py-1 text-xs sm:text-[13px] font-semibold"
                    style={{ background: C.blackSqueeze, color: C.mosque }}
                  >
                    {job.location}
                  </span>
                  <span
                    className="rounded-xl px-2.5 py-1 text-xs sm:text-[13px] font-semibold"
                    style={{ background: C.blackSqueeze, color: C.mosque }}
                  >
                    {job.type}
                  </span>
                </div>

                {/* Description */}
                <p
                  className="mt-3 text-xs sm:text-sm leading-relaxed sm:leading-[23.1px]"
                  style={{ color: C.nevada }}
                >
                  {job.description}
                </p>

                {/* Footer: Req ID and View Role */}
                <div className="mt-4 sm:mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                  <span
                    className="text-xs sm:text-[13px]"
                    style={{ color: C.nevada }}
                  >
                    {job.reqId}
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveJob(job)}
                    className="w-full sm:w-auto text-center rounded-xl px-5 py-2.5 text-xs sm:text-[13.3px] font-semibold text-white transition hover:opacity-90"
                    style={{ background: C.mosque }}
                  >
                    View Role
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Roles Count Footer */}
        <div className="mt-6 sm:mt-8 text-center">
          <p
            className="text-sm sm:text-base font-bold"
            style={{ color: C.nevada }}
          >
            {filteredJobs.length} open {filteredJobs.length === 1 ? "role" : "roles"}{" "}
            <span className="font-normal">• More coming soon</span>
          </p>
        </div>
      </div>

      {/* Role Details Modal (Mobile Responsive) */}
      {activeJob && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm"
          onClick={() => setActiveJob(null)}
        >
          <div
            className="w-full max-w-[640px] max-h-[90vh] overflow-y-auto rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150"
            style={{ background: C.white }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <span
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: C.zest }}
                >
                  {activeJob.reqId}
                </span>
                <h3
                  className="text-lg sm:text-2xl font-bold mt-1"
                  style={{ color: C.mosque }}
                >
                  {activeJob.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveJob(null)}
                className="size-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 bg-slate-100 shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span
                className="rounded-xl px-3 py-1 text-xs font-semibold"
                style={{ background: C.blackSqueeze, color: C.mosque }}
              >
                {activeJob.team}
              </span>
              <span
                className="rounded-xl px-3 py-1 text-xs font-semibold"
                style={{ background: C.blackSqueeze, color: C.mosque }}
              >
                {activeJob.location}
              </span>
              <span
                className="rounded-xl px-3 py-1 text-xs font-semibold"
                style={{ background: C.blackSqueeze, color: C.mosque }}
              >
                {activeJob.type}
              </span>
            </div>

            <div className="mt-5 sm:mt-6 space-y-3 sm:space-y-4 text-xs sm:text-sm leading-relaxed" style={{ color: C.nevada }}>
              <p>{activeJob.description}</p>
              <p>
                As part of Zoiko Social, you will work on mission-critical features,
                collaborate across global teams, and contribute to an animal welfare
                ecosystem that prioritizes trust, privacy, and community safety.
              </p>
            </div>

            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 pt-5 sm:pt-6 border-t border-slate-100">
              <a
                href={`mailto:careers@zoikosocial.com?subject=Application%20for%20${encodeURIComponent(
                  activeJob.title
                )}%20(${activeJob.reqId})`}
                className="w-full sm:flex-1 rounded-xl py-3 px-5 text-center text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
                style={{ background: C.mosque }}
              >
                Apply for this Role
              </a>
              <button
                type="button"
                onClick={() => setActiveJob(null)}
                className="w-full sm:flex-1 rounded-xl py-3 px-5 text-sm font-semibold border transition hover:bg-slate-50 text-center"
                style={{ borderColor: C.geyser, color: C.firefly }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
