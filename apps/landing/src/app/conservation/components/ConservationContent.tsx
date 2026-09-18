"use client";

import Image from "next/image";

const images = {
  hero: "/conservation/image1.png",
  condor: "/conservation/image2.png",
  mangrove: "/conservation/image3.png",
  marine: "/conservation/image4.png",
  beaver: "/conservation/image5.png",
  policy: "/conservation/image6.png",
  cameraTrap: "/conservation/image7.png",
  seabird: "/conservation/image8.png",
  reserve: "/conservation/image9.png",
  bison: "/conservation/image10.png",
};

const categories = [
  "All Conservation",
  "Species & Recovery",
  "Habitats & Ecosystems",
  "Protected Areas",
  "Restoration & Rewilding",
  "Conservation Policy",
  "Science & Monitoring",
  "Human-Wildlife Coexistence",
];

const stories = [
  {
    image: images.condor,
    source:
      "Journal of Wildlife Ecology (via Verified Science Desk) · Tier 1",
    title: "California condor population passes milestone in latest survey",
    category: "Species & Recovery",
    status: "Peer-reviewed study",
    description:
      "A new field survey reports the wild condor population has crossed a notable threshold for the first time in decades, according to peer-reviewed monitoring data.",
    published: "Published 2 days ago · California, USA",
    follow: "Follow Species & Recovery",
  },
  {
    image: images.mangrove,
    source: "Coastal Times · Tier 2",
    title: "Mangrove restoration expands along Gulf coastline",
    category: "Habitats & Ecosystems",
    status: "Source-reported",
    description:
      "Local restoration groups report expanded mangrove planting efforts along a stretch of coastline, aiming to rebuild storm-buffering habitat.",
    published: "Published 1 day ago · Gulf Coast, USA",
    follow: "Follow Habitats & Ecosystems",
  },
  {
    image: images.marine,
    source: "National Ocean Authority (official notice) · Tier 1",
    title: "New marine protected area proposed off northern coastline",
    category: "Protected Areas",
    secondary: "Planned",
    status: "Official document",
    description:
      "A national ocean authority has issued an official notice proposing a new marine protected area, opening a public comment period.",
    published:
      "Published 5 hours ago · Northern coastal waters (national authority)",
    follow: "Follow Protected Areas",
  },
  {
    image: images.beaver,
    source: "Multiple outlets · Tier 1",
    title: "Reintroduced beavers show early success in wetland recovery",
    category: "Restoration & Rewilding",
    status: "Multiple-source reporting",
    description:
      "Multiple outlets report early wetland recovery indicators following a beaver reintroduction project in an upper watershed region.",
    published:
      "Published 3 days ago · Upper watershed region (state-level)",
  },
  {
    image: images.policy,
    source: "State Wildlife Authority (guidance notice) · Tier 1",
    title: "Draft habitat protection policy enters public consultation",
    category: "Conservation Policy",
    secondary: "Under review",
    status: "Authority guidance",
    description:
      "A draft habitat protection policy has entered a formal public consultation period, according to the issuing wildlife authority.",
    published: "Published 6 hours ago · State-level authority",
  },
  {
    image: images.cameraTrap,
    source: "Conservation Science Network · Tier 2",
    title: "New camera-trap study tracks elusive forest cat population",
    category: "Science & Monitoring",
    status: "Preprint · Not yet peer reviewed",
    description:
      "Researchers report early camera-trap results tracking a rarely seen forest cat species. The findings have not yet completed peer review.",
    published: "Published 4 days ago · Temperate forest region (broad)",
  },
  {
    image: images.seabird,
    source: "Regional Rural News · Tier 2",
    title: "Community fencing program reduces crop-raiding incidents",
    category: "Human-Wildlife Coexistence",
    status: "Source-reported",
    description:
      "A rural district reports fewer crop-raiding incidents following a community-run fencing and deterrent program.",
    published: "Published 2 days ago · Rural district (broad)",
  },
  {
    image: images.reserve,
    source: "Regional Seabird Trust (organization statement) · Tier 2",
    title:
      "Rare seabird colony shows signs of recovery after rehabilitation effort",
    category: "Species & Recovery",
    status: "Advocacy / organization statement",
    description:
      "A wildlife organization reports early recovery signs at a rare seabird colony following a rehabilitation effort. The organization's own statement is presented as advocacy context, not independent reporting.",
    published: "Published 1 day ago · Location withheld for safety",
    sensitive: true,
  },
  {
    image: images.bison,
    source: "National Parks Bulletin · Tier 1",
    title: "Historic reserve boundary expansion finalized",
    category: "Protected Areas",
    secondary: "Completed",
    status: "Official document",
    description:
      "Authorities have finalized a boundary expansion for a long-standing nature reserve, formally increasing its protected area.",
    published: "Published 6 days ago · National authority",
  },
];

