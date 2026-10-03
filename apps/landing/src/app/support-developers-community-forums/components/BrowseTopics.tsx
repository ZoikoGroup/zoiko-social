import Image from "next/image";
import { C } from "./theme";

const TOPICS = [
  {
    title: "Pet care talk",
    body: "Everyday tips for happy, healthy animals.",
    icon: "icon-heart",
    photo: "topic-pet-care-talk",
    mobilePhoto: "topic-pet-care-talk-mobile",
  },
  {
    title: "Rescue and adoption",
    body: "Stories and advice from adopters and rescuers.",
    icon: "icon-paw",
    photo: "topic-rescue-adoption",
    mobilePhoto: "topic-rescue-adoption-mobile",
  },
  {
    title: "Wildlife and conservation",
    body: "Protecting animals in the wild.",
    icon: "icon-leaf",
    photo: "topic-wildlife-conservation",
    mobilePhoto: "topic-wildlife-conservation-mobile",
  },
  {
    title: "Running a community",
    body: "Grow and moderate your own group.",
    icon: "icon-users",
    photo: "topic-running-community",
    mobilePhoto: "topic-running-community-mobile",
  },
  {
    title: "Using Zoiko Social",
    body: "Share how you get the most from the platform.",
    icon: "icon-sparkle",
    photo: "topic-using-zoiko-social",
    mobilePhoto: "topic-using-zoiko-social-mobile",
  },
  {
    title: "Developers",
    body: "Talk shop about integrations with other builders.",
    icon: "icon-code",
    photo: "topic-developers",
    mobilePhoto: "topic-developers-mobile",
  },
];

/** Section - 04 · TOPICS — "Browse topics", a 3x2 (2x3 on mobile) card grid. */
export default function BrowseTopics() {
  return (
    <section className="w-full bg-white px-4 py-10 sm:px-8 sm:py-14 lg:px-[105px] lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 lg:gap-10">
        <div className="flex flex-col gap-2.5">
          <h2 className="text-[28px] font-extrabold tracking-[-0.36px] sm:text-3xl lg:text-4xl" style={{ color: C.brandDeep }}>
            Browse topics
          </h2>
          <p className="text-base leading-[27.2px] sm:text-[17px]" style={{ color: C.muted }}>
            Find people who care about the same animals as you.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOPICS.map((topic) => (
            <article
              key={topic.title}
              className="flex flex-col overflow-hidden rounded-[20px] border bg-white shadow-[0px_1px_2px_0px_rgba(7,59,71,0.06)]"
              style={{ borderColor: C.line }}
            >
              <div className="relative h-[150px] w-full">
                <div
                  className="absolute inset-0"
                  style={{ backgroundImage: `linear-gradient(135deg, ${C.brand} 0%, ${C.orange} 100%)` }}
                />
                <Image
                  src={`/support&developers-community-forums/${topic.mobilePhoto}.webp`}
                  alt=""
                  fill
                  sizes="100vw"
                  className="object-cover lg:hidden"
                />
                <Image
                  src={`/support&developers-community-forums/${topic.photo}.webp`}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="hidden object-cover lg:block"
                />
                <div
                  className="absolute left-6 top-[128px] flex size-11 items-center justify-center rounded-xl border bg-white shadow-[0px_1px_1px_rgba(7,59,71,0.06)]"
                  style={{ borderColor: C.line }}
                >
                  <Image src={`/support&developers-community-forums/${topic.icon}.webp`} alt="" width={20} height={20} />
                </div>
              </div>
              <div className="flex flex-col gap-2 px-6 pb-[22px] pt-[34px]">
                <h3 className="text-lg font-bold tracking-[-0.095px] sm:text-[19px]" style={{ color: C.brandDeep }}>
                  {topic.title}
                </h3>
                <p className="min-h-6 text-[15px]" style={{ color: C.muted }}>
                  {topic.body}
                </p>
                <div className="flex items-center gap-1 pt-1.5">
                  <span className="text-[15px] font-semibold" style={{ color: C.brand }}>
                    View discussions
                  </span>
                  <Image src="/support&developers-community-forums/icon-chevron-right.webp" alt="" width={16} height={16} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
