import Image from "next/image";

const TILES = [
  { label: "Companion animals", image: "everywhere-companion-animals", alt: "Two women on a porch with a small dog" },
  { label: "Wildlife & nature", image: "everywhere-wildlife-nature", alt: "A misty tree-lined road" },
  { label: "Rescue & foster", image: "everywhere-rescue-foster", alt: "A child petting a small terrier" },
  { label: "Birds & aquatics", image: "everywhere-birds-aquatics", alt: "Colorful finches on a branch" },
];

export default function CommunitiesEverywhere() {
  return (
    <section className="mx-auto max-w-[1232px] px-4 py-20 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-extrabold text-[#0F2B33] sm:text-4xl">Animal communities, everywhere.</h2>
      <p className="mt-3 max-w-[600px] leading-relaxed text-slate-500">
        Imagery below is illustrative only and does not represent specific communities, people,
        animals or locations.
      </p>
      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TILES.map((t) => (
          <figure key={t.label} className="relative aspect-[297/150] overflow-hidden rounded-2xl">
            <Image
              src={`/black-friday/${t.image}.webp`}
              alt={t.alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 297px"
              className="object-cover"
            />
            <figcaption className="absolute bottom-3 left-3 rounded-lg bg-black/55 px-3 py-1.5 text-sm font-semibold text-white">
              {t.label}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
