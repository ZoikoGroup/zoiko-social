interface ChecklistSectionProps {
  title: string;
  intro?: string;
  items: string[];
}

/**
 * A titled checklist block ("✓ item" rows) with an optional intro paragraph.
 * Used for both "Areas of expertise" (no intro) and "Referral process" (with
 * intro) in the specialist detail grid.
 *
 * Figma: desktop 584:23661 / 584:23695, mobile 584:24057 / 584:24079.
 */
export default function ChecklistSection({ title, intro, items }: ChecklistSectionProps) {
  return (
    <div className="flex w-full flex-col items-start gap-4 border-t border-[#dce5e8] pt-6">
      <h3 className="font-jakarta text-[16px] font-bold leading-[25.6px] text-[#066879]">{title}</h3>

      {intro ? (
        <p className="font-jakarta text-[14px] font-normal leading-[23.8px] text-[#102a32]">{intro}</p>
      ) : null}

      <ul className="flex w-full flex-col items-start">
        {items.map((item) => (
          <li key={item} className="flex w-full items-start gap-2 py-1">
            <span className="font-jakarta text-[14px] font-bold leading-[22.4px] text-[#066879]">✓</span>
            <span className="font-jakarta text-[14px] font-normal leading-[22.4px] text-[#102a32]">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
