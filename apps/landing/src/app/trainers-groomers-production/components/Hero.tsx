/**
 * Search hero: eyebrow, headline, description, and a location + pet type
 * search card.
 *
 * Figma: desktop 637:14306 ("Section - S1: HERO"), mobile 637:14772. Both
 * frames share the same soft cyan-to-white diagonal gradient background and
 * teal search button, but the headline copy itself genuinely differs:
 * desktop reads the short "Training and grooming professionals", while
 * mobile reads the longer "Find training and grooming professionals with
 * clearer trust signals." (confirmed via get_design_context on both Heading
 * 1 nodes — not a truncation, two different literal strings), so both are
 * reproduced as-is rather than picking one for both breakpoints.
 */
export default function Hero() {
  return (
    <section
      className="w-full py-12 lg:py-20"
      style={{ backgroundImage: "linear-gradient(135deg, #eef8f9 0%, #ffffff 100%)" }}
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-start gap-3 px-6 lg:hidden">
        <p className="font-jakarta text-[12px] font-semibold uppercase leading-[19.2px] tracking-[0.96px] text-[#066879]">
          Market / Professional Care
        </p>
        <h1 className="font-jakarta text-[28px] font-extrabold leading-[33.6px] tracking-[-0.56px] text-[#102a32]">
          Find training and grooming professionals with clearer trust signals.
        </h1>
        <p className="max-w-[820px] pt-1 font-jakarta text-[16px] font-normal leading-[27.2px] text-[#5e7076]">
          Discover trusted dog trainers and groomers in your area. Browse verified professionals, compare services,
          and find the right fit for your pet.
        </p>

        <div className="mt-3 flex w-full max-w-[500px] flex-col items-start gap-4 rounded-[28px] border border-[#dce5e8] bg-white px-8 pb-8 pt-[52px] drop-shadow-[0px_8px_12px_rgba(7,59,71,0.1)]">
          <label className="flex w-full flex-col items-start gap-2">
            <span className="font-jakarta text-[13px] font-semibold leading-[20.8px] text-[#102a32]">
              Location or area
            </span>
            <input
              type="text"
              defaultValue="Portland, OR"
              className="w-full rounded-xl border border-[#dce5e8] px-[12px] py-[10px] font-jakarta text-[14px] font-normal text-[#102a32] focus:outline-none focus:ring-2 focus:ring-[#066879]/30"
            />
          </label>

          <label className="flex w-full flex-col items-start gap-2">
            <span className="font-jakarta text-[13px] font-semibold leading-[20.8px] text-[#102a32]">Pet type</span>
            <select
              defaultValue="All species"
              className="w-full rounded-xl border border-[#dce5e8] bg-white py-[11px] pl-4 pr-7 font-jakarta text-[14px] font-normal text-[#102a32] focus:outline-none focus:ring-2 focus:ring-[#066879]/30"
            >
              <option>All species</option>
              <option>Dogs</option>
              <option>Cats</option>
              <option>Exotic</option>
            </select>
          </label>

          <button
            type="button"
            className="flex min-h-[40px] w-full items-center justify-center rounded-xl bg-[#066879] p-[12px] text-center font-jakarta text-[14px] font-semibold text-white"
          >
            Search Training and Grooming Professionals
          </button>
        </div>
      </div>

      <div className="mx-auto hidden w-full max-w-[1440px] items-center gap-[11px] lg:flex lg:px-[105px]">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-[11px]">
          <p className="font-jakarta text-[12px] font-semibold uppercase leading-[19.2px] tracking-[0.96px] text-[#066879]">
            Market / Professional Care
          </p>
          <h1 className="font-jakarta text-[48px] font-extrabold leading-[57.6px] tracking-[-0.96px] text-[#102a32]">
            Training and grooming professionals
          </h1>
          <p className="max-w-[600px] pt-1 font-jakarta text-[16px] font-normal leading-[27.2px] text-[#5e7076]">
            Discover trusted dog trainers and groomers in your area. Browse verified professionals, compare
            services, and find the right fit for your pet.
          </p>
        </div>

        <div className="flex w-[600px] shrink-0 flex-col items-start gap-4 rounded-[28px] border border-[#dce5e8] bg-white p-8 drop-shadow-[0px_8px_12px_rgba(7,59,71,0.1)]">
          <div className="flex w-full items-start gap-4">
            <label className="flex flex-1 flex-col items-start gap-2">
              <span className="font-jakarta text-[13px] font-semibold leading-[20.8px] text-[#102a32]">
                Location or area
              </span>
              <input
                type="text"
                defaultValue="Portland, OR"
                className="w-full rounded-xl border border-[#dce5e8] px-[12px] py-[10px] font-jakarta text-[14px] font-normal text-[#102a32] focus:outline-none focus:ring-2 focus:ring-[#066879]/30"
              />
            </label>

            <label className="flex flex-1 flex-col items-start gap-2">
              <span className="font-jakarta text-[13px] font-semibold leading-[20.8px] text-[#102a32]">
                Pet type
              </span>
              <select
                defaultValue="All species"
                className="w-full rounded-xl border border-[#dce5e8] bg-white py-[11px] pl-4 pr-7 font-jakarta text-[14px] font-normal text-[#102a32] focus:outline-none focus:ring-2 focus:ring-[#066879]/30"
              >
                <option>All species</option>
                <option>Dogs</option>
                <option>Cats</option>
                <option>Exotic</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            className="flex min-h-[40px] w-full items-center justify-center rounded-xl bg-[#066879] px-[12px] py-[12px] text-center font-jakarta text-[14px] font-semibold text-white"
          >
            Search Training and Grooming Professionals
          </button>
        </div>
      </div>
    </section>
  );
}
