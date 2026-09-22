/**
 * Breadcrumb strip for the Specialists page and its specialist detail pages.
 *
 * Figma: node 584:23825 ("Breadcrumb", mobile frame 584:23824) — the desktop
 * frame (584:23395) doesn't include this strip at all (it starts directly
 * below the site nav), but the design brief calls out this exact breadcrumb
 * text, so it's rendered on both breakpoints for a consistent, navigable page.
 *
 * `current` defaults to "Specialists" for the listing page itself. The
 * specialist detail page (`[specialistId]/page.tsx`) passes the specialist's
 * name instead, which adds "Specialists" as an extra (non-bold) crumb ahead
 * of it.
 */
export default function Breadcrumb({ current = "Specialists" }: { current?: string }) {
  const isDetailPage = current !== "Specialists";

  return (
    <div className="w-full border-b border-[#dce5e8] bg-white py-4">
      <div className="mx-auto w-full max-w-[1440px] px-6 lg:px-[105px]">
        <p className="font-jakarta text-[13px] leading-[20.8px]">
          <span className="font-normal text-[#5e7076]">
            Zoiko Social &gt; Market &gt; Professional Care &gt; {isDetailPage ? "Specialists > " : ""}
          </span>
          <span className="font-bold text-[#102a32]">{current}</span>
        </p>
      </div>
    </div>
  );
}
