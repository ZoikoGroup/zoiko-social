export default function PressReleasesArchive() {
  const filters = [
    { label: "All releases", active: true },
    { label: "Press release", active: false },
    { label: "Company update", active: false },
    { label: "Product announcement", active: false },
    { label: "Policy update", active: false }
  ];

  const releases = [
    {
      title: "Zoiko Social Launches Verified Rescue Network",
      desc: "New institutional verification program for rescue organizations and shelters.",
      tags: ["Press Release", "Global"],
      monthDay: "Sept 20",
      year: "2026"
    },
    {
      title: "Animal Welfare Commitment 2026",
      desc: "Annual report on platform investments in welfare reporting and anti-trafficking technology.",
      tags: ["Company Update", "Global"],
      monthDay: "Sept 15",
      year: "2026"
    },
    {
      title: "New Event Features for Communities",
      desc: "Enhanced event planning tools for rescue fundraisers, adoption events, and training workshops.",
      tags: ["Product Announcement", "Global"],
      monthDay: "Sept 10",
      year: "2026"
    },
    {
      title: "Expanded Professional Verification Rollout",
      desc: "Veterinarians, trainers, and rescue coordinators can now request professional verification badges.",
      tags: ["Press Release", "Global"],
      monthDay: "Aug 28",
      year: "2026"
    }
  ];

  return (
    <section className="bg-white w-full py-[80px]">
      <div className="mx-auto flex flex-col gap-9 px-4 sm:px-6 xl:px-20 max-w-[1440px]">
        {/* Header */}
        <div className="flex flex-col gap-3">
          <h2 className="text-[#102a32] text-[32px] md:text-[36px] font-bold font-jakarta leading-tight tracking-[-0.36px]">
            Press releases archive
          </h2>
          <p className="text-[#5e7076] text-[16px] md:text-[17px] font-jakarta">
            Search, filter, and browse all official Zoiko Social newsroom releases.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          {filters.map((filter, idx) => (
            <button
              key={idx}
              className={`px-4 py-2 rounded-full font-jakarta text-[14px] font-medium transition-colors ${
                filter.active
                  ? "bg-[#066879] text-white border border-[#066879]"
                  : "bg-white border border-[#dce5e8] text-[#5e7076] hover:bg-gray-50"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Releases List */}
        <div className="flex flex-col gap-4 mt-2">
          {releases.map((release, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#dce5e8] rounded-[20px] p-6 flex flex-col md:flex-row gap-6 justify-between items-start transition-shadow hover:shadow-sm"
            >
              <div className="flex flex-col gap-3 flex-1">
                <h3 className="text-[#102a32] text-[18px] md:text-[20px] font-semibold font-jakarta leading-tight">
                  {release.title}
                </h3>
                <p className="text-[#5e7076] text-[14px] font-jakarta leading-[1.65]">
                  {release.desc}
                </p>
                <div className="flex flex-wrap gap-3 mt-1">
                  {release.tags.map((tag, tagIdx) => (
                    <span 
                      key={tagIdx}
                      className="bg-[#eef8f9] text-[#066879] px-4 py-2 rounded-[8px] text-[12px] font-jakarta whitespace-nowrap"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-start md:items-end min-w-[80px]">
                <span className="text-[#066879] text-[16px] font-bold font-jakarta">
                  {release.monthDay}
                </span>
                <span className="text-[#102a32] text-[16px] font-normal font-jakarta">
                  {release.year}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
