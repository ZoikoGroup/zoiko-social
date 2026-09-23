/**
 * Orange emergency-care callout at the bottom of the profile.
 *
 * Figma: desktop 584:23719, mobile 584:24114 ("Emergency Banner").
 */
export default function EmergencyBanner() {
  return (
    <div className="flex w-full items-start gap-4 rounded-[20px] border-2 border-[#e88924] bg-[rgba(232,137,36,0.1)] p-6">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e88924]">
        <span className="text-center font-jakarta text-[22px] leading-[35.2px] text-white">⚠️</span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
        <h3 className="font-jakarta text-[15px] font-bold leading-6 text-[#e88924]">Need emergency veterinary care?</h3>
        <p className="font-jakarta text-[14px] font-normal leading-[22.4px] text-[#102a32]">
          If your pet requires urgent care, explore 24-hour emergency veterinary services in your area.
        </p>
        <button type="button" className="font-jakarta text-[14px] font-semibold leading-[22.4px] text-[#e88924]">
          Find emergency vet care →
        </button>
      </div>
    </div>
  );
}
