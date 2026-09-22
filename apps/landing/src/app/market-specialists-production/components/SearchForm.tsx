/**
 * Location + species search form above the results list.
 *
 * Figma: desktop 584:23480, mobile 584:23892 — same fields and copy on both
 * breakpoints, just full width instead of a fixed 942px form.
 */
export default function SearchForm() {
  return (
    <div className="flex w-full flex-1 flex-col items-start gap-4 rounded-[20px] border border-[#dce5e8] bg-white p-6 drop-shadow-[0px_1px_1px_rgba(7,59,71,0.06)]">
      <div className="flex w-full flex-col gap-4">
        <label className="flex w-full flex-col items-start gap-2">
          <span className="font-jakarta text-[13px] font-semibold leading-[20.8px] text-[#102a32]">Location or area</span>
          <input
            type="text"
            defaultValue="Portland, OR"
            className="w-full rounded-xl border border-[#dce5e8] p-[12px] font-jakarta text-[14px] font-normal text-[#102a32] focus:outline-none focus:ring-2 focus:ring-[#066879]/30"
          />
        </label>

        <label className="flex w-full flex-col items-start gap-2">
          <span className="font-jakarta text-[13px] font-semibold leading-[20.8px] text-[#102a32]">Pet species</span>
          <select
            defaultValue="All species"
            className="w-full rounded-xl border border-[#dce5e8] bg-[#efefef] py-[13px] pl-4 pr-7 font-jakarta text-[14px] font-normal text-[#102a32] focus:outline-none focus:ring-2 focus:ring-[#066879]/30"
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
        className="flex min-h-[40px] w-full items-center justify-center rounded-xl bg-[#066879] px-4 py-[11px] font-jakarta text-[14px] font-semibold text-white"
      >
        Search specialists
      </button>
    </div>
  );
}
