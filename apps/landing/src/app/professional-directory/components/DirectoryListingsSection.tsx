"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Filter,
  Check,
  Bookmark,
  MapPin,
  Info,
  List as ListIcon,
  Map as MapIcon,
  ChevronDown,
} from "lucide-react";
import { PROFESSIONALS, SPONSORED_PRO } from "./directoryData";
import { C } from "./theme";

const CATEGORY_FILTERS = [
  { label: "Veterinary", count: 3 },
  { label: "Training and behavior", count: 3 },
  { label: "Grooming", count: 2 },
  { label: "Nutrition", count: 1 },
  { label: "Caregiving", count: 2 },
  { label: "Rehabilitation", count: 1 },
];

const ANIMAL_FILTERS = [
  { label: "Dogs", count: 10 },
  { label: "Cats", count: 8 },
  { label: "Birds", count: 2 },
  { label: "Horses", count: 1 },
  { label: "Rabbits", count: 3 },
  { label: "Exotics", count: 1 },
];

const WORK_MODE_FILTERS = [
  { label: "In person", count: 10 },
  { label: "Virtual", count: 5 },
  { label: "Mobile", count: 4 },
];

const LANGUAGE_FILTERS = [
  { label: "English", count: 12 },
  { label: "Spanish", count: 4 },
  { label: "Korean", count: 1 },
  { label: "Hindi", count: 1 },
  { label: "German", count: 1 },
  { label: "Italian", count: 1 },
];

