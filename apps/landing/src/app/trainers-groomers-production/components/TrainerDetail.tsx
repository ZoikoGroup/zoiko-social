import Image from "next/image";

const DETAILS = [
  { label: "Verified", value: "✓ Yes" },
  { label: "Experience", value: "5+ years" },
  { label: "Pet Types", value: "Dogs, Cats" },
  { label: "Location", value: "Pearl District" },
];

const TRAINING_SERVICES = ["Obedience training", "Puppy training", "Anxiety management", "Senior dog care"];
const GROOMING_SERVICES = ["Full grooming", "Nail trimming", "De-shedding", "Bath & tidy"];
const AVAILABILITY = ["Flexible scheduling", "Accepts new clients", "In-home or studio", "Consultations available"];

function ChecklistColumn({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex w-full flex-1 flex-col items-start gap-4 border-t border-[#dce5e8] pt-6">
      <h3 className="font-jakarta text-[16px] font-bold leading-[25.6px] text-[#066879]">{title}</h3>
      <ul className="flex w-full flex-col items-start">
        {items.map((item) => (
          <li key={item} className="flex w-full items-start gap-2 py-[7.7px] font-jakarta text-[14px] leading-[22.4px]">
            <span className="font-bold text-[#066879]">✓</span>
            <span className="text-[#102a32]">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Focused trainer/groomer detail card (Jessica Martinez), embedded inline
 * below the result cards — includes the safety callout and the
 * services/availability/contact grid.
 *
 * Figma: desktop 637:14492 ("S5: DETAIL") — a real photo sits beside the
 * profile text; mobile 637:14953 — the photo slot is the orange-to-teal
 * gradient with no `<img>` at all (same treatment as this trainer's card in
 * the results list; confirmed via get_design_context on both frames' photo
 * nodes). The "ℹ️" safety-callout glyph and the "✓" checklist marks are all
 * literal characters inside Figma text nodes on both breakpoints (confirmed
 * via get_design_context — no vector/image node backs them), so they're
 * reproduced as plain text rather than substituted icons.
 */
export default function TrainerDetail() {
  return (
    <div className="flex w-full flex-col items-start gap-8 rounded-[28px] border border-[#dce5e8] bg-white p-6 lg:gap-12">
      <div className="flex w-full flex-col items-start gap-6 border-b border-[#dce5e8] pb-8 lg:flex-row lg:gap-[47px]">
        <div
          className="h-[300px] w-full shrink-0 overflow-hidden rounded-[28px] lg:h-[351px] lg:w-[505px]"
          style={{ backgroundImage: "linear-gradient(135deg, #066879 0%, #e88924 100%)" }}
        >
          <Image
            src="/trainers-groomers-production/jessica-martinez-trainer-wide.webp"
            alt="Jessica Martinez training a golden retriever with agility poles"
            width={1010}
            height={702}
            className="hidden h-full w-full object-cover lg:block"
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col items-start gap-4">
          <h2 className="font-jakarta text-[28px] font-extrabold leading-[36px] text-[#102a32] lg:text-[32px] lg:leading-[51.2px]">
            Jessica Martinez
          </h2>
          <div className="flex flex-wrap items-start gap-2">
            <span className="rounded-2xl border border-[#dce5e8] bg-[#eef8f9] px-3 py-[6px] font-jakarta text-[12px] font-semibold uppercase text-[#066879]">
              Training
            </span>
            <span className="rounded-2xl border border-[#dce5e8] bg-[#eef8f9] px-3 py-[6px] font-jakarta text-[12px] font-semibold uppercase text-[#066879]">
              Grooming
            </span>
          </div>
          <p className="font-jakarta text-[14px] font-normal leading-[23.8px] text-[#102a32]">
            Jessica is a certified dog trainer and groomer with 5+ years of experience. She specializes in positive
            reinforcement training and has a gentle approach with anxious and senior dogs.
          </p>

          <div className="grid w-full grid-cols-2 gap-4 rounded-[20px] bg-[#f7f9fa] px-4 py-4 lg:px-6 lg:py-6">
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

      <div className="flex w-full flex-col items-start gap-4 rounded-[28px] border-2 border-[#e88924] bg-[#fff5e8] p-6 lg:flex-row lg:gap-6 lg:p-8">
        <span className="font-jakarta text-[28px] leading-[44.8px]">ℹ️</span>
        <div className="flex flex-col items-start gap-2">
          <h3 className="font-jakarta text-[16px] font-bold leading-[25.6px] text-[#102a32]">
            Not a medical service
          </h3>
          <p className="font-jakarta text-[14px] font-normal leading-[22.4px] text-[#102a32]">
            Training and grooming are professional services, not veterinary or medical treatment. Always consult a
            vet for health concerns.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-8 lg:grid lg:grid-cols-2 lg:gap-x-12 lg:gap-y-8">
        <ChecklistColumn title="Training services" items={TRAINING_SERVICES} />
        <ChecklistColumn title="Grooming services" items={GROOMING_SERVICES} />
        <ChecklistColumn title="Availability" items={AVAILABILITY} />

        <div className="flex w-full flex-1 flex-col items-start gap-2 border-t border-[#dce5e8] pt-6">
          <h3 className="font-jakarta text-[16px] font-bold leading-[25.6px] text-[#066879]">Contact</h3>
          <p className="pt-2 font-jakarta text-[16px] leading-[25.6px] text-[#102a32]">
            <span className="font-bold">Phone:</span>{" "}
            <a href="tel:5035551234" className="text-[#066879] underline">
              (503) 555-1234
            </a>
          </p>
          <p className="font-jakarta text-[16px] leading-[25.6px] text-[#102a32]">
            <span className="font-bold">Email:</span> jessica@example.com
          </p>
          <p className="font-jakarta text-[16px] leading-[25.6px] text-[#102a32]">
            <span className="font-bold">Hours:</span> Tue&ndash;Sat, 9am&ndash;5pm
          </p>
        </div>
      </div>
    </div>
  );
}
