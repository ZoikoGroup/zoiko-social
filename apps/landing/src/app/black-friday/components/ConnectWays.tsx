import Link from "next/link";
import {
  ChartNoAxesColumnIncreasing,
  Heart,
  HeartHandshake,
  LayoutGrid,
  PawPrint,
  Star,
  TextAlignStart,
  User,
  type LucideIcon,
} from "lucide-react";

const WAYS: { title: string; body: string; href: string; Icon: LucideIcon }[] = [
  { title: "All communities", body: "Browse every community available for discovery.", href: "/communities-all", Icon: LayoutGrid },
  { title: "Popular", body: "See communities with strong current activity.", href: "/communities-popular", Icon: Star },
  { title: "By species", body: "Find a community for a specific animal.", href: "/communities-by-species", Icon: PawPrint },
  { title: "Professional", body: "Communities with vets, trainers and shelters.", href: "/communities-professional", Icon: User },
  { title: "Rescue & adoption", body: "Communities focused on fostering, rescue and adoption.", href: "/communities-rescue-adoption", Icon: Heart },
  { title: "Training & behavior", body: "Learn about training and animal behavior.", href: "/communities-training-behavior", Icon: ChartNoAxesColumnIncreasing },
  { title: "Creators", body: "Follow animal creators and their communities.", href: "/discover-people", Icon: TextAlignStart },
  { title: "Memorial & support", body: "Spaces for remembrance and mutual support.", href: "/safety-support-resources", Icon: HeartHandshake },
];

export default function ConnectWays() {
  return (
    <section className="mx-auto max-w-[1232px] px-4 py-20 sm:px-6 lg:px-8">
      <h2 className="text-center text-3xl font-extrabold text-[#0F2B33] sm:text-4xl">
        However you want to connect.
      </h2>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {WAYS.map(({ title, body, href, Icon }) => (
          <Link
            key={title}
            href={href}
            className="rounded-2xl border border-[#0F2B33] bg-white p-6 transition-shadow hover:shadow-lg"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-orange-200 bg-orange-50">
              <Icon className="h-5 w-5 text-[#E8892A]" aria-hidden />
            </span>
            <h3 className="mt-4 font-bold text-[#0F2B33]">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{body}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
