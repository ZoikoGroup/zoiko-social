import Image from "next/image";

const DETAILS = [
  { label: "Care type", value: "Facility Boarding" },
  { label: "Experience", value: "8+ years" },
  { label: "Pet types", value: "Dogs" },
  { label: "Location", value: "Hawthorne" },
];

const CARE_FEATURES = [
  "Individual kennels with climate control",
  "Group play time (optional)",
  "Daily outdoor potty breaks",
  "Photo updates twice daily",
  "Medication administration available",
];

/**
 * Focused provider detail card (Happy Paws Boarding), embedded inline
 * below the result cards.
 *
 * Figma: desktop 637:12623 ("DETAIL SECTION"), mobile 637:13052. Photo
 * treatment mirrors ProviderCard: a real photo on desktop, the
 * orange-to-teal gradient on mobile (confirmed via get_design_context on
 * both breakpoints' detail sections).
 */
export default function ProviderDetail() {
  return (
    <div className="flex w-full flex-col items-start gap-8 rounded-[28px] border border-[#dce5e8] bg-white p-6 lg:gap-12 lg:px-12 lg:pb-12 lg:pt-16">
      <div className="flex w-full flex-col items-start gap-6 border-b border-[#dce5e8] pb-8 lg:flex-row lg:gap-6">
        <div
          className="h-[220px] w-full overflow-hidden rounded-[20px] lg:hidden"
          style={{ backgroundImage: "linear-gradient(135deg, #e88924 0%, #066879 100%)" }}
        />
        <div className="hidden h-[220px] w-[252px] shrink-0 overflow-hidden rounded-[20px] lg:block">
          <Image
            src="/market-boarding-sitting-production/happy-paws-boarding-facility-dogs.webp"
            alt="Dogs playing at Happy Paws Boarding facility"
            width={900}
            height={420}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-start gap-3">
          <h2 className="font-jakarta text-[28px] font-extrabold leading-[36px] text-[#102a32] lg:text-[32px] lg:leading-[51.2px]">
            Happy Paws Boarding
          </h2>
          <div className="flex flex-wrap items-start gap-2">
            <span className="rounded-2xl border border-[#e88924] bg-[#fff5e8] px-3 py-[6px] font-jakarta text-[12px] font-semibold uppercase text-[#e88924]">
              Facility Boarding
            </span>
            <span className="rounded-2xl border border-[#e88924] bg-[#fff5e8] px-3 py-[6px] font-jakarta text-[12px] font-semibold uppercase text-[#e88924]">
              ✓ Verified
            </span>
          </div>
          <p className="font-jakarta text-[14px] font-normal leading-[23.8px] text-[#102a32]">
            Happy Paws has been boarding dogs for 8 years in a 3,000 sq ft facility with individual and group care
            options. They focus on safe, comfortable care with daily outdoor time and photo updates.
          </p>

          <div className="grid w-full grid-cols-2 gap-4 rounded-[20px] bg-[#f7f9fa] px-6 py-6">
            {DETAILS.map((detail) => (
              <div key={detail.label} className="flex flex-col items-start gap-1">
                <p className="font-jakarta text-[11px] font-bold uppercase tracking-[0.55px] text-[#5e7076]">
                  {detail.label}
                </p>
                <p className="font-jakarta text-[14px] font-semibold leading-[22.4px] text-[#102a32]">
                  {detail.value}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-6 rounded-[28px] border-2 border-[#066879] bg-[#eef8f9] p-6 lg:flex-row lg:gap-6 lg:p-8">
        <span className="font-jakarta text-[28px] leading-[44.8px]">🐾</span>
        <div className="flex flex-col items-start gap-2">
          <h3 className="font-jakarta text-[16px] font-bold leading-[25.6px] text-[#066879]">
            Your pet&rsquo;s care is your responsibility
          </h3>
          <p className="font-jakarta text-[14px] font-normal leading-[22.4px] text-[#102a32]">
            Always visit in advance. Ask about supervision, safety, and emergency protocols. Trust signals show
            reliability — not guarantees. Board or sit with a provider you feel confident about.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-6 lg:flex-row lg:gap-6">
        <div className="flex w-full flex-1 flex-col items-start gap-4">
          <h3 className="w-full border-b-2 border-[#e88924] pb-2 font-jakarta text-[16px] font-bold leading-[25.6px] text-[#e88924]">
            Care features
          </h3>
          <ul className="flex w-full flex-col items-start">
            {CARE_FEATURES.map((feature) => (
              <li key={feature} className="flex w-full items-start gap-2 py-1 font-jakarta text-[14px] leading-[22.4px]">
                <span className="font-bold text-[#e88924]">✓</span>
                <span className="text-[#102a32]">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex w-full flex-1 flex-col items-start gap-4">
          <h3 className="w-full border-b-2 border-[#e88924] pb-2 font-jakarta text-[16px] font-bold leading-[25.6px] text-[#e88924]">
            Hours &amp; contact
          </h3>
          <p className="font-jakarta text-[14px] leading-[22.4px] text-[#102a32]">
            <span className="font-bold">Phone:</span>{" "}
            <a href="tel:5035551234" className="text-[#e88924] underline">
              (503) 555-1234
            </a>
          </p>
          <p className="font-jakarta text-[14px] leading-[22.4px] text-[#102a32]">
            <span className="font-bold">Website:</span> happypawspdx.com
          </p>
          <p className="font-jakarta text-[14px] leading-[22.4px] text-[#102a32]">
            <span className="font-bold">Hours:</span> Mon–Fri 7am–7pm, Sat 8am–5pm, Sun 8am–4pm
          </p>
          <p className="font-jakarta text-[13px] leading-[20.8px] text-[#5e7076]">
            Advance booking required. Call for availability.
          </p>
        </div>
      </div>
    </div>
  );
}