function CategoryFilters() {
  const positions = [
    "left-0 top-[8px]",
    "left-[140px] top-[8px]",
    "left-[303px] top-[8px]",
    "left-[486px] top-[8px]",
    "left-[627px] top-[8px]",
    "left-[815px] top-[8px]",
    "left-[978px] top-[8px]",
    "left-0 top-[56px]",
  ];

  return (
    <div className="relative mx-auto h-24 w-full max-w-[1232px]">
      {categories.map((category, index) => {
        const active = index === 0;

        return (
          <button
            key={category}
            type="button"
            className={`
              absolute
              ${positions[index]}
              inline-flex
              items-center
              justify-center
              rounded-full
              px-3.5
              py-2
              font-['Plus_Jakarta_Sans']
              text-xs
              font-semibold
              whitespace-nowrap
              ${
                active
                  ? "bg-[#066879] text-white outline outline-1 outline-[#066879]"
                  : "bg-white text-[#6B8790] outline outline-1 outline-[#DCEAEE]"
              }
            `}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}

function ConservationBrief() {
  return (
    <div className="h-64 w-full rounded-3xl bg-[#EAF3F5] px-7 py-6">
      <h2 className="font-['Plus_Jakarta_Sans'] text-base font-extrabold leading-6 text-[#073B47]">
        Conservation Brief — Pacific Northwest wildlife corridor
      </h2>

      <div className="mt-[14px] grid grid-cols-2 gap-x-12 gap-y-[10px]">
        <div>
          <p className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase leading-4 tracking-tight text-[#073B47]">
            Issue
          </p>

          <p className="mt-0.5 font-['Plus_Jakarta_Sans'] text-sm font-normal leading-5 text-[#3F6972]">
            A regional wildlife corridor connecting two forest reserves has
            moved from
            <br />
            approved/funded status to active protection.
          </p>
        </div>

        <div>
          <p className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase leading-4 tracking-tight text-[#073B47]">
            Why it matters
          </p>

          <p className="mt-0.5 font-['Plus_Jakarta_Sans'] text-sm font-normal leading-5 text-[#3F6972]">
            Active protection restricts new development along the corridor,
            supporting safer wildlife
            <br />
            movement between reserves.
          </p>
        </div>

        <div>
          <p className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase leading-4 tracking-tight text-[#073B47]">
            Safe region / authority
          </p>

          <p className="mt-0.5 font-['Plus_Jakarta_Sans'] text-sm font-normal leading-5 text-[#3F6972]">
            Pacific Northwest, USA — state wildlife authority (state-level).
          </p>
        </div>

        <div>
          <p className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase leading-4 tracking-tight text-[#073B47]">
            Status
          </p>

          <p className="mt-0.5 font-['Plus_Jakarta_Sans'] text-sm font-normal leading-5 text-[#3F6972]">
            Conservation action update · Active / protected (previously
            Approved / funded)
          </p>
        </div>

        <div>
          <p className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase leading-4 tracking-tight text-[#073B47]">
            Source basis
          </p>

          <p className="mt-0.5 font-['Plus_Jakarta_Sans'] text-sm font-normal leading-5 text-[#3F6972]">
            Pacific Conservation Trust — official designation notice (primary
            document available).
          </p>
        </div>

        <div>
          <p className="font-['Plus_Jakarta_Sans'] text-xs font-bold uppercase leading-4 tracking-tight text-[#073B47]">
            What changed
          </p>

          <p className="mt-0.5 font-['Plus_Jakarta_Sans'] text-sm font-normal leading-5 text-[#3F6972]">
            Status moved from Approved / funded to Active / protected effective
            this week.
          </p>
        </div>
      </div>
    </div>
  );
}

function ChangeNotice() {
  return (
    <div className="flex h-10 w-full items-center bg-[#FFF5E8]">
      <div className="relative ml-5 h-3.5 w-3.5 shrink-0">
        <div className="absolute left-[2.33px] top-[2.33px] h-2.5 w-2.5 rounded-full border border-[#F59A23]" />
        <div className="absolute left-[5px] top-[5px] h-1 w-px bg-[#F59A23]" />
      </div>

      <p className="ml-2 font-['Plus_Jakarta_Sans'] text-xs font-bold leading-5 text-[#D97706]">
        What changed: Status moved from Approved / funded to Active / protected.
      </p>
    </div>
  );
}

function FeaturedStory() {
  return (
    <div className="w-full overflow-hidden rounded-[20px] border border-[#DCEAEE] bg-white">
      <div className="flex h-[384px] w-full">
        {/* LEFT IMAGE */}
        <div className="relative h-[384px] w-[57.4%] shrink-0">
          <Image
            src={images.hero}
            alt="Wildlife conservation"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div className="relative h-[384px] flex-1">
          {/* Source */}
          <div className="absolute left-[26px] right-[26px] top-[24px]">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-[5px] rounded-lg bg-[#F5F8F8] px-2.5 py-1">
                <span className="text-[8px] text-[#073B47]">✓</span>

                <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-[#073B47]">
                  Pacific Conservation Trust · Tier 1
                </span>
              </div>

              <div className="rounded-md border border-[#DCEAEE] bg-[#F9FBFB] px-2 py-[3px]">
                <span className="font-['Plus_Jakarta_Sans'] text-xs font-semibold leading-4 text-[#6B8790]">
                  Restoration &amp; Rewilding
                </span>
              </div>
            </div>

            {/* Tags */}
            <div className="mt-[8px] flex items-center gap-2">
              <div className="rounded-md border border-[#DCEAEE] bg-[#F9FBFB] px-2 py-[3px]">
                <span className="font-['Plus_Jakarta_Sans'] text-xs font-semibold leading-4 text-[#6B8790]">
                  Conservation action update
                </span>
              </div>

              <div className="rounded-md bg-[#066879] px-2 py-1">
                <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold leading-4 text-white">
                  Active / protected
                </span>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="absolute left-[26px] right-[26px] top-[90px]">
            <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold leading-7 text-[#3F6972]">
              Regional wildlife corridor moves to active
              <br />
              protection, connecting two forest reserves
            </h2>
          </div>

          {/* Description */}
          <div className="absolute left-[26px] right-[26px] top-[157px]">
            <p className="font-['Plus_Jakarta_Sans'] text-sm font-normal leading-6 text-[#6B8790]">
              A wildlife corridor linking two state forest reserves has been
              designated active and protected, restricting new development along
              the route. The designation follows an approved-and-funded planning
              phase completed earlier this year.
            </p>
          </div>

          {/* Meta */}
          <div className="absolute left-[26px] right-[26px] top-[260px]">
            <p className="font-['Plus_Jakarta_Sans'] text-xs font-normal leading-4 text-[#6B8790]">
              Published 3 days ago · Updated 34 minutes ago · Region: Pacific
              Northwest, USA
              <br />
              (state-level)
            </p>
          </div>

          {/* Buttons */}
          <div className="absolute left-[26px] top-[307px]">
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#066879] px-4 py-2.5 font-['Plus_Jakarta_Sans'] text-sm font-semibold leading-5 text-white"
              >
                <span className="underline">Read Story</span>
                <span>↗</span>
              </button>

              <button
                type="button"
                className="rounded-[10px] border border-[#DCEAEE] bg-white px-3 py-3 font-['Plus_Jakarta_Sans'] text-xs font-semibold text-[#3F6972]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StoryCard({
  story,
}: {
  story: (typeof stories)[number];
}) {
  return (
    <article className="overflow-hidden rounded-[20px] border border-[#DCEAEE] bg-white">
      {/* IMAGE */}
      <div className="relative h-[296px] w-full overflow-hidden">
        <Image
          src={story.image}
          alt={story.title}
          fill
          className={`object-cover ${
            story.sensitive ? "scale-105 blur-sm" : ""
          }`}
        />

        {story.sensitive && (
          <>
            <div className="absolute inset-0 bg-[#073B47]/55" />

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
              <div className="text-xl text-white">△</div>

              <p className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-white">
                Sensitive content — tap to reveal
              </p>
            </div>

            <div className="absolute bottom-2 left-2 rounded-md bg-[#073B47]/70 px-2 py-[3px]">
              <span className="font-['Plus_Jakarta_Sans'] text-[10px] font-bold leading-4 text-white">
                Location withheld
              </span>
            </div>
          </>
        )}
      </div>

      {/* CONTENT */}
      <div className="min-h-[320px] px-4 pb-4 pt-[14px]">
        {/* Source */}
        <div className="inline-flex max-w-full rounded-md bg-[#F5F8F8] px-2 py-[2.5px]">
          <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold leading-4 text-[#073B47]">
            {story.source}
          </span>
        </div>

        {/* Title */}
        <h3 className="mt-[10px] font-['Plus_Jakarta_Sans'] text-sm font-bold leading-5 text-[#3F6972]">
          {story.title}
        </h3>

        {/* Category */}
        <div className="mt-[22px] flex flex-wrap gap-1.5">
          <span className="rounded-md border border-[#DCEAEE] bg-[#F9FBFB] px-2 py-[3px] font-['Plus_Jakarta_Sans'] text-xs font-semibold leading-4 text-[#6B8790]">
            {story.category}
          </span>

          {story.secondary && (
            <span className="rounded-md bg-[#F5F8F8] px-2 py-1 font-['Plus_Jakarta_Sans'] text-xs font-bold leading-4 text-[#6B8790]">
              {story.secondary}
            </span>
          )}
        </div>

        {/* Status */}
        <div className="mt-[7px] inline-flex rounded-md bg-[#FFF5E8] px-1.5 py-0.5">
          <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold leading-4 text-[#D97706]">
            {story.status}
          </span>
        </div>

        {/* Description */}
        <p className="mt-[10px] font-['Plus_Jakarta_Sans'] text-xs font-normal leading-5 text-[#6B8790]">
          {story.description}
        </p>

        {/* Published */}
        <p className="mt-[14px] font-['Plus_Jakarta_Sans'] text-xs font-normal leading-4 text-[#6B8790]">
          {story.published}
        </p>

        {/* Buttons */}
        <div className="mt-[10px] flex items-center gap-2">
          <button
            type="button"
            className="rounded-[10px] bg-[#066879] px-3 py-2 font-['Plus_Jakarta_Sans'] text-xs font-semibold text-white"
          >
            Read Story
          </button>

          <button
            type="button"
            className="rounded-[10px] border border-[#DCEAEE] bg-white px-3 py-1.5 font-['Plus_Jakarta_Sans'] text-xs font-semibold text-[#3F6972]"
          >
            Save
          </button>
        </div>

        {/* Links */}
        {story.follow && (
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="button"
              className="font-['Plus_Jakarta_Sans'] text-xs font-semibold text-[#6B8790] underline"
            >
              Share
            </button>

            <button
              type="button"
              className="font-['Plus_Jakarta_Sans'] text-xs font-semibold text-[#6B8790] underline"
            >
              {story.follow}
            </button>

            <button
              type="button"
              className="font-['Plus_Jakarta_Sans'] text-xs font-semibold text-[#6B8790] underline"
            >
              Report an inaccuracy
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default function ConservationContent() {
  return (
    <main className="w-full bg-white font-['Plus_Jakarta_Sans']">
      {/* HERO */}
      <section className="mx-auto w-full max-w-[1232px] pt-[80px]">
        <div className="relative h-[400px] overflow-hidden rounded-[24px] bg-[#164B53]">
          {/* Background */}
          <div className="absolute inset-0 bg-[#164B53]" />

          <div className="absolute inset-0 bg-[linear-gradient(90deg,#12454D_0%,#174E56_38%,#1D5960_70%,#245E62_100%)]" />

          <div className="absolute inset-y-0 right-0 w-[58%] bg-[radial-gradient(ellipse_at_72%_45%,rgba(117,150,143,0.30)_0%,rgba(62,109,110,0.18)_35%,rgba(29,82,88,0)_72%)]" />

          <div className="absolute left-[38%] top-[-20%] h-[140%] w-[48%] rounded-full bg-[#5C8580]/10 blur-[45px]" />

          {/* Hero content */}
          <div className="relative z-10 flex h-full max-w-[680px] flex-col items-start gap-3 px-[44px] pt-[40px]">
            {/* Badge */}
            <div className="inline-flex items-center rounded-[20px] bg-white/[0.18] px-3 py-[5px]">
              <span className="whitespace-nowrap font-['Plus_Jakarta_Sans'] text-xs font-semibold leading-4 tracking-wide text-white">
                News · Conservation
              </span>
            </div>

            {/* Heading */}
            <div className="self-stretch pt-[2px]">
              <h1 className="whitespace-nowrap font-['Plus_Jakarta_Sans'] text-[36px] font-extrabold leading-[57px] text-white">
                Conservation News
              </h1>
            </div>

            {/* Description */}
            <div className="self-stretch">
              <p className="max-w-[650px] font-['Plus_Jakarta_Sans'] text-base font-normal leading-6 text-[#E7F0F0]">
                Verified-source reporting on wildlife, species recovery,
                habitats, protected areas, restoration, biodiversity science
                and conservation policy — with source, region, evidence and
                sensitive-location context kept clear.
              </p>
            </div>

            {/* Updated */}
            <div className="flex h-[40px] items-center gap-[6px] pt-[2px]">
              <div className="relative h-3 w-[10px] shrink-0">
                <div className="absolute left-[1.33px] top-[2.5px] h-2 w-2 rounded-full border border-[#DCEAEE]" />

                <div className="absolute left-[5.34px] top-[4.72px] h-[3.11px] w-[1.33px] bg-[#DCEAEE]" />
              </div>

              <p className="font-['Plus_Jakarta_Sans'] text-xs font-normal leading-5 text-[#DCEAEE]">
                Updated 34 minutes ago. Stories appear after source, safety,
                duplication, rights and sensitive-species/location checks.
              </p>
            </div>

            {/* CTA */}
            <div className="pt-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-xl bg-[#F59A23] px-4 py-2.5 font-['Plus_Jakarta_Sans'] text-sm font-semibold leading-5 text-white transition-colors hover:bg-[#E98D16]"
              >
                Explore current conservation stories
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* EVERYTHING BELOW USES SAME 1232PX WIDTH */}
      <div className="mx-auto w-full max-w-[1232px]">
        {/* Conservation Brief */}
        <section className="pt-[36px]">
          <ConservationBrief />
        </section>

        {/* Category filters */}
        <section className="pt-[24px]">
          <CategoryFilters />
        </section>

        {/* Change notification */}
        <section className="overflow-hidden rounded-t-[20px]">
          <ChangeNotice />
        </section>

        {/* Featured story */}
        <FeaturedStory />

        {/* Coverage heading */}
        <section className="pt-6 pb-1">
          <h2 className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold leading-8 text-[#073B47]">
            Current conservation coverage
          </h2>
        </section>

        {/* Coverage grid */}
        <section className="grid grid-cols-3 gap-4">
          {stories.map((story) => (
            <StoryCard key={story.title} story={story} />
          ))}
        </section>

        {/* Load more */}
        <section className="flex w-full items-center justify-center pt-7 pb-2">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-[#DCEAEE] bg-white px-4 py-2.5 font-['Plus_Jakarta_Sans'] text-sm font-semibold text-[#3F6972]"
          >
            Load more stories
          </button>
        </section>
      </div>
    </main>
  );
}