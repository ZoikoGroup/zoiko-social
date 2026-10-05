"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import {
  User,
  Search,
  ChevronDown,
  ShieldCheck,
  Clock,
  Check,
  X,
  Pause,
  RotateCcw,
  SlidersHorizontal,
  Info,
  Pencil,
} from "lucide-react";

interface CampaignItem {
  id: string;
  name: string;
  code: string;
  image: string;
  advertiser: string;
  advertiserBadge?: string;
  objective: string;
  submitted: string;
  status:
    | "Changes required"
    | "More information needed"
    | "Paused after approval"
    | "Restricted"
    | "In review"
    | "Not approved"
    | "Reconsideration submitted"
    | "Approved";
  actionText: string;
  isActionRequired?: boolean;
}

const CAMPAIGNS: CampaignItem[] = [
  {
    id: "1",
    name: "Spring Adoption Week",
    code: "CMP-24816",
    image: "/campaign-review/campaign-spring-adoption.png",
    advertiser: "Riverbend Animal Rescue",
    advertiserBadge: "Verified organization",
    objective: "Awareness",
    submitted: "Sep 28, 2026",
    status: "Changes required",
    actionText: "Fix issues",
    isActionRequired: true,
  },
  {
    id: "2",
    name: "Senior Dog Food Launch",
    code: "CMP-24822",
    image: "/campaign-review/campaign-senior-dog-food.png",
    advertiser: "Meadowbrook Pet Nutrition",
    advertiserBadge: "Verified business",
    objective: "Traffic",
    submitted: "Sep 29, 2026",
    status: "More information needed",
    actionText: "Provide info",
    isActionRequired: true,
  },
  {
    id: "3",
    name: "Flea Treatment Promo",
    code: "CMP-24611",
    image: "/campaign-review/campaign-flea-treatment.png",
    advertiser: "Greenfield Pet Pharmacy",
    advertiserBadge: "Verified business",
    objective: "Sales",
    submitted: "Sep 10, 2026",
    status: "Paused after approval",
    actionText: "Resolve issue",
    isActionRequired: true,
  },
  {
    id: "4",
    name: "Holiday Pet Insurance",
    code: "CMP-24760",
    image: "/campaign-review/campaign-holiday-pet-insurance.png",
    advertiser: "Pawsure Insurance",
    advertiserBadge: "Verified business",
    objective: "Leads",
    submitted: "Sep 22, 2026",
    status: "Restricted",
    actionText: "Review restrictions",
    isActionRequired: true,
  },
  {
    id: "5",
    name: "Puppy Class Signups",
    code: "CMP-24830",
    image: "/campaign-review/campaign-puppy-class.png",
    advertiser: "Northside Paws Training Co.",
    advertiserBadge: "Verified practice",
    objective: "Leads",
    submitted: "Sep 30, 2026",
    status: "In review",
    actionText: "View review",
  },
  {
    id: "6",
    name: "Fall Grooming Special",
    code: "CMP-24812",
    image: "/campaign-review/campaign-fall-grooming.png",
    advertiser: "Sofia Reyes Mobile Grooming",
    advertiserBadge: "Verified professional",
    objective: "Sales",
    submitted: "Sep 26, 2026",
    status: "In review",
    actionText: "View review",
  },
  {
    id: "7",
    name: "Exotic Bird Sale",
    code: "CMP-24745",
    image: "/campaign-review/campaign-exotic-bird.png",
    advertiser: "Tropic Wings Ltd",
    advertiserBadge: "Verification pending",
    objective: "Sales",
    submitted: "Sep 25, 2026",
    status: "Not approved",
    actionText: "Review decision",
  },
  {
    id: "8",
    name: "Grain-Free Treats",
    code: "CMP-24590",
    image: "/campaign-review/campaign-grain-free-treats.png",
    advertiser: "Meadowbrook Pet Nutrition",
    advertiserBadge: "Verified business",
    objective: "Sales",
    submitted: "Sep 12, 2026",
    status: "Reconsideration submitted",
    actionText: "View request",
  },
  {
    id: "9",
    name: "Hydrotherapy Open Day",
    code: "CMP-24688",
    image: "/campaign-review/campaign-hydrotherapy.png",
    advertiser: "Harbor Point Veterinary Clinic",
    advertiserBadge: "Verified practice",
    objective: "Traffic",
    submitted: "Sep 20, 2026",
    status: "Approved",
    actionText: "View campaign",
  },
  {
    id: "10",
    name: "Cat Dental Month",
    code: "CMP-24702",
    image: "/campaign-review/campaign-cat-dental.png",
    advertiser: "Harbor Point Veterinary Clinic",
    advertiserBadge: "Verified practice",
    objective: "Awareness",
    submitted: "Sep 18, 2026",
    status: "Approved",
    actionText: "View campaign",
  },
  {
    id: "11",
    name: "Foster Volunteer Drive",
    code: "CMP-24650",
    image: "/campaign-review/campaign-foster-volunteer.png",
    advertiser: "Cityside Cat Rescue",
    advertiserBadge: "Verified organization",
    objective: "Awareness",
    submitted: "Sep 15, 2026",
    status: "Approved",
    actionText: "View campaign",
  },
];

