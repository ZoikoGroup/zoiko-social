import SpecialistCard, { type Specialist } from "./SpecialistCard";

const SPECIALISTS: Specialist[] = [
  {
    id: "dr-rachel-morrison",
    name: "Dr. Rachel Morrison",
    specialty: "Dermatology",
    avatar: "/market-specialists-production/dr-rachel-morrison-veterinary-dermatologist.webp",
    location: "Pearl District · 0.5 mi",
    species: "Dogs & Cats",
    description:
      "Specializes in allergies, skin infections, and dermatological conditions. 12+ years of experience in small animal dermatology.",
  },
  {
    id: "dr-james-okafor",
    name: "Dr. James Okafor",
    specialty: "Oncology",
    avatar: "/market-specialists-production/dr-james-okafor-veterinary-oncologist.webp",
    location: "Downtown · 1.2 mi",
    species: "Dogs, Cats & Exotic",
    description:
      "Specialized in cancer diagnosis and treatment. Board-certified veterinary oncologist with 15+ years clinical experience.",
  },
  {
    id: "dr-amy-chen",
    name: "Dr. Amy Chen",
    specialty: "Cardiology",
    avatar: "/market-specialists-production/dr-amy-chen-veterinary-cardiologist.webp",
    location: "Waterfront · 2.3 mi",
    species: "Dogs & Cats",
    description:
      "Expert in cardiac diseases, arrhythmias, and echocardiography. Specializes in treatment of heart conditions in small animals.",
  },
  {
    id: "dr-marcus-rodriguez",
    name: "Dr. Marcus Rodriguez",
    specialty: "Orthopedics",
    avatar: "/market-specialists-production/dr-marcus-rodriguez-veterinary-orthopedic-surgeon.webp",
    location: "Southeast · 3.1 mi",
    species: "Dogs & Cats",
    description:
      "Specializes in orthopedic surgery, fracture repair, and joint conditions. Experienced with advanced surgical techniques.",
  },
];

/**
 * Results count + specialist card list + "Load more" action.
 *
 * Figma: desktop 584:23507 / 584:23615, mobile 584:23915 / 584:24019.
 */
export default function SpecialistList() {
  return (
    <div className="flex w-full flex-1 flex-col items-start gap-6">
      <p className="font-jakarta text-[14px] leading-[22.4px] text-[#5e7076]">Showing 8 specialists in Portland, OR</p>

      <div className="flex w-full flex-col items-start gap-4">
        {SPECIALISTS.map((specialist) => (
          <SpecialistCard key={specialist.id} specialist={specialist} />
        ))}
      </div>

      <div className="flex w-full flex-col items-center pt-6">
        <button
          type="button"
          className="flex min-h-[40px] items-center justify-center rounded-xl border border-[#dce5e8] bg-white px-4 py-[10px] font-jakarta text-[14px] font-semibold text-[#066879]"
        >
          Load more specialists
        </button>
      </div>
    </div>
  );
}
