import Image from "next/image";
import Link from "next/link";
import { APP_LINKS } from "@/lib/app-links";
import SaleSticker from "./SaleSticker";

type Community = {
  name: string;
  tag: string;
  body: string;
  image: string;
  alt: string;
  open: boolean;
};

const COMMUNITIES: Community[] = [
  { name: "Cat Lovers Collective", tag: "Pets & companions", body: "Share photos, advice and daily life with fellow cat people around the world.", image: "community-cat-lovers", alt: "Two cats lounging on a bed with their owners", open: true },
  { name: "Dog Training Circle", tag: "Training & behavior", body: "Positive-reinforcement training tips, questions and wins from owners and trainers.", image: "community-dog-training", alt: "A woman training a small dog with a ring toy in a park", open: true },
  { name: "Backyard Birders", tag: "Wildlife", body: "Identify, photograph and discuss local and migratory birds with the community.", image: "community-backyard-birders", alt: "Sparrows perched on a branch", open: false },
  { name: "Senior Pet Support", tag: "Rescue & adoption", body: "Care, comfort and community for the humans of older companion animals.", image: "community-senior-pet-support", alt: "An older woman hugging a beagle", open: true },
  { name: "Reptile Keepers", tag: "Experts & vets", body: "Husbandry, enclosures and health discussion for responsible reptile owners.", image: "community-reptile-keepers", alt: "Two bearded dragons resting on someone's arm", open: false },
  { name: "Marine Life Watch", tag: "Wildlife & conservation", body: "Ocean life observation and conservation conversation, with care for sensitive sites.", image: "community-marine-life", alt: "A school of reef fish", open: true },
];

export default function FeaturedCommunities() {
  return (
    <section className="relative bg-[#F6F8F9]">
      <SaleSticker className="right-6 top-10" />
      <SaleSticker className="-left-4 bottom-10" rotate="-rotate-[28deg]" />

      <div className="mx-auto max-w-[1232px] px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-[#0F2B33] sm:text-4xl">
          Communities you&apos;ll want to be part of.
        </h2>
        <p className="mt-4 text-slate-600">
          Sample communities for layout — not real groups or membership. Imagery is illustrative.
        </p>
        <Link href="/communities-all" className="mt-5 inline-block font-bold text-[#E8892A] hover:underline">
          Browse all communities →
        </Link>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COMMUNITIES.map((c) => (
            <article key={c.name} className="overflow-hidden rounded-2xl border border-slate-700 bg-[#11242B]">
              <div className="relative aspect-[396/201]">
                <Image
                  src={`/black-friday/${c.image}.webp`}
                  alt={c.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 396px"
                  className="object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full border border-white/20 bg-[#11242B]/80 px-3 py-1 text-xs font-medium text-white">
                  {c.tag}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold text-white">{c.name}</h3>
                <p className="mt-2 min-h-[40px] text-sm leading-relaxed text-slate-300">{c.body}</p>
                <div className="mt-5 flex items-center justify-between">
                  <span className={`flex items-center gap-1.5 text-xs font-medium ${c.open ? "text-emerald-400" : "text-[#E8892A]"}`}>
                    <span className={`h-2 w-2 rounded-full ${c.open ? "bg-emerald-400" : "bg-[#E8892A]"}`} />
                    {c.open ? "Open to join" : "Request to join"}
                  </span>
                  {c.open ? (
                    <Link
                      href={APP_LINKS.signUp}
                      className="rounded-xl bg-gradient-to-b from-[#1FB3C9] to-[#0E8EA5] px-4 py-2 text-sm font-semibold text-[#0F2B33]"
                    >
                      Join
                    </Link>
                  ) : (
                    <Link
                      href={APP_LINKS.signUp}
                      className="rounded-xl border border-slate-500 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10"
                    >
                      Request
                    </Link>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/communities-all"
            className="rounded-2xl bg-[#0B6475] px-12 py-5 font-medium text-white transition-colors hover:bg-[#0D7488]"
          >
            Load more communities
          </Link>
        </div>
      </div>
    </section>
  );
}
