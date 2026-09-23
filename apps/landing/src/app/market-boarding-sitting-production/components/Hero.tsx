/**
 * Search hero: eyebrow, headline, description, and a location + pet type
 * search card.
 *
 * Figma: desktop 637:12436 (plain white background, teal search button);
 * mobile 637:12871 (warm diagonal gradient background `#fff5e8 -> #ffffff`,
 * orange search button). These aren't just a reflow — the Figma canvas
 * genuinely renders different background/button treatments per breakpoint,
 * so both are reproduced rather than picking one.
 */
export default function Hero() {
  return (
    <section className="w-full bg-[linear-gradient(135deg,#fff5e8_0%,#ffffff_100%)] px-6 py-12 lg:bg-white lg:bg-none lg:px-[105px] lg:py-14">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-3 lg:hidden">
        <p className="font-jakarta text-[12px] font-semibold uppercase leading-[19.2px] tracking-[0.96px] text-[#e88924]">
          Market / Services &amp; Supplies
        </p>
        <h1 className="font-jakarta text-[28px] font-extrabold leading-[33.6px] tracking-[-0.56px] text-[#102a32]">
          Find boarding and sitting providers with clearer trust signals.
        </h1>
        <p className="max-w-[820px] pt-1 font-jakarta text-[16px] font-normal leading-[27.2px] text-[#5e7076]">
          Explore verified care options for while you&rsquo;re away. Facility-based boarding, home-based sitting, or
          drop-in care — with clear information about what each provider offers.
        </p>

        <div className="mt-3 flex w-full max-w-[500px] flex-col items-start gap-4 rounded-[28px] border border-[#dce5e8] bg-white px-8 pb-8 pt-[52px] drop-shadow-[0px_8px_12px_rgba(7,59,71,0.1)]">
          <label className="flex w-full flex-col items-start gap-2">
            <span className="font-jakarta text-[13px] font-semibold leading-[20.8px] text-[#102a32]">
              Location or area
            </span>
            <input
              type="text"
              defaultValue="Portland, OR"
              className="w-full rounded-xl border border-[#dce5e8] px-[12px] py-[10px] font-jakarta text-[14px] font-normal text-[#102a32] focus:outline-none focus:ring-2 focus:ring-[#e88924]/30"
            />
            <span className="font-jakarta text-[11px] font-normal leading-[18.7px] text-[#5e7076]">
              Manual entry only — no location permission required.
            </span>
          </label>

          <label className="flex w-full flex-col items-start gap-2">
            <span className="font-jakarta text-[13px] font-semibold leading-[20.8px] text-[#102a32]">Pet type</span>
            <select
              defaultValue="Dogs"
              className="w-full rounded-xl border border-[#dce5e8] bg-white py-[11px] pl-4 pr-7 font-jakarta text-[14px] font-normal text-[#102a32] focus:outline-none focus:ring-2 focus:ring-[#e88924]/30"
            >
              <option>Dogs</option>
              <option>Cats</option>
              <option>Exotic</option>
            </select>
          </label>

          <button
            type="button"
            className="flex min-h-[40px] w-full items-center justify-center rounded-xl bg-[#e88924] p-[12px] font-jakarta text-[14px] font-semibold text-white"
          >
            Search boarding and sitting providers
          </button>
        </div>
      </div>

      <div className="mx-auto hidden w-full max-w-[1440px] items-start gap-[11px] lg:flex">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-[11px]">
          <p className="font-jakarta text-[12px] font-semibold uppercase leading-[19.2px] tracking-[0.96px] text-[#e88924]">
            Market / Services &amp; Supplies
          </p>
          <h1 className="font-jakarta text-[48px] font-extrabold leading-[57.6px] tracking-[-0.96px] text-[#102a32]">
            Find boarding and sitting providers with clearer trust signals.
          </h1>
          <p className="max-w-[820px] pt-1 font-jakarta text-[16px] font-normal leading-[27.2px] text-[#5e7076]">
            Explore verified care options for while you&rsquo;re away. Facility-based boarding, home-based sitting, or
            drop-in care — with clear information about what each provider offers.
          </p>
        </div>

        <div className="flex w-[500px] shrink-0 flex-col items-start gap-4 rounded-[28px] border border-[#dce5e8] bg-white px-8 pb-8 pt-[52.69px] drop-shadow-[0px_8px_12px_rgba(7,59,71,0.1)]">
          <label className="flex w-full flex-col items-start gap-2">
            <span className="font-jakarta text-[13px] font-semibold leading-[20.8px] text-[#102a32]">
              Location or area
            </span>
            <input
              type="text"
              defaultValue="Portland, OR"
              className="w-full rounded-xl border border-[#dce5e8] px-[12px] py-[10px] font-jakarta text-[14px] font-normal text-[#102a32] focus:outline-none focus:ring-2 focus:ring-[#066879]/30"
            />
            <span className="font-jakarta text-[11px] font-normal leading-[18.7px] text-[#5e7076]">
              Manual entry only — no location permission required.
            </span>
          </label>

          <label className="flex w-full flex-col items-start gap-2">
            <span className="font-jakarta text-[13px] font-semibold leading-[20.8px] text-[#102a32]">Pet type</span>
            <select
              defaultValue="Dogs"
              className="w-full rounded-xl border border-[#dce5e8] bg-white py-[11px] pl-4 pr-7 font-jakarta text-[14px] font-normal text-[#102a32] focus:outline-none focus:ring-2 focus:ring-[#066879]/30"
            >
              <option>Dogs</option>
              <option>Cats</option>
              <option>Exotic</option>
            </select>
          </label>

          <button
            type="button"
            className="flex min-h-[40px] w-full items-center justify-center rounded-xl bg-[#066879] p-[12px] font-jakarta text-[14px] font-semibold text-white"
          >
            Search boarding and sitting providers
          </button>
        </div>
      </div>
    </section>
  );
}
