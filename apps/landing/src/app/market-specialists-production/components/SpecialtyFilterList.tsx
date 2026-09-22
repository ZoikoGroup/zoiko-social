const SPECIALTIES = [
  "Dermatology",
  "Oncology",
  "Cardiology",
  "Orthopedics",
  "Surgery",
  "Internal Medicine",
  "Neurology",
  "Ophthalmology",
];

/**
 * Vertical specialty filter list.
 *
 * Figma: desktop 584:23455 (sticky 240px sidebar beside the search form),
 * mobile 584:23870 (same list, full width, stacked above the search form).
 * "All specialties" is the selected state in both frames (solid teal pill).
 */
export default function SpecialtyFilterList() {
  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-4 rounded-[20px] border border-[#dce5e8] bg-white p-6 lg:sticky lg:top-4 lg:w-[240px]">
      <h3 className="w-full font-jakarta text-[14px] font-bold uppercase leading-[22.4px] tracking-[0.7px] text-[#102a32]">
        Specialties
      </h3>
      <div className="flex w-full flex-col items-start gap-2">
        <button
          type="button"
          className="w-full rounded-xl bg-[#066879] py-[10px] pl-3 pr-3 text-left font-jakarta text-[13px] font-bold text-white"
        >
          All specialties
        </button>
        {SPECIALTIES.map((specialty) => (
          <button
            key={specialty}
            type="button"
            className="w-full rounded-xl py-[10px] pl-3 pr-3 text-left font-jakarta text-[13px] font-medium text-[#102a32]"
          >
            {specialty}
          </button>
        ))}
      </div>
    </div>
  );
}
