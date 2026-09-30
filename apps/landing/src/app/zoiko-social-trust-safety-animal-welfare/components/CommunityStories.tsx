import Image from "next/image";

interface StoryCard {
  name: string;
  role: string;
  quote: string;
  imageSrc: string;
  imageAlt: string;
}

const STORIES: StoryCard[] = [
  {
    name: "Sarah",
    role: "RESCUE COORDINATOR",
    quote:
      "“Zoiko Social helped us reach 100+ rescue partners and saved over 500 animals last year. The verification system gives us confidence.”",
    imageSrc: "/zoiko Social-trust&Safety-animal-welfare/zuaw3.png",
    imageAlt: "Sarah, Rescue Coordinator sitting in airplane cockpit",
  },
  {
    name: "Dr. Marcus",
    role: "VETERINARIAN",
    quote:
      "“Finally, a social platform that takes animal safety seriously. I feel safe sharing educational content here.”",
    imageSrc: "/zoiko Social-trust&Safety-animal-welfare/zuaw4.png",
    imageAlt: "Dr. Marcus, Veterinarian smiling in medical coat with stethoscope",
  },
  {
    name: "Emma",
    role: "ANIMAL ADVOCATE",
    quote:
      "“The community here is incredible — educated, respectful, and genuinely passionate about making a difference.”",
    imageSrc: "/zoiko Social-trust&Safety-animal-welfare/zuaw5.png",
    imageAlt: "Emma, Animal Advocate standing confidently in front of bookshelves",
  },
];

export default function CommunityStories() {
  return (
    <section className="w-full bg-white pb-20 sm:pb-24 lg:pb-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-left text-2xl font-bold tracking-tight text-[#0F2422] sm:text-3xl lg:text-[34px]">
          Stories from Our Community
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {STORIES.map((story) => (
            <div
              key={story.name}
              className="flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-md"
            >
              {/* Photo Header */}
              <div className="relative h-[210px] w-full overflow-hidden sm:h-[230px]">
                <Image
                  src={story.imageSrc}
                  alt={story.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <h3 className="text-base font-bold text-[#0F2422] sm:text-lg">
                  {story.name}
                </h3>

                <p className="mt-1 text-[11px] font-bold tracking-wider text-[#EA8A1A]">
                  {story.role}
                </p>

                <p className="mt-3.5 text-xs leading-relaxed text-[#5A7371] sm:text-sm">
                  {story.quote}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
