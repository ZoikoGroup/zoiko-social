"use client";

const evidenceLabels = [
  {
    label: "Official document",
    description:
      "Primary authority or protected-area document. Linked when available.",
  },
  {
    label: "Peer-reviewed",
    description:
      "Published, peer-reviewed study. One study is not universal ecological consensus.",
  },
  {
    label: "Preprint",
    description:
      "Not yet peer reviewed — shown with a prominent qualifier.",
  },
  {
    label: "Guidance",
    description:
      "Authority or professional guidance, with issuing body and scope identified.",
  },
  {
    label: "Press release",
    description:
      "Organization-issued release — not the same as independent reporting.",
  },
  {
    label: "Advocacy",
    description:
      "Advocacy or organization statement — clearly non-neutral, never styled as news.",
  },
  {
    label: "Source-reported",
    description:
      "Ordinary sourced journalism from a rated publisher.",
  },
  {
    label: "Multi-source",
    description:
      "Coverage drawn from multiple independent outlets on the same event.",
  },
];

export default function EvidenceLabels() {
  return (
    <section className="w-full bg-[#F5F8F8] py-6">
      <div className="mx-auto w-full max-w-[1232px] px-4 lg:px-0">
        <div className="w-full rounded-3xl bg-[#F8FAFA] px-7 py-6">

          {/* HEADING */}
          <div className="flex flex-col items-start">
            <h2 className="text-lg font-extrabold leading-7 text-[#073B47]">
              How to read evidence labels
            </h2>
          </div>

          {/* TWO COLUMN GRID */}
          <div className="mt-4 grid w-full grid-cols-1 gap-2.5 lg:grid-cols-2">

            {evidenceLabels.map((item) => (
              <div
                key={item.label}
                className="flex min-h-[44px] w-full items-start gap-2.5 rounded-[10px] border border-[#DCEAEE] bg-white px-3 py-2.5"
              >
                {/* LABEL */}
                <div className="shrink-0 pt-px">
                  <span className="inline-flex rounded-md bg-[#F5F7F7] px-2 py-[3px] text-xs font-bold leading-4 text-[#D97706]">
                    {item.label}
                  </span>
                </div>

                {/* DESCRIPTION */}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-normal leading-5 text-[#6B8790]">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
    </section>
  );
}