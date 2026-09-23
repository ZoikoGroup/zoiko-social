import type { InfoRow } from "./data";

interface InfoSectionProps {
  title: string;
  rows: InfoRow[];
  actionLabel?: string;
}

/**
 * A titled "Label: value" block, optionally followed by a full-width
 * secondary button. Used for both "Location & contact" (with the "Get
 * directions" button) and "Appointment information" (no button).
 *
 * Figma: desktop 584:23684 / 584:23710, mobile 584:24079 / 584:24105.
 */
export default function InfoSection({ title, rows, actionLabel }: InfoSectionProps) {
  return (
    <div className="flex w-full flex-col items-start gap-3 border-t border-[#dce5e8] pt-6">
      <h3 className="font-jakarta text-[16px] font-bold leading-[25.6px] text-[#066879]">{title}</h3>

      <div className="flex w-full flex-col items-start gap-1 pb-2">
        {rows.map((row) => (
          <p key={row.label} className="font-jakarta text-[14px] leading-[23.8px] text-[#102a32]">
            <span className="font-bold">{row.label}:</span> <span className="font-normal">{row.value}</span>
          </p>
        ))}
      </div>

      {actionLabel ? (
        <button
          type="button"
          className="flex min-h-[40px] w-full items-center justify-center rounded-xl border border-[#dce5e8] bg-white px-4 py-[10px] text-center font-jakarta text-[14px] font-semibold text-[#066879]"
        >
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
