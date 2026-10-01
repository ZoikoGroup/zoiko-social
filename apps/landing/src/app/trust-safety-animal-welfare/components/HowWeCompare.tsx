interface ComparisonRow {
  feature: string;
  zoiko: boolean | string;
  generic: string;
  closed: string;
}

const COMPARISON_DATA: ComparisonRow[] = [
  {
    feature: "Animal Welfare Focus",
    zoiko: true,
    generic: "Partial",
    closed: "Limited",
  },
  {
    feature: "Community Verification",
    zoiko: true,
    generic: "None",
    closed: "Manual",
  },
  {
    feature: "Transparent Enforcement",
    zoiko: true,
    generic: "Hidden",
    closed: "Unknown",
  },
  {
    feature: "Fair Appeals Process",
    zoiko: true,
    generic: "Limited",
    closed: "None",
  },
  {
    feature: "24/7 Moderation",
    zoiko: true,
    generic: "Business Hours",
    closed: "Limited",
  },
  {
    feature: "Public Safety Reports",
    zoiko: true,
    generic: "None",
    closed: "Annual",
  },
];

export default function HowWeCompare() {
  return (
    <section className="w-full bg-white pb-20 sm:pb-24 lg:pb-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-left text-2xl font-bold tracking-tight text-[#0F2422] sm:text-3xl lg:text-[34px]">
          How We Compare
        </h2>

        <div className="mt-10 overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-200/80 bg-gray-50/60 text-xs font-bold uppercase tracking-wider text-[#5A7371]">
                  <th scope="col" className="px-6 py-4">
                    Feature
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    Zoiko Social
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    Generic Platform
                  </th>
                  <th scope="col" className="px-6 py-4 text-center">
                    Closed Community
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {COMPARISON_DATA.map((row) => (
                  <tr
                    key={row.feature}
                    className="transition-colors hover:bg-gray-50/40"
                  >
                    <td className="px-6 py-4.5 font-semibold text-[#0F2422]">
                      {row.feature}
                    </td>
                    <td className="px-6 py-4.5 text-center">
                      <span className="inline-flex size-6 items-center justify-center font-bold text-[#EA8A1A]">
                        ✓
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-center text-xs text-[#5A7371] sm:text-sm">
                      {row.generic}
                    </td>
                    <td className="px-6 py-4.5 text-center text-xs text-[#5A7371] sm:text-sm">
                      {row.closed}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
