import Image from "next/image";
import { C } from "./theme";

/** Section - 05 · SEARCH — "Search accessibility help", a search box on the panel background. */
export default function SearchHelp() {
  return (
    <section className="w-full px-5 py-10 lg:px-[105px] lg:py-14" style={{ backgroundColor: C.panel }}>
      <div className="mx-auto flex w-full max-w-[760px] flex-col gap-6 lg:max-w-[1280px]">
        <div className="flex flex-col gap-2.5 lg:gap-[11px] lg:max-w-[544px]">
          <h2 className="text-[26px] font-extrabold tracking-[-0.26px] lg:text-4xl lg:tracking-[-0.36px]" style={{ color: C.brandDeep }}>
            Search accessibility help
          </h2>
          <p className="text-base leading-[25.6px] lg:text-[17px] lg:leading-[27.2px]" style={{ color: C.muted }}>
            Guides and known issues in one place.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <label className="pl-1 text-sm font-bold" style={{ color: C.ink }}>
            Search accessibility help
          </label>
          <div
            className="flex w-full items-center gap-2 rounded-2xl border bg-white py-1.5 pl-3.5 pr-1.5 shadow-[0px_1px_1px_rgba(7,59,71,0.06)] lg:pl-5"
            style={{ borderColor: C.line }}
          >
            <Image src="/support&developers-accessibility-support/icon-search.webp" alt="" width={22} height={22} />
            <input
              type="text"
              placeholder="For example: captions on videos"
              className="min-w-0 flex-1 bg-transparent py-3 text-[16px] outline-none lg:text-[17px]"
              style={{ color: C.inputPlaceholder }}
            />
            <button
              type="button"
              aria-label="Search"
              className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 lg:px-6"
              style={{ backgroundColor: C.brand }}
            >
              <Image src="/support&developers-accessibility-support/icon-search-white.webp" alt="" width={20} height={20} />
              <span className="hidden text-[15px] font-semibold text-white lg:inline">Search</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
