"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

const NAV_ITEMS = [
  { id: "standards-1", number: "1.", title: "Core principles" },
  { id: "standards-2", number: "2.", title: "Prohibited and restricted categories" },
  { id: "standards-3", number: "3.", title: "Who can advertise" },
  { id: "standards-4", number: "4.", title: "Claims and evidence" },
  { id: "standards-5", number: "5.", title: "Creative and copy" },
  { id: "standards-6", number: "6.", title: "Landing pages and destinations" },
  { id: "standards-7", number: "7.", title: "Special review categories" },
  { id: "standards-8", number: "8.", title: "Animal welfare and commerce" },
  { id: "standards-9", number: "9.", title: "Targeting and privacy" },
  { id: "standards-10", number: "10.", title: "Ad labeling and transparency" },
  { id: "standards-11", number: "11.", title: "Under-18s and family safety" },
  { id: "standards-12", number: "12.", title: "News and editorial separation" },
  { id: "standards-13", number: "13.", title: "Accessible ads" },
  { id: "standards-14", number: "14.", title: "Review, enforcement and appeals" },
  { id: "standards-15", number: "15.", title: "Versions and regions" },
];

export default function TheStandards() {
  const [activeSection, setActiveSection] = useState("standards-1");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180;
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -100;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section id="the-standards" className="w-full bg-white py-10 sm:py-16 lg:py-24 border-b border-[#DCE5E8]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-[105px]">
        {/* Mobile / Tablet Quick Navigation Bar (< lg) */}
        <div className="lg:hidden w-full mb-8 sticky top-0 z-20 bg-white/95 backdrop-blur-sm py-2.5 border-b border-[#DCE5E8]">
          <div className="flex items-center justify-between gap-2 mb-1.5 px-0.5">
            <span className="text-xs font-bold text-[#5E7076] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
              Jump to standard
            </span>
            <span className="text-xs font-semibold text-[#066879]">
              Section 1–15
            </span>
          </div>
          <div className="relative">
            <select
              aria-label="Jump to standard section"
              value={activeSection}
              onChange={(e) => scrollToSection(e.target.value)}
              className="w-full appearance-none bg-[#F7F9FA] border border-[#DCE5E8] rounded-xl px-4 py-2.5 pr-9 text-sm font-bold text-[#073B47] hover:border-[#066879] focus:outline-none focus:ring-1 focus:ring-[#066879] cursor-pointer"
            >
              {NAV_ITEMS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.number} {item.title}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#5E7076]">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-14 items-start">
          {/* Left Column: Sticky Sidebar Nav (Desktop only) */}
          <aside className="hidden lg:block w-[280px] sticky top-24 flex-shrink-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3 pb-2">
              <svg className="w-4 h-4 text-[#5E7076]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs font-bold text-[#5E7076] uppercase tracking-wider font-['Plus_Jakarta_Sans',sans-serif]">
                The Standards
              </span>
            </div>

            {/* Nav Links */}
            <nav className="border-l-2 border-[#DCE5E8] flex flex-col space-y-0.5">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`text-left px-3.5 py-2 text-[13.5px] leading-snug transition-colors rounded-r-lg border-l-2 -ml-[2px] ${
                      isActive
                        ? "border-[#E88924] bg-[#EEF8F9] text-[#073B47] font-bold"
                        : "border-transparent text-[#5E7076] hover:text-[#102A32] font-medium"
                    }`}
                  >
                    <span className="mr-1.5 text-xs text-[#C9701A] font-extrabold">{item.number}</span>
                    <span>{item.title}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Right Column: Detailed 15 Sections */}
          <div className="flex-1 max-w-[900px] flex flex-col gap-14 sm:gap-16">
            {/* 1. Core principles */}
            <article id="standards-1" className="scroll-mt-24 border-b border-[#DCE5E8] pb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-lg font-extrabold text-[#C9701A] font-['Plus_Jakarta_Sans',sans-serif]">1.</span>
                <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#073B47] font-['Plus_Jakarta_Sans',sans-serif]">
                  Core principles
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">1.1</span>
                    <span>Truthful</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Ads must not mislead through words, images, pricing, credentials, urgency or what happens after the click.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">1.2</span>
                    <span>Clearly paid</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Every ad carries a persistent Sponsored label. See Section 10.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">1.3</span>
                    <span>Animal-aligned</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    The advertiser and what they offer must fit Zoiko Social&apos;s purpose: the care, welfare and enjoyment of animals.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">1.4</span>
                    <span>Welfare-first</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    No commercial goal justifies harm to animals, unsafe transfers or exploitative imagery.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">1.5</span>
                    <span>Same rules for everyone</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Higher spend, sponsorships, partnerships or sales relationships never change these standards.
                  </p>
                </div>
              </div>
            </article>

            {/* 2. Prohibited and restricted categories */}
            <article id="standards-2" className="scroll-mt-24 border-b border-[#DCE5E8] pb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-lg font-extrabold text-[#C9701A] font-['Plus_Jakarta_Sans',sans-serif]">2.</span>
                <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#073B47] font-['Plus_Jakarta_Sans',sans-serif]">
                  Prohibited and restricted categories
                </h2>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">2.1</span>
                    <span>Live animal sales</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Ads can&apos;t sell, ship or transfer live animals. Adoption runs through verified rescues and the Adopt section instead.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">2.2</span>
                    <span>Cruelty, fighting and trafficking</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Prohibited, along with illegal wildlife trade and protected species.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">2.3</span>
                    <span>Restricted categories</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Fundraising, veterinary services, medication, supplements, insurance and children-directed ads need extra review and may run with conditions.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">2.4</span>
                    <span>Separate policy decisions</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Political and issue ads, alcohol, nicotine, gambling, weapons, adult content and crypto are not available on Zoiko Social at this time.
                  </p>
                </div>
              </div>

              {/* Category Table */}
              <div className="border border-[#DCE5E8] rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F7F9FA] border-b border-[#DCE5E8]">
                        <th className="py-3 px-4 text-xs font-semibold text-[#5E7076] uppercase">Category</th>
                        <th className="py-3 px-4 text-xs font-semibold text-[#5E7076] uppercase">Treatment</th>
                        <th className="py-3 px-4 text-xs font-semibold text-[#5E7076] uppercase">Why</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DCE5E8] text-sm text-[#102A32]">
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-[#073B47]">Live animal sales</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF1F2] text-[#9F1239] border border-[#FDA4AF]">
                            Prohibited
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#5E7076]">Bypasses adoption and welfare safeguards</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-[#073B47]">Animal cruelty or fighting</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF1F2] text-[#9F1239] border border-[#FDA4AF]">
                            Prohibited
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#5E7076]">Direct harm to animals</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-[#073B47]">Breeding services</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF5E8] text-[#7A430B] border border-[#E88924]/40">
                            Special review
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#5E7076]">Welfare and lineage claims need review</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-[#073B47]">Fundraising</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF5E8] text-[#7A430B] border border-[#E88924]/40">
                            Special review
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#5E7076]">Verified organization and payment transparency</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-[#073B47]">Pet insurance</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF5E8] text-[#7A430B] border border-[#E88924]/40">
                            Special review
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#5E7076]">Regulated product, licensed regions only</td>
                      </tr>
                      <tr>
                        <td className="py-3.5 px-4 font-bold text-[#073B47]">Political or issue ads</td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F3F4F6] text-[#4B5563] border border-[#D1D5DB]">
                            Separate policy
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#5E7076]">Not currently accepted</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </article>

            {/* 3. Who can advertise */}
            <article id="standards-3" className="scroll-mt-24 border-b border-[#DCE5E8] pb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-lg font-extrabold text-[#C9701A] font-['Plus_Jakarta_Sans',sans-serif]">3.</span>
                <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#073B47] font-['Plus_Jakarta_Sans',sans-serif]">
                  Who can advertise
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">3.1</span>
                    <span>Verified advertisers</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Advertisers must complete Professional or Organization Verification before ads run. Verification and ad review are separate decisions.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">3.2</span>
                    <span>Agencies</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Agencies can run ads for a client with written authorization. The client remains the advertiser of record.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">3.3</span>
                    <span>Who can&apos;t advertise</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Accounts with active safety or welfare restrictions, and businesses outside the categories in Section 2.
                  </p>
                </div>
              </div>
            </article>

            {/* 4. Claims and evidence */}
            <article id="standards-4" className="scroll-mt-24 border-b border-[#DCE5E8] pb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-lg font-extrabold text-[#C9701A] font-['Plus_Jakarta_Sans',sans-serif]">4.</span>
                <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#073B47] font-['Plus_Jakarta_Sans',sans-serif]">
                  Claims and evidence
                </h2>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">4.1</span>
                    <span>Back up what you say</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Claims about results, health, price or credentials must be accurate and supported.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">4.2</span>
                    <span>Health and welfare claims</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Don&apos;t promise health outcomes you can&apos;t guarantee, like “guaranteed healthy” or “cures anxiety”. Describe what you actually provide.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">4.3</span>
                    <span>Prices and offers</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Show the full price, including required fees. Offers must have clear end dates and terms.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">4.4</span>
                    <span>Professional endorsements</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    “Vet recommended” and similar claims need evidence of who recommends it and on what basis.
                  </p>
                </div>
              </div>

              {/* Comparative Visual Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Allowed */}
                <div className="border border-[#DCE5E8] rounded-2xl overflow-hidden bg-white shadow-xs">
                  <div className="relative w-full h-[150px] bg-[#E5E7EB]">
                    <Image
                      src="/advertising-standards/claim-allowed.png"
                      alt="Allowed claim sample"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F0FDF4] text-[#166534] border border-[#86EFAC] mb-2">
                      <svg className="w-3.5 h-3.5 text-[#166534]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Allowed</span>
                    </div>
                    <p className="text-sm font-semibold text-[#102A32] italic">
                      &ldquo;Every adopted pet has a vet health check first.&rdquo;
                    </p>
                  </div>
                </div>

                {/* Not Allowed */}
                <div className="border border-[#DCE5E8] rounded-2xl overflow-hidden bg-white shadow-xs">
                  <div className="relative w-full h-[150px] bg-[#E5E7EB]">
                    <Image
                      src="/advertising-standards/claim-disallowed.png"
                      alt="Disallowed claim sample"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF1F2] text-[#9F1239] border border-[#FDA4AF] mb-2">
                      <svg className="w-3.5 h-3.5 text-[#E11D48]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Not allowed</span>
                    </div>
                    <p className="text-sm font-semibold text-[#102A32] italic">
                      &ldquo;Adopt now and get a guaranteed healthy pet.&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* 5. Creative and copy */}
            <article id="standards-5" className="scroll-mt-24 border-b border-[#DCE5E8] pb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-lg font-extrabold text-[#C9701A] font-['Plus_Jakarta_Sans',sans-serif]">5.</span>
                <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#073B47] font-['Plus_Jakarta_Sans',sans-serif]">
                  Creative and copy
                </h2>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">5.1</span>
                    <span>Images and video</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Use real, respectful imagery. No graphic injury, distressed animals for shock value, or images of animals in unsafe situations.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">5.2</span>
                    <span>Language</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    No profanity, harassment, discrimination or false urgency like “last chance before euthanasia”.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">5.3</span>
                    <span>No impersonation</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Don&apos;t copy Zoiko Social branding, verified badges or another organization&apos;s identity. AI-generated people or animals must be disclosed.
                  </p>
                </div>
              </div>

              {/* Comparative Visual Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Allowed */}
                <div className="border border-[#DCE5E8] rounded-2xl overflow-hidden bg-white shadow-xs">
                  <div className="relative w-full h-[150px] bg-[#E5E7EB]">
                    <Image
                      src="/advertising-standards/creative-safe-setting.png"
                      alt="Safe setting imagery"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F0FDF4] text-[#166534] border border-[#86EFAC] mb-2">
                      <svg className="w-3.5 h-3.5 text-[#166534]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Allowed</span>
                    </div>
                    <p className="text-sm font-semibold text-[#102A32]">
                      Happy, healthy animals in safe settings.
                    </p>
                  </div>
                </div>

                {/* Not Allowed */}
                <div className="border border-[#DCE5E8] rounded-2xl overflow-hidden bg-white shadow-xs">
                  <div className="relative w-full h-[150px] bg-[#E5E7EB]">
                    <Image
                      src="/advertising-standards/creative-fake-badge.png"
                      alt="Fake badge disallowed"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF1F2] text-[#9F1239] border border-[#FDA4AF] mb-2">
                      <svg className="w-3.5 h-3.5 text-[#E11D48]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Not allowed</span>
                    </div>
                    <p className="text-sm font-semibold text-[#102A32]">
                      A fake Verified badge or Zoiko Social logo in the ad.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* 6. Landing pages and destinations */}
            <article id="standards-6" className="scroll-mt-24 border-b border-[#DCE5E8] pb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-lg font-extrabold text-[#C9701A] font-['Plus_Jakarta_Sans',sans-serif]">6.</span>
                <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#073B47] font-['Plus_Jakarta_Sans',sans-serif]">
                  Landing pages and destinations
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">6.1</span>
                    <span>Match the ad</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    The landing page must match what the ad promises. An adoption ad can&apos;t open a general donation page.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">6.2</span>
                    <span>Safe and working</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    No broken pages, malware, hidden fees, unexpected redirects or required downloads.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">6.3</span>
                    <span>Material changes</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Changing the landing page after approval sends the ad back to review, and may pause it.
                  </p>
                </div>
              </div>
            </article>

            {/* 7. Special review categories */}
            <article id="standards-7" className="scroll-mt-24 border-b border-[#DCE5E8] pb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-lg font-extrabold text-[#C9701A] font-['Plus_Jakarta_Sans',sans-serif]">7.</span>
                <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#073B47] font-['Plus_Jakarta_Sans',sans-serif]">
                  Special review categories
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">7.1</span>
                    <span>Veterinary services</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Needs a verified veterinary professional or practice, licensed in the regions shown.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">7.2</span>
                    <span>Fundraising</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Needs a verified organization, a clear beneficiary and transparent payment details.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">7.3</span>
                    <span>Financial and insurance products</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Allowed only in regions where the advertiser is licensed, for adults 18 and over, with policy terms linked.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">7.4</span>
                    <span>Nutrition and supplements</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Claims need substantiation, and must not suggest treating illness.
                  </p>
                </div>
              </div>
            </article>

            {/* 8. Animal welfare and commerce */}
            <article id="standards-8" className="scroll-mt-24 border-b border-[#DCE5E8] pb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-lg font-extrabold text-[#C9701A] font-['Plus_Jakarta_Sans',sans-serif]">8.</span>
                <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#073B47] font-['Plus_Jakarta_Sans',sans-serif]">
                  Animal welfare and commerce
                </h2>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">8.1</span>
                    <span>No bypassing safeguards</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Ads can&apos;t create a route around adoption, foster or marketplace welfare checks.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">8.2</span>
                    <span>Training methods</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    No promotion of cruel, abusive or unsafe methods, such as shock collars.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">8.3</span>
                    <span>Transport</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    No unsafe or unlawful animal transport services.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">8.4</span>
                    <span>Rescue urgency</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    No invented emergencies to drive clicks or donations.
                  </p>
                </div>
              </div>

              {/* The Welfare Firewall Callout Banner */}
              <div className="bg-[#073B47] rounded-2xl p-6 sm:p-7 text-white flex items-start gap-4 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-[#E88924]">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white mb-1.5">
                    The welfare firewall
                  </h4>
                  <p className="text-sm sm:text-[14.5px] leading-[23px] text-[#CFE6EA]">
                    Paid ads can raise awareness of verified rescues and adoption events. They can never buy a higher place in adoption listings or override welfare and safety review.
                  </p>
                </div>
              </div>
            </article>

            {/* 9. Targeting and privacy */}
            <article id="standards-9" className="scroll-mt-24 border-b border-[#DCE5E8] pb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-lg font-extrabold text-[#C9701A] font-['Plus_Jakarta_Sans',sans-serif]">9.</span>
                <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#073B47] font-['Plus_Jakarta_Sans',sans-serif]">
                  Targeting and privacy
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">9.1</span>
                    <span>Respectful targeting</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Target by interests, broad location and age. Never by health, religion, ethnicity, sexuality or other sensitive traits.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">9.2</span>
                    <span>Your own audience lists</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Upload customer lists only if you have consent to use them for advertising, and can show where they came from.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">9.3</span>
                    <span>Location</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Use city or region targeting. Precise location targeting isn&apos;t available.
                  </p>
                </div>
              </div>
            </article>

            {/* 10. Ad labeling and transparency */}
            <article id="standards-10" className="scroll-mt-24 border-b border-[#DCE5E8] pb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-lg font-extrabold text-[#C9701A] font-['Plus_Jakarta_Sans',sans-serif]">10.</span>
                <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#073B47] font-['Plus_Jakarta_Sans',sans-serif]">
                  Ad labeling and transparency
                </h2>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">10.1</span>
                    <span>Always labeled</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Every ad shows Sponsored, plus the advertiser&apos;s verified name, in every placement.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">10.2</span>
                    <span>Can&apos;t be hidden</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Labels can&apos;t be covered, shrunk, recolored to blend in, or removed by the creative.
                  </p>
                </div>
              </div>

              {/* 3 Visual Ad Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Sample 1: Pass */}
                <div className="flex flex-col gap-2">
                  <div className="border border-[#DCE5E8] rounded-2xl bg-white overflow-hidden shadow-xs">
                    <div className="p-2.5 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full overflow-hidden relative flex-shrink-0">
                        <Image
                          src="/advertising-standards/label-rescue-avatar.png"
                          alt="Avatar"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className="text-xs font-bold text-[#102A32] truncate">Riverbend Animal Rescue</span>
                        <span className="text-[10.5px] text-[#5E7076]">Ad · Verified organization</span>
                      </div>
                    </div>

                    <div className="relative w-full h-[110px] bg-gradient-to-br from-[#066879] to-[#E88924] overflow-hidden">
                      <Image
                        src="/advertising-standards/label-card-animals.png"
                        alt="Rescue animals"
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="p-2.5 flex items-center justify-between">
                      <span className="text-xs text-[#102A32] font-semibold">Adopt a friend</span>
                      <span className="px-2.5 py-1 bg-[#066879] text-white text-[11px] font-semibold rounded-md">
                        Adopt
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-1 text-xs font-semibold text-[#073B47]">
                    <svg className="w-4 h-4 text-[#066879]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Label and name clearly shown</span>
                  </div>
                </div>

                {/* Sample 2: Missing Sponsored Label */}
                <div className="flex flex-col gap-2">
                  <div className="border border-[#DCE5E8] rounded-2xl bg-white overflow-hidden shadow-xs">
                    <div className="p-2.5 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full overflow-hidden relative flex-shrink-0">
                        <Image
                          src="/advertising-standards/label-rescue-avatar.png"
                          alt="Avatar"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className="text-xs font-bold text-[#102A32] truncate">Riverbend Animal Rescue</span>
                        <span className="text-[10.5px] text-[#5E7076]">Verified organization</span>
                      </div>
                    </div>

                    <div className="relative w-full h-[110px] bg-gradient-to-br from-[#066879] to-[#E88924] overflow-hidden">
                      <Image
                        src="/advertising-standards/label-card-animals.png"
                        alt="Rescue animals"
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="p-2.5 flex items-center justify-between">
                      <span className="text-xs text-[#102A32] font-semibold">Adopt a friend</span>
                      <span className="px-2.5 py-1 bg-[#066879] text-white text-[11px] font-semibold rounded-md">
                        Adopt
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-1 text-xs font-semibold text-[#7A430B]">
                    <svg className="w-4 h-4 text-[#E88924]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Missing Sponsored label</span>
                  </div>
                </div>

                {/* Sample 3: Looks like news */}
                <div className="flex flex-col gap-2">
                  <div className="border border-[#DCE5E8] rounded-2xl bg-white overflow-hidden shadow-xs">
                    <div className="p-2.5 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full overflow-hidden relative flex-shrink-0">
                        <Image
                          src="/advertising-standards/label-news-avatar.png"
                          alt="Avatar"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col leading-tight">
                        <span className="text-xs font-bold text-[#102A32] truncate">Zoiko Social News</span>
                        <span className="text-[10.5px] text-[#5E7076]">News</span>
                      </div>
                    </div>

                    <div className="px-2.5 py-1 text-xs font-bold text-[#102A32] leading-tight">
                      Breaking: the best flea treatment of 2026.
                    </div>

                    <div className="relative w-full h-[85px] bg-[#E5E7EB] overflow-hidden">
                      <Image
                        src="/advertising-standards/label-news-dog.png"
                        alt="News lookalike"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-1 text-xs font-semibold text-[#7A430B]">
                    <svg className="w-4 h-4 text-[#E88924]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span>Looks like news</span>
                  </div>
                </div>
              </div>
            </article>

            {/* 11. Under-18s and family safety */}
            <article id="standards-11" className="scroll-mt-24 border-b border-[#DCE5E8] pb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-lg font-extrabold text-[#C9701A] font-['Plus_Jakarta_Sans',sans-serif]">11.</span>
                <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#073B47] font-['Plus_Jakarta_Sans',sans-serif]">
                  Under-18s and family safety
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">11.1</span>
                    <span>Ads seen by under-18s</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Only Generally allowed categories can reach members under 18. Restricted categories are adults-only.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">11.2</span>
                    <span>No targeting minors</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Ads can&apos;t be targeted at members under 18 based on their activity.
                  </p>
                </div>
              </div>
            </article>

            {/* 12. News and editorial separation */}
            <article id="standards-12" className="scroll-mt-24 border-b border-[#DCE5E8] pb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-lg font-extrabold text-[#C9701A] font-['Plus_Jakarta_Sans',sans-serif]">12.</span>
                <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#073B47] font-['Plus_Jakarta_Sans',sans-serif]">
                  News and editorial separation
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">12.1</span>
                    <span>Ads never look like news</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Ads can&apos;t copy news layouts, use “Breaking” framing, or imitate verified news sources.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">12.2</span>
                    <span>No paid placement</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Advertising relationships can&apos;t buy, influence or reorder verified news.
                  </p>
                </div>
              </div>
            </article>

            {/* 13. Accessible ads */}
            <article id="standards-13" className="scroll-mt-24 border-b border-[#DCE5E8] pb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-lg font-extrabold text-[#C9701A] font-['Plus_Jakarta_Sans',sans-serif]">13.</span>
                <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#073B47] font-['Plus_Jakarta_Sans',sans-serif]">
                  Accessible ads
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">13.1</span>
                    <span>Readable and usable</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Add alt text to images, captions to videos with speech, and keep text readable against the background.
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">13.2</span>
                    <span>No flashing</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Nothing that flashes more than three times a second.
                  </p>
                </div>
              </div>
            </article>

            {/* 14. Review, enforcement and appeals */}
            <article id="standards-14" className="scroll-mt-24 border-b border-[#DCE5E8] pb-12">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-lg font-extrabold text-[#C9701A] font-['Plus_Jakarta_Sans',sans-serif]">14.</span>
                <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#073B47] font-['Plus_Jakarta_Sans',sans-serif]">
                  Review, enforcement and appeals
                </h2>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">14.1</span>
                    <span>How ads are reviewed</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Every ad is reviewed before it runs. Ads can be rechecked after launch if they change or if concerns are reported. See{" "}
                    <a href="/for-business/campaign-review" className="font-semibold underline text-[#066879] hover:text-[#055765]">
                      Campaign Review
                    </a>
                    .
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">14.2</span>
                    <span>Reconsideration</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    If you think a decision is wrong, you can ask for one reconsideration by a different reviewer.
                  </p>
                </div>
              </div>

              {/* 5 Status Badges / Action Chips */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
                {/* Note */}
                <div className="border border-[#DCE5E8] rounded-xl p-3 flex flex-col gap-1.5 bg-white">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EEF8F9] text-[#073B47] border border-[#066879]/30 w-fit">
                    Note
                  </span>
                  <span className="text-xs text-[#102A32] leading-tight">A tip, no change needed</span>
                </div>

                {/* Change */}
                <div className="border border-[#DCE5E8] rounded-xl p-3 flex flex-col gap-1.5 bg-white">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF5E8] text-[#7A430B] border border-[#E88924] w-fit">
                    Change
                  </span>
                  <span className="text-xs text-[#102A32] leading-tight">Fix before it runs</span>
                </div>

                {/* Restrict */}
                <div className="border border-[#DCE5E8] rounded-xl p-3 flex flex-col gap-1.5 bg-white">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white text-[#073B47] border border-[#066879] w-fit">
                    Restrict
                  </span>
                  <span className="text-xs text-[#102A32] leading-tight">Runs with conditions</span>
                </div>

                {/* Pause */}
                <div className="border border-[#DCE5E8] rounded-xl p-3 flex flex-col gap-1.5 bg-white">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FFF5E8] text-[#7A430B] border border-[#E88924]/50 w-fit">
                    Pause
                  </span>
                  <span className="text-xs text-[#102A32] leading-tight">Stopped while resolved</span>
                </div>

                {/* Remove */}
                <div className="border border-[#DCE5E8] rounded-xl p-3 flex flex-col gap-1.5 bg-white">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#073B47] text-white border border-[#073B47] w-fit">
                    Remove
                  </span>
                  <span className="text-xs text-[#102A32] leading-tight">No longer eligible</span>
                </div>
              </div>
            </article>

            {/* 15. Versions and regions */}
            <article id="standards-15" className="scroll-mt-24 pb-6">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-lg font-extrabold text-[#C9701A] font-['Plus_Jakarta_Sans',sans-serif]">15.</span>
                <h2 className="text-2xl sm:text-[28px] font-extrabold text-[#073B47] font-['Plus_Jakarta_Sans',sans-serif]">
                  Versions and regions
                </h2>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">15.1</span>
                    <span>Current version</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Version 3.2, effective September 1, 2026, applies in all regions where Zoiko Social ads run.
                  </p>
                </div>

                <div id="standards-15-2" className="scroll-mt-28 p-4 rounded-xl bg-[#F7F9FA] border border-[#DCE5E8]">
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#C9701A]">15.2</span>
                    <span>What changed in 3.2</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Added the welfare firewall (Section 8), clarified insurance rules (Section 7.3), and banned AI impersonation (Section 5.3).
                  </p>
                </div>

                <div>
                  <h3 className="text-[16.5px] font-bold text-[#073B47] mb-1.5 flex items-baseline gap-2">
                    <span className="text-sm font-semibold text-[#5E7076]">15.3</span>
                    <span>Earlier versions</span>
                  </h3>
                  <p className="text-base leading-[27px] text-[#102A32]">
                    Version 3.1 applied from March 1, 2026 to August 31, 2026. Campaigns submitted before September 1 were reviewed under 3.1.
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
