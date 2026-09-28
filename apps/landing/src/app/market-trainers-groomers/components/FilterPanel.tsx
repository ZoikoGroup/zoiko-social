/**
 * Sidebar filter panel — Service Type, Pet Type, and Status checkboxes plus
 * a "Clear all" button.
 *
 * Figma: desktop 637:14369 ("Aside - Filter Panel", 240px wide, sits to the
 * left of the results column); mobile 637:14831 (380px, full width, stacked
 * above the results). Layout position is handled by the parent grid; this
 * component is identical content on both breakpoints — checkbox fills
 * (`#066879`) mark "Both services" and "Dogs" as pre-selected, matching the
 * Figma checked states.
 */
const SERVICE_TYPES = [
  { label: "Training only", checked: false },
  { label: "Grooming only", checked: false },
  { label: "Both services", checked: true },
];

const PET_TYPES = [
  { label: "Dogs", checked: true },
  { label: "Cats", checked: false },
  { label: "Exotic", checked: false },
];

const STATUSES = [
  { label: "Accepting new clients", checked: false },
  { label: "Status unknown", checked: false },
];

function FilterGroup({
  title,
  options,
  padBottom,
}: {
  title: string;
  options: { label: string; checked: boolean }[];
  padBottom?: boolean;
}) {
  return (
    <div className={`flex w-full flex-col items-start ${padBottom ? "pb-6" : ""}`}>
      <p className="font-jakarta text-[11px] font-bold uppercase leading-[17.6px] tracking-[0.55px] text-[#102a32]">
        {title}
      </p>
      <div className="mt-5 flex w-full flex-col items-start gap-[15px]">
        {options.map((option) => (
          <label key={option.label} className="flex w-full items-center gap-2">
            <span
              className={`inline-block h-[13px] w-[13px] shrink-0 rounded-[2.5px] border ${
                option.checked ? "border-[#066879] bg-[#066879]" : "border-[#767676] bg-white"
              }`}
            />
            <span className="font-jakarta text-[13px] font-normal leading-[20.8px] text-[#102a32]">
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default function FilterPanel() {
  return (
    <div className="flex w-full flex-col items-start gap-6 rounded-[20px] border border-[#dce5e8] bg-white p-6">
      <FilterGroup title="Service Type" options={SERVICE_TYPES} />
      <FilterGroup title="Pet Type" options={PET_TYPES} />
      <FilterGroup title="Status" options={STATUSES} padBottom />
      <button
        type="button"
        className="font-jakarta text-[13px] font-semibold text-[#066879] hover:underline focus:outline-none"
      >
        Clear all
      </button>
    </div>
  );
}
