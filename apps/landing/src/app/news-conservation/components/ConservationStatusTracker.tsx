"use client";

export default function ConservationStatusTracker() {
  return (
    <section className="w-full bg-[#F5F8F8] pt-6 pb-8">
      <div className="mx-auto w-full max-w-[1232px] px-4 lg:px-0">
        {/* TRACKER CARD */}
        <div className="w-full rounded-3xl border border-[#DCEAEE] bg-white px-7 py-7">

          {/* =====================================================
              HEADER
          ===================================================== */}
          <div className="flex flex-col items-start gap-[5.1px]">
            <h2 className="text-xl font-extrabold leading-8 text-[#073B47]">
              Conservation status &amp; action tracker
            </h2>

            <p className="max-w-[680px] text-sm font-normal leading-5 text-[#6B8790]">
              Tracks server-backed conservation actions and protections only.
              Species/population status, legal protection, and project lifecycle
              are kept as separate fields — never inferred.
            </p>
          </div>

          {/* =====================================================
              FIRST ACTION
          ===================================================== */}
          <div className="flex flex-col items-start gap-2.5 pt-8 pb-5">

            {/* TITLE + TRACK BUTTON */}
            <div className="flex w-full flex-wrap items-start justify-between gap-4">
              <h3 className="text-base font-bold leading-6 text-[#3F6972]">
                Pacific Northwest wildlife corridor protection
              </h3>

              <button
                type="button"
                className="shrink-0 rounded-[10px] border border-[#DCEAEE] bg-white px-3 py-1.5 text-xs font-semibold leading-4 text-[#3F6972] transition hover:bg-[#F5F8F8]"
              >
                Track this action
              </button>
            </div>

            {/* STATUS ROW */}
            <div className="flex w-full flex-wrap items-center pt-1">

              {/* PLANNED */}
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-md bg-[#066879]" />

                <span className="pl-1.5 pr-3.5 text-xs font-semibold leading-4 text-[#073B47]">
                  Planned
                </span>
              </div>

              {/* APPROVED / FUNDED */}
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-md bg-[#066879]" />

                <span className="pl-1.5 pr-3.5 text-xs font-semibold leading-4 text-[#073B47]">
                  Approved / funded
                </span>
              </div>

              {/* ACTIVE / PROTECTED */}
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5 items-center justify-center rounded-md bg-[#F6C98B]">
                  <span className="absolute h-2.5 w-2.5 rounded-md shadow-[0_0_0_3px_rgba(255,245,232,1)]" />
                </span>

                <span className="pl-1.5 pr-3.5 text-xs font-bold leading-4 text-[#D97706]">
                  Active / protected
                </span>
              </div>
            </div>

            {/* DOCUMENT LINK */}
            <button
              type="button"
              className="text-xs font-semibold leading-5 text-[#066879] underline"
            >
              View primary designation document
            </button>
          </div>

          {/* =====================================================
              SECOND ACTION
          ===================================================== */}
          <div className="flex flex-col items-start gap-2.5 border-t border-[#DCEAEE] pt-4 pb-px">

            {/* TITLE + TRACK BUTTON */}
            <div className="flex w-full flex-wrap items-start justify-between gap-4">
              <h3 className="text-base font-bold leading-6 text-[#3F6972]">
                Northern coastal marine protected area (proposed)
              </h3>

              <button
                type="button"
                className="shrink-0 rounded-[10px] border border-[#DCEAEE] bg-white px-3 py-1.5 text-xs font-semibold leading-4 text-[#3F6972] transition hover:bg-[#F5F8F8]"
              >
                Track this action
              </button>
            </div>

            {/* STATUS ROW */}
            <div className="flex w-full flex-wrap items-center pt-1">

              {/* PLANNED */}
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5 items-center justify-center rounded-md bg-[#F6C98B]">
                  <span className="absolute h-2.5 w-2.5 rounded-md shadow-[0_0_0_3px_rgba(255,245,232,1)]" />
                </span>

                <span className="pl-1.5 pr-3.5 text-xs font-bold leading-4 text-[#D97706]">
                  Planned
                </span>
              </div>

              {/* UNDER REVIEW */}
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-md bg-[#DCEAEE]" />

                <span className="pl-1.5 pr-3.5 text-xs font-semibold leading-4 text-[#6B8790]">
                  Under review
                </span>
              </div>

              {/* APPROVED / FUNDED */}
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-md bg-[#DCEAEE]" />

                <span className="pl-1.5 pr-3.5 text-xs font-semibold leading-4 text-[#6B8790]">
                  Approved / funded
                </span>
              </div>
            </div>

            {/* DOCUMENT LINK */}
            <button
              type="button"
              className="text-xs font-semibold leading-5 text-[#066879] underline"
            >
              View official proposal notice
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}