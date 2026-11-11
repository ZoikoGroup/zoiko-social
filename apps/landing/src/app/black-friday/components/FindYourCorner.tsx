import Image from "next/image";
import Link from "next/link";
import {
  Activity,
  ChartNoAxesColumnIncreasing,
  Heart,
  PawPrint,
  User,
  Video,
  type LucideIcon,
} from "lucide-react";

const CORNERS: { label: string; image: string; alt: string; href: string; Icon: LucideIcon }[] = [
  { label: "Pets & companions", image: "corner-pets-companions", alt: "Two dogs greeting each other on the grass", href: "/communities-by-species", Icon: PawPrint },
  { label: "Rescue & adoption", image: "corner-rescue-adoption", alt: "A rescued terrier held in someone's arms", href: "/communities-rescue-adoption", Icon: Heart },
  { label: "Training & behavior", image: "corner-training-behavior", alt: "Dogs lying calmly at a training class", href: "/communities-training-behavior", Icon: ChartNoAxesColumnIncreasing },
  { label: "Wildlife & conservation", image: "corner-wildlife-conservation", alt: "Conservationists examining a tiger's paw", href: "/communities-wildlife-conservation", Icon: Activity },
  { label: "Experts & vets", image: "corner-experts-vets", alt: "Two veterinarians with a beagle", href: "/communities-professional", Icon: User },
  { label: "Creators", image: "corner-creators", alt: "Someone filming a dog on a desert hilltop", href: "/discover-people", Icon: Video },
];

export default function FindYourCorner() {
  return (
    <section className="mx-auto max-w-[1232px] px-4 py-20 sm:px-6 lg:px-8">
      <h2 className="text-center text-3xl font-extrabold text-[#0F2B33] sm:text-4xl">
        Find your corner of the animal world.
      </h2>
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {CORNERS.map(({ label, image, alt, href, Icon }) => (
          <Link
            key={label}
            href={href}
            className="group relative aspect-[194/205] overflow-hidden rounded-2xl border border-[#0F2B33]/60"
          >
            <Image
              src={`/black-friday/${image}.webp`}
              alt={alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 194px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
            <div className="absolute inset-x-3 bottom-3 flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">
                <Icon className="h-5 w-5 text-cyan-500" aria-hidden />
              </span>
              <span className="text-sm font-bold leading-tight text-white">{label}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
