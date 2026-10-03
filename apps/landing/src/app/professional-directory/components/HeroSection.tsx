"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, MapPin, ShieldCheck, Check, Sparkles, ChevronDown } from "lucide-react";
import { C } from "./theme";

export default function HeroSection() {
  const [need, setNeed] = useState("");
  const [animal, setAnimal] = useState("Any animal");
  const [where, setWhere] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const resultsEl = document.getElementById("results");
    if (resultsEl) {
      resultsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-white pt-6 pb-12 sm:pt-10 sm:pb-16 lg:pt-16 lg:pb-20 overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14">
          {/* Left Column: Headline + Search */}
          <div className="w-full lg:max-w-[660px] flex flex-col items-start">
            <span
              className="font-jakarta font-bold text-[12px] uppercase tracking-[0.12em] mb-2.5 sm:mb-3 inline-block"
              style={{ color: C.mosque }}
            >
              Professional Directory
            </span>

            <h1
              className="font-jakarta font-extrabold text-[30px] sm:text-[40px] lg:text-[48px] leading-[1.12] sm:leading-[1.08] tracking-[-0.02em] mb-3 sm:mb-4"
              style={{ color: C.tarawera }}
            >
              Find verified animal-care{" "}
              <br className="hidden sm:inline" />
              professionals with{" "}
              <br className="hidden sm:inline" />
              confidence.
            </h1>

            <p
              className="font-jakarta font-normal text-[15px] sm:text-[16.5px] lg:text-[17.5px] leading-[1.6] mb-6 sm:mb-8"
              style={{ color: C.nevada }}
            >
              Vets, trainers, groomers, behaviorists, nutritionists and caregivers,
              searchable by service, animal and region, with clear verification and
              practice details.
            </p>

            {/* Search Card */}
            <form
              onSubmit={handleSearch}
              className="w-full bg-white rounded-[24px] sm:rounded-[28px] border p-2 sm:p-2.5 transition-all duration-300"
              style={{
                borderColor: C.geyser,
                boxShadow: C.shadowCard,
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-[1.3fr_auto_0.9fr_auto_1fr_auto] items-center gap-1.5 md:gap-3 p-1">
                {/* Field 1: What you need */}
                <div className="flex flex-col px-3 py-2 border-b md:border-b-0 border-[#EEF2F4]">
                  <label
                    className="font-jakarta font-bold text-[11.5px] sm:text-[12px] leading-[1.4] mb-0.5"
                    style={{ color: C.nevada }}
                  >
                    What you need
                  </label>
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4 text-[#8A9BA1] shrink-0" />
                    <input
                      type="text"
                      value={need}
                      onChange={(e) => setNeed(e.target.value)}
                      placeholder="Vet, trainer, grooming…"
                      className="w-full font-jakarta text-[14.5px] sm:text-[15px] font-medium placeholder-[#8A9BA1] text-[#102A32] focus:outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-[1px] h-9 bg-[#DCE5E8]" />

                {/* Field 2: Animal */}
                <div className="flex flex-col px-3 py-2 border-b md:border-b-0 border-[#EEF2F4]">
                  <label
                    className="font-jakarta font-bold text-[11.5px] sm:text-[12px] leading-[1.4] mb-0.5"
                    style={{ color: C.nevada }}
                  >
                    Animal
                  </label>
                  <div className="relative flex items-center">
                    <select
                      value={animal}
                      onChange={(e) => setAnimal(e.target.value)}
                      className="w-full font-jakarta text-[14.5px] sm:text-[15px] font-semibold text-[#102A32] focus:outline-none bg-transparent cursor-pointer appearance-none pr-5"
                    >
                      <option value="Any animal">Any animal</option>
                      <option value="Dogs">Dogs</option>
                      <option value="Cats">Cats</option>
                      <option value="Birds">Birds</option>
                      <option value="Horses">Horses</option>
                      <option value="Rabbits">Rabbits</option>
                      <option value="Exotics">Exotics</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#8A9BA1] absolute right-0 pointer-events-none" />
                  </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-[1px] h-9 bg-[#DCE5E8]" />

                {/* Field 3: Where */}
                <div className="flex flex-col px-3 py-2 pb-3 md:pb-2">
                  <label
                    className="font-jakarta font-bold text-[11.5px] sm:text-[12px] leading-[1.4] mb-0.5"
                    style={{ color: C.nevada }}
                  >
                    Where
                  </label>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#8A9BA1] shrink-0" />
                    <input
                      type="text"
                      value={where}
                      onChange={(e) => setWhere(e.target.value)}
                      placeholder="City or region"
                      className="w-full font-jakarta text-[14.5px] sm:text-[15px] font-medium placeholder-[#8A9BA1] text-[#102A32] focus:outline-none bg-transparent"
                    />
                  </div>
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className="w-full md:w-auto font-jakarta font-semibold text-[14.5px] sm:text-[15px] text-white px-5 sm:px-6 py-3.5 sm:py-4 rounded-[14px] flex items-center justify-center gap-2 transition-all hover:brightness-110 active:scale-95 shadow-sm mt-1 md:mt-0"
                  style={{ backgroundColor: C.mosque }}
                >
                  <Search className="w-4 h-4" />
                  <span>Find professionals</span>
                </button>
              </div>
            </form>

            {/* Disclaimer note */}
            <div className="flex items-start sm:items-center gap-2.5 mt-4 px-1">
              <ShieldCheck className="w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0 mt-0.5 sm:mt-0" style={{ color: C.mosque }} />
              <p
                className="font-jakarta font-normal text-[12.5px] sm:text-[13px] lg:text-[13.5px] leading-[1.55]"
                style={{ color: C.nevada }}
              >
                Verification confirms identity and professional category checks. It isn&apos;t a guarantee
                of service quality or outcome.
              </p>
            </div>
          </div>

          {/* Right Column: Layered Result Preview Cards */}
          <div className="w-full max-w-[420px] lg:max-w-none lg:w-[500px] h-[450px] sm:h-[500px] lg:h-[520px] relative flex items-center justify-center shrink-0 mx-auto">
            {/* Background Card */}
            <div
              className="absolute right-0 top-0 w-[94%] sm:w-[390px] lg:w-[434px] bg-white border rounded-[24px] sm:rounded-[28px] p-3.5 sm:p-4 transition-all duration-300"
              style={{
                borderColor: C.geyser,
                boxShadow: C.shadowSubtle,
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-1 py-1 mb-2.5 sm:mb-3">
                <span
                  className="font-jakarta font-bold text-[12.5px] sm:text-[13px]"
                  style={{ color: C.nevada }}
                >
                  Results in San Francisco
                </span>
                <span
                  className="font-jakarta font-bold text-[12.5px] sm:text-[13px]"
                  style={{ color: C.nevada }}
                >
                  12 found
                </span>
              </div>

              {/* Rows */}
              <div className="space-y-2 sm:space-y-2.5">
                {/* Row 1: Dr. Maya Okafor */}
                <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-[#F7F9FA] transition-colors">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 border border-[#DCE5E8]">
                      <Image
                        src="/professional-directory/hero-preview-maya-okafor.png"
                        alt="Dr. Maya Okafor"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4
                        className="font-jakarta font-bold text-[13.5px] sm:text-[14px] leading-tight"
                        style={{ color: C.tarawera }}
                      >
                        Dr. Maya Okafor
                      </h4>
                      <p
                        className="font-jakarta text-[12px] sm:text-[12.5px] leading-tight mt-0.5"
                        style={{ color: C.nevada }}
                      >
                        Veterinarian · Harbor Point
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] sm:text-[11px] font-bold"
                    style={{ backgroundColor: C.blackSqueeze, color: C.mosque }}
                  >
                    <Check className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                </div>

                {/* Row 2: Aaron Kim */}
                <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-[#F7F9FA] transition-colors">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 border border-[#DCE5E8]">
                      <Image
                        src="/professional-directory/hero-preview-aaron-kim.png"
                        alt="Aaron Kim"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4
                        className="font-jakarta font-bold text-[13.5px] sm:text-[14px] leading-tight"
                        style={{ color: C.tarawera }}
                      >
                        Aaron Kim
                      </h4>
                      <p
                        className="font-jakarta text-[12px] sm:text-[12.5px] leading-tight mt-0.5"
                        style={{ color: C.nevada }}
                      >
                        Dog trainer · Northside Paws
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] sm:text-[11px] font-bold"
                    style={{ backgroundColor: C.blackSqueeze, color: C.mosque }}
                  >
                    <Check className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                </div>

                {/* Row 3: Sofia Reyes */}
                <div className="flex items-center justify-between p-2 rounded-2xl hover:bg-[#F7F9FA] transition-colors">
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden shrink-0 border border-[#DCE5E8]">
                      <Image
                        src="/professional-directory/hero-preview-sofia-reyes.png"
                        alt="Sofia Reyes"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4
                        className="font-jakarta font-bold text-[13.5px] sm:text-[14px] leading-tight"
                        style={{ color: C.tarawera }}
                      >
                        Sofia Reyes
                      </h4>
                      <p
                        className="font-jakarta text-[12px] sm:text-[12.5px] leading-tight mt-0.5"
                        style={{ color: C.nevada }}
                      >
                        Mobile groomer
                      </p>
                    </div>
                  </div>
                  <div
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10.5px] sm:text-[11px] font-bold"
                    style={{ backgroundColor: C.blackSqueeze, color: C.mosque }}
                  >
                    <Check className="w-3 h-3" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Foreground Overlapping Featured Card (Dr. Lena Ruiz) */}
            <div
              className="absolute left-0 bottom-1 sm:bottom-2 w-[88%] sm:w-[320px] lg:w-[340px] bg-white border rounded-[24px] sm:rounded-[28px] overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-md"
              style={{ borderColor: C.geyser }}
            >
              {/* Cover Banner */}
              <div className="relative w-full h-[110px] sm:h-[125px]">
                <Image
                  src="/professional-directory/hero-preview-lena-ruiz-bg.png"
                  alt="Veterinary Rehabilitation"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </div>

              {/* Card Body */}
              <div className="px-3.5 sm:px-4.5 pb-3.5 sm:pb-4 pt-0">
                {/* Overlapping Avatar */}
                <div className="relative -mt-[30px] sm:-mt-[34px] mb-2 flex items-end justify-between">
                  <div
                    className="w-[58px] h-[58px] sm:w-[66px] sm:h-[66px] rounded-full p-[2.5px] shadow-md"
                    style={{ background: C.gradientZoiko }}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white">
                      <Image
                        src="/professional-directory/hero-preview-lena-ruiz-avatar.png"
                        alt="Dr. Lena Ruiz"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <span
                    className="flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[10.5px] sm:text-[11.5px] font-bold border"
                    style={{
                      backgroundColor: C.blackSqueeze,
                      borderColor: C.botticelli,
                      color: C.tarawera,
                    }}
                  >
                    <Sparkles className="w-3 h-3 text-[#066879]" />
                    Verified professional
                  </span>
                </div>

                {/* Name */}
                <h3
                  className="font-jakarta font-bold text-[16px] sm:text-[17px] leading-tight"
                  style={{ color: C.tarawera }}
                >
                  Dr. Lena Ruiz
                </h3>

                {/* Specialty */}
                <p
                  className="font-jakarta text-[13px] sm:text-[13.5px] font-medium leading-tight mt-0.5"
                  style={{ color: C.nevada }}
                >
                  Veterinary rehabilitation
                </p>

                {/* Location & Modality */}
                <p
                  className="font-jakarta text-[12px] sm:text-[13px] leading-tight mt-0.5"
                  style={{ color: C.nevada }}
                >
                  San Francisco, CA · In person and virtual
                </p>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2.5 pt-2.5 border-t border-[#DCE5E8]">
                  <span
                    className="font-jakarta text-[11px] sm:text-[12px] font-semibold px-2 py-0.5 rounded-md border"
                    style={{
                      backgroundColor: C.athensGray,
                      borderColor: C.geyser,
                      color: C.firefly,
                    }}
                  >
                    Dogs
                  </span>
                  <span
                    className="font-jakarta text-[11px] sm:text-[12px] font-semibold px-2 py-0.5 rounded-md border"
                    style={{
                      backgroundColor: C.athensGray,
                      borderColor: C.geyser,
                      color: C.firefly,
                    }}
                  >
                    Cats
                  </span>
                  <span
                    className="font-jakarta text-[11px] sm:text-[12px] font-semibold px-2 py-0.5 rounded-md border"
                    style={{
                      backgroundColor: C.athensGray,
                      borderColor: C.geyser,
                      color: C.firefly,
                    }}
                  >
                    Hydrotherapy
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
