import Image from "next/image";
import { IMAGES } from "./images";
import { C } from "./theme";

interface SuccessStory {
  id: string;
  quote: string;
  author: string;
  subtext: string;
  avatar: string;
}

const STORIES: SuccessStory[] = [
  {
    id: "sarah-john",
    quote:
      '"Max has completely transformed our lives! He\'s brought so much joy and love into our home. We can\'t imagine life without him."',
    author: "Sarah & John Martinez",
    subtext: "Adopted Max • 6 months ago",
    avatar: IMAGES.stories.sarah,
  },
  {
    id: "david",
    quote:
      '"Luna came to us as a scared shelter cat. Now she\'s the sweetest, most affectionate friend. Adoption was the best decision we made."',
    author: "David Thompson",
    subtext: "Adopted Luna • 1 year ago",
    avatar: IMAGES.stories.david,
  },
  {
    id: "emily",
    quote:
      '"Being a foster parent has been the most rewarding experience. Helping animals find their forever homes is truly life-changing."',
    author: "Emily Chen",
    subtext: "Foster parent • 12 foster animals",
    avatar: IMAGES.stories.emily,
  },
  {
    id: "lisa-mike",
    quote:
      '"Being a foster parent has been the most rewarding experience. Helping animals find their forever homes is truly life-changing."',
    author: "Lisa & Mike Johnson",
    subtext: "Foster-to-Adopt • 3 months ago",
    avatar: IMAGES.stories.lisa,
  },
];

export default function SuccessStoriesSection() {
  return (
    <section className="w-full bg-[#F7F9FA] pb-16 lg:pb-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        {/* Section Heading */}
        <h2 className="text-center text-2xl font-extrabold tracking-[-0.01em] text-[#102A32] sm:text-3xl lg:text-[36px] lg:leading-[43.2px]">
          💕 Adoption Success Stories
        </h2>

        {/* 2x2 Testimonial Cards Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {STORIES.map((story) => (
            <div
              key={story.id}
              className="flex flex-col justify-between rounded-[28px] border border-[#DCE5E8] bg-white p-6 sm:p-8 shadow-sm transition hover:shadow-md"
            >
              <p className="text-base font-normal leading-relaxed text-[#102A32] sm:text-[16px] sm:leading-[25.6px]">
                {story.quote}
              </p>

              <div className="mt-6 flex items-center gap-4 border-t border-[#DCE5E8]/60 pt-4">
                {/* 56x56 Avatar */}
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-slate-100 ring-2 ring-[#066879]/10">
                  <Image
                    src={story.avatar}
                    alt={story.author}
                    fill
                    className="object-cover object-center"
                  />
                </div>

                <div>
                  <h3
                    className="text-base font-bold"
                    style={{ color: C.mosque }}
                  >
                    {story.author}
                  </h3>
                  <p className="text-xs font-normal text-[#5E7076]">
                    {story.subtext}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