export default function DirectoryListingsSection() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAnimals, setSelectedAnimals] = useState<string[]>([]);
  const [selectedModes, setSelectedModes] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [acceptingOnly, setAcceptingOnly] = useState(false);
  const [savedPros, setSavedPros] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [visibleCount, setVisibleCount] = useState(9);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const totalActiveFilters =
    selectedCategories.length +
    selectedAnimals.length +
    selectedModes.length +
    selectedLanguages.length +
    (acceptingOnly ? 1 : 0);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const toggleAnimal = (an: string) => {
    setSelectedAnimals((prev) =>
      prev.includes(an) ? prev.filter((a) => a !== an) : [...prev, an]
    );
  };

  const toggleMode = (m: string) => {
    setSelectedModes((prev) =>
      prev.includes(m) ? prev.filter((mode) => mode !== m) : [...prev, m]
    );
  };

  const toggleLanguage = (lang: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  const clearAllFilters = () => {
    setSelectedCategories([]);
    setSelectedAnimals([]);
    setSelectedModes([]);
    setSelectedLanguages([]);
    setAcceptingOnly(false);
  };

  const toggleSave = (id: string) => {
    setSavedPros((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Filter the professionals
  const filteredProfessionals = PROFESSIONALS.filter((pro) => {
    if (selectedCategories.length > 0) {
      const matchCat = selectedCategories.some((c) =>
        pro.role.toLowerCase().includes(c.toLowerCase())
      );
      if (!matchCat) return false;
    }
    if (selectedAnimals.length > 0) {
      const matchAnimal = selectedAnimals.some((a) => pro.animals.includes(a));
      if (!matchAnimal) return false;
    }
    if (selectedModes.length > 0) {
      const matchMode = selectedModes.some((m) => pro.modalities.includes(m));
      if (!matchMode) return false;
    }
    if (acceptingOnly && pro.isStatusDate) {
      return false;
    }
    return true;
  });

  return (
    <section id="results" className="w-full bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Section Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <h2
            className="font-jakarta font-extrabold text-[28px] sm:text-[36px] leading-[1.15] tracking-[-0.01em] mb-2"
            style={{ color: C.tarawera }}
          >
            Professionals near you
          </h2>
          <p
            className="font-jakarta font-normal text-[15px] sm:text-[17px] leading-[1.6]"
            style={{ color: C.nevada }}
          >
            Showing verified professionals. Refine with filters, or switch to the map.
          </p>
        </div>

        {/* Mobile Filter Toggle Button */}
        <div className="lg:hidden w-full mb-4 flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="flex-1 flex items-center justify-between px-4 py-3 bg-white border border-[#DCE5E8] rounded-xl font-jakarta font-semibold text-[14px] text-[#0A3E3F] shadow-xs active:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#066879]" />
              <span>
                Filters {totalActiveFilters > 0 ? `(${totalActiveFilters})` : ""}
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-[#8A9BA1] transition-transform duration-200 ${
                showMobileFilters ? "rotate-180" : ""
              }`}
            />
          </button>
          {totalActiveFilters > 0 && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="px-4 py-3 rounded-xl border border-[#DCE5E8] font-jakarta text-[13px] font-semibold text-[#066879] bg-[#EEF8F9] shrink-0"
            >
              Reset
            </button>
          )}
        </div>

        {/* Content Layout: Left Filter Panel + Right Listings */}
        <div className="flex flex-col lg:flex-row items-start gap-6 lg:gap-8">
          {/* Left Sidebar Filter Panel */}
          <aside
            className={`w-full lg:w-[270px] shrink-0 bg-white border rounded-[20px] p-5 shadow-xs transition-all ${
              showMobileFilters ? "block mb-4 lg:mb-0" : "hidden lg:block"
            }`}
            style={{ borderColor: C.geyser }}
          >
            {/* Filter Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#DCE5E8]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#073B47]" />
                <h3
                  className="font-jakarta font-bold text-[17px]"
                  style={{ color: C.tarawera }}
                >
                  Filters
                </h3>
              </div>
              <button
                type="button"
                onClick={clearAllFilters}
                className="font-jakarta font-semibold text-[13.5px] hover:underline transition-all"
                style={{ color: C.mosque }}
              >
                Clear all
              </button>
            </div>

            {/* Filter Group: Category */}
            <div className="py-4 border-b border-[#DCE5E8]">
              <h4
                className="font-jakarta font-bold text-[13px] uppercase tracking-wider mb-3"
                style={{ color: C.firefly }}
              >
                Category
              </h4>
              <div className="space-y-2">
                {CATEGORY_FILTERS.map((item) => (
                  <label
                    key={item.label}
                    className="flex items-center justify-between cursor-pointer group text-[13.5px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(item.label)}
                        onChange={() => toggleCategory(item.label)}
                        className="w-4 h-4 rounded border-[#DCE5E8] text-[#066879] focus:ring-[#066879] cursor-pointer"
                      />
                      <span className="font-jakarta text-[#102A32] group-hover:text-[#066879] transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <span className="font-jakarta text-[12px] text-[#5E7076]">
                      {item.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Group: Animals they work with */}
            <div className="py-4 border-b border-[#DCE5E8]">
              <h4
                className="font-jakarta font-bold text-[13px] uppercase tracking-wider mb-3"
                style={{ color: C.firefly }}
              >
                Animals they work with
              </h4>
              <div className="space-y-2">
                {ANIMAL_FILTERS.map((item) => (
                  <label
                    key={item.label}
                    className="flex items-center justify-between cursor-pointer group text-[13.5px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={selectedAnimals.includes(item.label)}
                        onChange={() => toggleAnimal(item.label)}
                        className="w-4 h-4 rounded border-[#DCE5E8] text-[#066879] focus:ring-[#066879] cursor-pointer"
                      />
                      <span className="font-jakarta text-[#102A32] group-hover:text-[#066879] transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <span className="font-jakarta text-[12px] text-[#5E7076]">
                      {item.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Group: How they work */}
            <div className="py-4 border-b border-[#DCE5E8]">
              <h4
                className="font-jakarta font-bold text-[13px] uppercase tracking-wider mb-3"
                style={{ color: C.firefly }}
              >
                How they work
              </h4>
              <div className="space-y-2">
                {WORK_MODE_FILTERS.map((item) => (
                  <label
                    key={item.label}
                    className="flex items-center justify-between cursor-pointer group text-[13.5px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={selectedModes.includes(item.label)}
                        onChange={() => toggleMode(item.label)}
                        className="w-4 h-4 rounded border-[#DCE5E8] text-[#066879] focus:ring-[#066879] cursor-pointer"
                      />
                      <span className="font-jakarta text-[#102A32] group-hover:text-[#066879] transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <span className="font-jakarta text-[12px] text-[#5E7076]">
                      {item.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Group: Languages */}
            <div className="py-4 border-b border-[#DCE5E8]">
              <h4
                className="font-jakarta font-bold text-[13px] uppercase tracking-wider mb-3"
                style={{ color: C.firefly }}
              >
                Languages
              </h4>
              <div className="space-y-2">
                {LANGUAGE_FILTERS.map((item) => (
                  <label
                    key={item.label}
                    className="flex items-center justify-between cursor-pointer group text-[13.5px]"
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={selectedLanguages.includes(item.label)}
                        onChange={() => toggleLanguage(item.label)}
                        className="w-4 h-4 rounded border-[#DCE5E8] text-[#066879] focus:ring-[#066879] cursor-pointer"
                      />
                      <span className="font-jakarta text-[#102A32] group-hover:text-[#066879] transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <span className="font-jakarta text-[12px] text-[#5E7076]">
                      {item.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Filter Group: Availability */}
            <div className="py-4 border-b border-[#DCE5E8]">
              <h4
                className="font-jakarta font-bold text-[13px] uppercase tracking-wider mb-3"
                style={{ color: C.firefly }}
              >
                Availability
              </h4>
              <label className="flex items-center gap-2.5 cursor-pointer text-[13.5px]">
                <input
                  type="checkbox"
                  checked={acceptingOnly}
                  onChange={(e) => setAcceptingOnly(e.target.checked)}
                  className="w-4 h-4 rounded border-[#DCE5E8] text-[#066879] focus:ring-[#066879] cursor-pointer"
                />
                <span className="font-jakarta text-[#102A32]">Accepting new clients</span>
              </label>
            </div>

            {/* Bottom Callout */}
            <div className="pt-4 text-center">
              <p
                className="font-jakarta text-[12.5px] leading-relaxed italic"
                style={{ color: C.nevada }}
              >
                Every listing here is a verified professional.
              </p>
            </div>
          </aside>

          {/* Right Main Results Column */}
          <div className="flex-1 w-full min-w-0">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-3">
              <div>
                <h3
                  className="font-jakarta font-bold text-[18px] sm:text-[19px] leading-tight"
                  style={{ color: C.tarawera }}
                >
                  {filteredProfessionals.length} professionals
                </h3>
                <p
                  className="font-jakarta text-[13.5px] mt-0.5"
                  style={{ color: C.nevada }}
                >
                  Verified animal-care professionals in all regions
                </p>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort dropdown */}
                <div className="relative">
                  <select
                    defaultValue="best-match"
                    className="font-jakarta text-[13.5px] font-medium text-[#102A32] bg-white border border-[#DCE5E8] rounded-xl pl-3.5 pr-8 py-2 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#066879]/20"
                  >
                    <option value="best-match">Sort: Best match</option>
                    <option value="rating">Most recent</option>
                    <option value="name">Alphabetical</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#8A9BA1] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* View toggle */}
                <div
                  className="flex items-center bg-white border rounded-xl overflow-hidden p-0.5 shadow-2xs"
                  style={{ borderColor: C.geyser }}
                >
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-jakarta text-[13px] font-semibold transition-all ${
                      viewMode === "list"
                        ? "bg-[#066879] text-white shadow-xs"
                        : "text-[#5E7076] hover:text-[#102A32]"
                    }`}
                  >
                    <ListIcon className="w-4 h-4" />
                    <span>List</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("map")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-jakarta text-[13px] font-semibold transition-all ${
                      viewMode === "map"
                        ? "bg-[#066879] text-white shadow-xs"
                        : "text-[#5E7076] hover:text-[#102A32]"
                    }`}
                  >
                    <MapIcon className="w-4 h-4" />
                    <span>Map</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Explanation Note */}
            <div className="flex items-center gap-1.5 mb-5 text-[13px] text-[#5E7076]">
              <span className="font-semibold text-[#066879] cursor-pointer hover:underline">
                How Best match works
              </span>
              <span>· Based on your search, category, animals and region. Never on payment.</span>
            </div>

            {/* Sponsored Listing Container */}
            <div
              className="rounded-[20px] p-4 mb-6 border transition-all"
              style={{
                backgroundColor: C.serenade,
                borderColor: C.newOrleans,
              }}
            >
              <div className="flex items-center justify-between mb-3 text-[12.5px]">
                <div className="flex items-center gap-1.5 font-bold" style={{ color: C.cafeRoyale }}>
                  <Info className="w-3.5 h-3.5" />
                  <span>Sponsored · Separate from results and doesn&apos;t affect ranking</span>
                </div>
                <span className="font-semibold cursor-pointer hover:underline" style={{ color: C.mosque }}>
                  About ads
                </span>
              </div>

              {/* Sponsored Card */}
              <div
                className="bg-white border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                style={{ borderColor: C.newOrleans }}
              >
                <div className="flex items-center gap-3.5">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-[#DCE5E8]">
                    <Image
                      src={SPONSORED_PRO.avatar}
                      alt={SPONSORED_PRO.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4
                      className="font-jakarta font-bold text-[17px] leading-tight"
                      style={{ color: C.tarawera }}
                    >
                      {SPONSORED_PRO.name}
                    </h4>
                    <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#5E7076] mt-1">
                      <span>{SPONSORED_PRO.role}</span>
                      <span>·</span>
                      <span>{SPONSORED_PRO.location}</span>
                      <span>·</span>
                      <span className="font-medium text-[#102A32]">{SPONSORED_PRO.modality}</span>
                    </div>
                  </div>
                </div>

                <span
                  className="self-start sm:self-center font-jakarta font-bold text-[11.5px] px-3 py-1 rounded-full uppercase tracking-wider"
                  style={{
                    backgroundColor: C.serenade,
                    color: C.cafeRoyale,
                  }}
                >
                  Sponsored
                </span>
              </div>
            </div>

            {/* Results Grid */}
            {viewMode === "list" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
                {filteredProfessionals.slice(0, visibleCount).map((pro) => {
                  const isSaved = !!savedPros[pro.id];
                  return (
                    <article
                      key={pro.id}
                      className="bg-white border rounded-[24px] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                      style={{
                        borderColor: C.geyser,
                        boxShadow: C.shadowMicro,
                      }}
                    >
                      <div>
                        {/* Cover Image */}
                        <div className="relative w-full h-[120px] overflow-hidden bg-gray-100">
                          <Image
                            src={pro.cover}
                            alt={pro.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Card Content with Overlapping Avatar */}
                        <div className="px-4.5 pb-4">
                          <div className="flex items-end justify-between -mt-[28px] mb-2.5">
                            <div className="relative w-[56px] h-[56px] rounded-full overflow-hidden border-3 border-white shadow-sm shrink-0 bg-white">
                              <Image
                                src={pro.avatar}
                                alt={pro.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span
                              className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border"
                              style={{
                                backgroundColor: C.blackSqueeze,
                                borderColor: C.botticelli,
                                color: C.tarawera,
                              }}
                            >
                              <Check className="w-3 h-3 text-[#066879] stroke-[2.5]" />
                              Verified professional
                            </span>
                          </div>

                          {/* Name */}
                          <h4
                            className="font-jakarta font-bold text-[17px] leading-tight"
                            style={{ color: C.tarawera }}
                          >
                            {pro.name}
                          </h4>

                          {/* Role */}
                          <p
                            className="font-jakarta font-semibold text-[13.5px] mt-0.5"
                            style={{ color: C.firefly }}
                          >
                            {pro.role}
                          </p>

                          {/* Practice & Location */}
                          <div className="mt-1 space-y-0.5 text-[12.5px] text-[#5E7076]">
                            <p className="truncate">{pro.practice}</p>
                            <p className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#8A9BA1] shrink-0" />
                              <span>{pro.location}</span>
                            </p>
                          </div>

                          {/* Animal and Modality Tags */}
                          <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-2.5 border-t border-[#DCE5E8]">
                            {pro.animals.map((an) => (
                              <span
                                key={an}
                                className="font-jakarta text-[11.5px] font-semibold px-2 py-0.5 rounded-md border"
                                style={{
                                  backgroundColor: C.athensGray,
                                  borderColor: C.geyser,
                                  color: C.firefly,
                                }}
                              >
                                {an}
                              </span>
                            ))}
                            {pro.modalities.map((mod) => (
                              <span
                                key={mod}
                                className="font-jakarta text-[11.5px] font-semibold px-2 py-0.5 rounded-md border"
                                style={{
                                  backgroundColor: C.athensGray,
                                  borderColor: C.geyser,
                                  color: C.firefly,
                                }}
                              >
                                {mod}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer: Status + Bookmark */}
                      <div className="px-4.5 py-3 border-t border-[#DCE5E8] flex items-center justify-between bg-[#F8FAFB]/50">
                        <div className="flex items-center gap-1.5 text-[12px]">
                          {!pro.isStatusDate && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                          )}
                          <span
                            className="font-medium"
                            style={{
                              color: pro.isStatusDate ? C.nevada : C.tarawera,
                            }}
                          >
                            {pro.status}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => toggleSave(pro.id)}
                          aria-label={`Save ${pro.name}`}
                          className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                            isSaved
                              ? "bg-[#066879] border-[#066879] text-white"
                              : "bg-white border-[#DCE5E8] text-[#8A9BA1] hover:text-[#066879] hover:border-[#066879]"
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              /* Map Placeholder Mode */
              <div
                className="w-full h-[520px] rounded-[24px] border border-[#DCE5E8] bg-[#F7F9FA] flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-white border border-[#DCE5E8] flex items-center justify-center text-[#066879] mb-4 shadow-sm">
                  <MapIcon className="w-7 h-7" />
                </div>
                <h4 className="font-jakarta font-bold text-[20px] text-[#073B47] mb-2">
                  Map View Mode
                </h4>
                <p className="font-jakarta text-[14px] text-[#5E7076] max-w-[420px] mb-6">
                  Interactive map clusters verified animal-care practices by geographic coordinates.
                </p>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className="px-5 py-2.5 rounded-xl font-jakarta text-[14px] font-semibold bg-[#066879] text-white"
                >
                  Return to List View
                </button>
              </div>
            )}

            {/* Pagination & Load More */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#DCE5E8]">
              <span className="font-jakarta text-[13.5px] text-[#5E7076]">
                Showing {Math.min(visibleCount, filteredProfessionals.length)} of {filteredProfessionals.length}
              </span>
              {visibleCount < filteredProfessionals.length && (
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 3)}
                  className="font-jakarta font-semibold text-[14px] text-[#102A32] border border-[#DCE5E8] px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors shadow-2xs"
                >
                  Show more professionals
                </button>
              )}
            </div>

            {/* Inline Bottom Pro Banner */}
            <div
              className="mt-10 rounded-[24px] p-6 lg:p-7 border flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              style={{
                backgroundColor: C.blackSqueeze,
                borderColor: C.botticelli,
              }}
            >
              <div>
                <p className="font-jakarta text-[16px] text-[#102A32] leading-snug">
                  <span className="font-bold text-[#073B47]">
                    Are you an animal-care professional?
                  </span>{" "}
                  <span className="text-[#5E7076]">
                    Get verified to appear in the directory, or list your practice.
                  </span>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto shrink-0">
                <a
                  href="#for-professionals"
                  className="font-jakarta font-semibold text-[13.5px] text-white px-4.5 py-2.5 rounded-xl transition-all shadow-xs hover:brightness-110 text-center"
                  style={{ backgroundColor: C.mosque }}
                >
                  Get Verified
                </a>
                <a
                  href="#for-professionals"
                  className="font-jakarta font-semibold text-[13.5px] text-[#102A32] bg-white border border-[#DCE5E8] px-4.5 py-2.5 rounded-xl transition-all hover:bg-gray-50 shadow-2xs text-center"
                >
                  List your practice
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
