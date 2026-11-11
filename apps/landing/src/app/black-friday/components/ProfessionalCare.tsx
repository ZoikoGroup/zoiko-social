import Image from "next/image";
import Link from "next/link";

const SERVICES = [
  { title: "Veterinarians", body: "Find certified vets in your area accepting new patients", icon: "icon-veterinarians", href: "/market-veterinarians", cta: "Explore" },
  { title: "Clinics & Hospitals", body: "Full-service facilities for comprehensive animal care", icon: "icon-clinics-hospitals", href: "/market-clinics-hospitals", cta: "Explore" },
  { title: "Specialists", body: "Dermatology, oncology, orthopedics, and more", icon: "icon-specialists", href: "/market-specialists-production", cta: "Explore" },
];

const PROFILES = [
  { name: "Dr. Sarah Mitchell, DVM", meta: "General Practice • 15+ years experience • Accepting new patients", image: "vet-sarah-mitchell", alt: "Portrait of Dr. Sarah Mitchell" },
  { name: "Riverside Veterinary Clinic", meta: "Full-service clinic • Multiple vets • Open 7 days a week", image: "vet-riverside-clinic", alt: "Riverside Veterinary Clinic staff with a dog" },
];

export default function ProfessionalCare() {
  return (
    <section className="bg-[#F6F8F9]">
      <div className="mx-auto max-w-[1232px] px-4 py-20 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-[#0B6475] sm:text-4xl">Professional Care</h2>
        <p className="mt-3 text-slate-600">
          Find veterinarians, clinics, hospitals, and specialists for routine and specialized care.
        </p>
        <hr className="mt-6 border-slate-200" />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
          <ServiceCard
            title="Emergency Vet Care"
            body="Urgent care and emergency services"
            icon="icon-emergency-vet-care"
            href="/market-emergency-vet-care"
            cta="Find Now"
            emergency
          />
        </div>

        <h3 className="mt-20 text-2xl font-bold text-[#0F2B33]">Veterinarians</h3>
        <p className="mt-2 text-slate-600">
          Licensed veterinarians providing routine checkups, vaccinations, and preventive care
        </p>
        <div className="mt-10 flex flex-col gap-4">
          {PROFILES.map((p) => (
            <div
              key={p.name}
              className="flex flex-col gap-5 rounded-3xl border border-slate-200 bg-white px-6 py-10 sm:flex-row sm:items-center"
            >
              <Image
                src={`/black-friday/${p.image}.webp`}
                alt={p.alt}
                width={76}
                height={76}
                className="rounded-xl"
              />
              <div className="flex-1">
                <p className="font-semibold text-slate-700">{p.name}</p>
                <p className="mt-2 text-slate-600">{p.meta}</p>
              </div>
              <Link
                href="/professional-directory"
                className="self-start rounded-xl border border-[#0B6475] bg-cyan-50 px-6 py-3 text-sm font-semibold text-[#0B6475] transition-colors hover:bg-cyan-100 sm:self-center"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  title,
  body,
  icon,
  href,
  cta,
  emergency = false,
}: {
  title: string;
  body: string;
  icon: string;
  href: string;
  cta: string;
  emergency?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center rounded-3xl border-2 px-6 py-8 text-center ${
        emergency ? "border-[#E8892A] bg-orange-50" : "border-slate-200 bg-white"
      }`}
    >
      <Image src={`/black-friday/${icon}.webp`} alt="" width={48} height={48} />
      <h3 className="mt-5 text-lg font-bold text-[#0F2B33]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
      <Link
        href={href}
        className={`mt-5 rounded-full px-6 py-2.5 text-sm font-bold text-white transition-colors ${
          emergency ? "bg-[#E8892A] hover:bg-[#D67A1E]" : "bg-[#0B6475] hover:bg-[#0D7488]"
        }`}
      >
        {cta}
      </Link>
    </div>
  );
}