export default function YourCampaignsSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All statuses");
  const [sortBy, setSortBy] = useState<string>("Action required first");

  // Stat cards matching Figma node #1449:636
  const statCards = [
    {
      id: "in-review",
      count: 3,
      label: "In review",
      icon: Search,
      filterValue: "In review",
    },
    {
      id: "action-required",
      count: 4,
      label: "Action required",
      icon: Info,
      filterValue: "Action required",
    },
    {
      id: "approved",
      count: 3,
      label: "Approved",
      icon: Check,
      filterValue: "Approved",
    },
    {
      id: "restricted",
      count: 1,
      label: "Restricted",
      icon: SlidersHorizontal,
      filterValue: "Restricted",
    },
    {
      id: "paused",
      count: 1,
      label: "Paused",
      icon: Pause,
      filterValue: "Paused",
    },
    {
      id: "not-approved",
      count: 1,
      label: "Not approved",
      icon: X,
      filterValue: "Not approved",
    },
  ];

  const handleCardClick = (filterValue: string) => {
    if (selectedStatus === filterValue) {
      setSelectedStatus("All statuses");
    } else {
      setSelectedStatus(filterValue);
    }
  };

  const filteredCampaigns = useMemo(() => {
    let result = CAMPAIGNS.filter((c) => {
      // Status filter
      if (selectedStatus === "Action required" && !c.isActionRequired) return false;
      if (
        selectedStatus === "In review" &&
        c.status !== "In review" &&
        c.status !== "Reconsideration submitted"
      )
        return false;
      if (selectedStatus === "Approved" && c.status !== "Approved") return false;
      if (selectedStatus === "Restricted" && c.status !== "Restricted") return false;
      if (selectedStatus === "Paused" && c.status !== "Paused after approval") return false;
      if (selectedStatus === "Not approved" && c.status !== "Not approved") return false;

      // Search filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.advertiser.toLowerCase().includes(q) ||
          c.objective.toLowerCase().includes(q)
        );
      }
      return true;
    });

    // Sorting
    if (sortBy === "Action required first") {
      result = [...result].sort((a, b) => {
        if (a.isActionRequired && !b.isActionRequired) return -1;
        if (!a.isActionRequired && b.isActionRequired) return 1;
        return 0;
      });
    }

    return result;
  }, [selectedStatus, searchQuery, sortBy]);

  const renderStatusPill = (status: CampaignItem["status"]) => {
    switch (status) {
      case "Changes required":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF5E8] border border-[#E88924] text-[#9A4F16] font-jakarta font-semibold text-[12px]">
            <Pencil className="w-3.5 h-3.5 text-[#E88924]" />
            <span>{status}</span>
          </span>
        );
      case "More information needed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF5E8] border border-[#E88924] text-[#9A4F16] font-jakarta font-semibold text-[12px]">
            <Info className="w-3.5 h-3.5 text-[#E88924]" />
            <span>{status}</span>
          </span>
        );
      case "Paused after approval":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF5E8] border border-[#E88924] text-[#9A4F16] font-jakarta font-semibold text-[12px]">
            <Pause className="w-3.5 h-3.5 text-[#E88924]" />
            <span>{status}</span>
          </span>
        );
      case "Restricted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#066879] text-[#073B47] font-jakarta font-semibold text-[12px]">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#066879]" />
            <span>{status}</span>
          </span>
        );
      case "In review":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEF8F9] border border-[#D0E6E9] text-[#073B47] font-jakarta font-semibold text-[12px]">
            <Search className="w-3.5 h-3.5 text-[#066879]" />
            <span>{status}</span>
          </span>
        );
      case "Not approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#073B47] text-white font-jakarta font-semibold text-[12px]">
            <X className="w-3.5 h-3.5 text-white" />
            <span>{status}</span>
          </span>
        );
      case "Reconsideration submitted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-dashed border-[#066879] text-[#073B47] font-jakarta font-semibold text-[12px]">
            <RotateCcw className="w-3.5 h-3.5 text-[#066879]" />
            <span>{status}</span>
          </span>
        );
      case "Approved":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#066879] text-white font-jakarta font-semibold text-[12px]">
            <Check className="w-3.5 h-3.5 text-white" />
            <span>{status}</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <section id="your-campaigns" className="w-full bg-white py-14 sm:py-16 lg:py-20 border-b border-[#DCE5E8]">
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-[105px]">
        {/* Header Block */}
        <div>
          <h2 className="font-jakarta font-extrabold text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.15] text-[#073B47] tracking-[-0.02em]">
            Your campaigns
          </h2>
          <p className="font-jakarta text-[15px] sm:text-[16px] text-[#5E7076] mt-2">
            Your review dashboard. Action-required campaigns come first.
          </p>

          {/* User session line matching Figma #1449:629 */}
          <div className="flex items-center gap-2.5 mt-5 text-[13.5px] font-jakarta text-[#5B6B79]">
            <User className="w-4 h-4 text-[#066879] shrink-0" />
            <span>
              Signed in as <strong className="font-bold text-[#102A32]">Ana Lee</strong> · Riverbend Animal
              Rescue and 4 client accounts · Updated October 1, 2026, 9:42 AM
            </span>
          </div>
        </div>

        {/* 6 Stat Summary Cards matching Figma #1449:636 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3 mt-6 mb-7">
          {statCards.map((card) => {
            const Icon = card.icon;
            const isSelected = selectedStatus === card.filterValue;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handleCardClick(card.filterValue)}
                className={`text-left bg-white rounded-[20px] p-3 sm:p-[17px] border transition-all ${
                  isSelected
                    ? "border-[#066879] ring-2 ring-[#066879]/20 shadow-xs"
                    : "border-[#DCE5E8] hover:border-[#B2CAD0] hover:shadow-2xs"
                }`}
              >
                <div className="font-jakarta font-bold text-[22px] sm:text-[26px] leading-[22px] sm:leading-[26px] text-[#073B47] mb-2">
                  {card.count}
                </div>
                <div className="flex items-center gap-1.5 font-jakarta font-semibold text-[12px] sm:text-[13px] leading-[18px] sm:leading-[20.8px] text-[#5B6B79]">
                  <Icon className="w-3.5 h-3.5 text-[#5B6B79] shrink-0" />
                  <span className="truncate">{card.label}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Filter Controls Row with explicit labels matching Figma #1449:698 */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end mb-4">
          {/* Search Box */}
          <div className="flex-1">
            <label className="block text-[13px] font-semibold text-[#5B6B79] mb-1.5 font-jakarta">
              Search campaigns
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Campaign name, ID or advertiser"
                className="w-full h-[46px] px-3.5 rounded-[12px] bg-white border border-[#DCE5E8] text-[13.5px] font-jakarta placeholder:text-[#8E9B9F] focus:outline-none focus:border-[#066879] transition-colors"
              />
            </div>
          </div>

          {/* Status Dropdown */}
          <div className="w-full sm:w-[220px]">
            <label className="block text-[13px] font-semibold text-[#5B6B79] mb-1.5 font-jakarta">
              Status
            </label>
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full h-[46px] appearance-none pl-3.5 pr-8 rounded-[12px] bg-white border border-[#DCE5E8] text-[13px] font-jakarta font-medium text-[#102A32] focus:outline-none focus:border-[#066879] cursor-pointer"
              >
                <option value="All statuses">All statuses</option>
                <option value="Action required">Action required</option>
                <option value="In review">In review</option>
                <option value="Approved">Approved</option>
                <option value="Restricted">Restricted</option>
                <option value="Paused">Paused</option>
                <option value="Not approved">Not approved</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#5E7076] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full sm:w-[200px]">
            <label className="block text-[13px] font-semibold text-[#5B6B79] mb-1.5 font-jakarta">
              Sort
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full h-[46px] appearance-none pl-3.5 pr-8 rounded-[12px] bg-white border border-[#DCE5E8] text-[13px] font-jakarta font-medium text-[#102A32] focus:outline-none focus:border-[#066879] cursor-pointer"
              >
                <option value="Action required first">Action required first</option>
                <option value="Newest first">Newest first</option>
                <option value="Oldest first">Oldest first</option>
              </select>
              <ChevronDown className="w-4 h-4 text-[#5E7076] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Counter & Mobile Scroll Hint */}
        <div className="mb-3 flex items-center justify-between text-[12px] font-jakarta text-[#5B6B79]">
          <span>Showing {filteredCampaigns.length} of {CAMPAIGNS.length} campaigns</span>
          <span className="sm:hidden text-[11px] text-[#066879] flex items-center gap-1 font-semibold">
            Scroll table →
          </span>
        </div>

        {/* Table Container */}
        <div className="w-full overflow-x-auto rounded-[20px] border border-[#DCE5E8] bg-white shadow-2xs">
          <table className="w-full border-collapse text-left font-jakarta text-[13px]">
            {/* Header with Title Case column names, ending with 'Updated' */}
            <thead>
              <tr className="bg-[#F7F9FA] border-b border-[#DCE5E8] text-[#5B6B79] font-semibold text-[13px]">
                <th className="py-3 px-4 min-w-[280px]">Campaign</th>
                <th className="py-3 px-4 min-w-[200px]">Advertiser</th>
                <th className="py-3 px-4 min-w-[130px]">Objective</th>
                <th className="py-3 px-4 min-w-[130px]">Submitted</th>
                <th className="py-3 px-4 min-w-[220px]">Status</th>
                <th className="py-3 px-4 min-w-[170px] text-right">Updated</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody className="divide-y divide-[#DCE5E8]">
              {filteredCampaigns.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-[#F7F9FA]/80 transition-colors group"
                >
                  {/* Campaign column (Image + Title + CMP Code) */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-[10px] overflow-hidden bg-[#EEF8F9] shrink-0 border border-[#DCE5E8]">
                        <Image
                          src={row.image}
                          alt={row.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-[13.5px] text-[#073B47] group-hover:text-[#066879] transition-colors">
                          {row.name}
                        </div>
                        <div className="text-[11.5px] text-[#5E7076] mt-0.5">
                          {row.code}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Advertiser column */}
                  <td className="py-4 px-4">
                    <div className="text-[13px] text-[#102A32] leading-tight font-medium">
                      {row.advertiser}
                    </div>
                    {row.advertiserBadge && (
                      <div
                        className={`inline-flex items-center gap-1 text-[11px] font-medium mt-1 ${
                          row.advertiserBadge === "Verification pending"
                            ? "text-[#C25E30]"
                            : "text-[#066879]"
                        }`}
                      >
                        {row.advertiserBadge === "Verification pending" ? (
                          <Clock className="w-3 h-3 text-[#C25E30]" />
                        ) : (
                          <ShieldCheck className="w-3 h-3 text-[#066879]" />
                        )}
                        <span>{row.advertiserBadge}</span>
                      </div>
                    )}
                  </td>

                  {/* Objective */}
                  <td className="py-4 px-4 text-[#102A32] font-medium">
                    {row.objective}
                  </td>

                  {/* Submitted */}
                  <td className="py-4 px-4 text-[#5E7076]">
                    {row.submitted}
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4">
                    {renderStatusPill(row.status)}
                  </td>

                  {/* Action / Updated Button (NO arrow icon, solid teal for action required, white outline for view) */}
                  <td className="py-4 px-4 text-right">
                    {row.isActionRequired ? (
                      <button
                        type="button"
                        className="inline-flex items-center justify-center px-4 py-2 rounded-[10px] bg-[#0B5C68] hover:bg-[#073B47] text-white font-jakarta font-bold text-[12.5px] transition-all shadow-2xs whitespace-nowrap"
                      >
                        {row.actionText}
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="inline-flex items-center justify-center px-4 py-2 rounded-[10px] bg-white hover:bg-[#F7F9FA] text-[#073B47] border border-[#DCE5E8] font-jakarta font-medium text-[12.5px] transition-all whitespace-nowrap"
                      >
                        {row.actionText}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
