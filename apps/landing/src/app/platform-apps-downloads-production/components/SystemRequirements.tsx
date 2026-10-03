const COLUMNS = [
  {
    title: "iOS Requirements",
    rows: [
      { label: "Operating System:", value: " iOS 13.0 or later" },
      { label: "Storage:", value: " 20 MB free space" },
      { label: "RAM:", value: " 512 MB minimum" },
      { label: "Devices:", value: " iPhone 6s+, iPad (5th gen+)" },
    ],
  },
  {
    title: "Android Requirements",
    rows: [
      { label: "Operating System:", value: " Android 8.0 (API level 26) or higher" },
      { label: "Storage:", value: " 18 MB free space" },
      { label: "RAM:", value: " 512 MB minimum (1 GB recommended)" },
      { label: "Architecture:", value: " ARM, ARM64, x86, x86_64" },
    ],
  },
  {
    title: "Web Requirements",
    rows: [
      { label: "Browsers:", value: " Chrome, Firefox, Safari, Edge (latest versions)" },
      { label: "JavaScript:", value: " Required and enabled" },
      { label: "Cookies:", value: " Third-party cookies must be enabled" },
      { label: "Internet:", value: " Broadband connection recommended" },
    ],
  },
] as const;

/**
 * "System Requirements" — grey-97 band with three white rounded-3xl
 * columns (iOS / Android / Web), per the Figma frame. Each column has a
 * centered cyan-25 bold title and label:value rows (bold label, normal
 * value, both azure-42).
 */
export default function SystemRequirements() {
  return (
    <section id="system-requirements" className="w-full bg-[#f1f4f5] px-6 py-20 lg:px-28">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12">
        <h2 className="text-center font-jakarta text-4xl font-extrabold leading-10 text-[#0f3d46]">
          System Requirements
        </h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {COLUMNS.map((column) => (
            <div
              key={column.title}
              className="flex flex-1 flex-col rounded-3xl border border-[#dce5e8] bg-white p-6"
            >
              <p className="text-center font-jakarta text-base font-bold text-[#0f5a68]">{column.title}</p>
              <div className="flex flex-col pt-2">
                {column.rows.map((row) => (
                  <p key={row.label} className="font-jakarta text-xs leading-5 text-[#55707c]">
                    <span className="font-bold">{row.label}</span>
                    <span className="font-normal">{row.value}</span>
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
