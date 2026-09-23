export interface QuickFact {
  label: string;
  value: string;
}

export interface InfoRow {
  label: string;
  value: string;
}

export interface SpecialistDetail {
  id: string;
  name: string;
  specialtyIcon: string;
  specialty: string;
  bio: string;
  heroImage: string;
  heroImageMobile: string;
  quickFacts: QuickFact[];
  areasOfExpertise: string[];
  location: InfoRow[];
  referral: {
    intro: string;
    items: string[];
  };
  appointment: InfoRow[];
}

/**
 * Hardcoded specialist detail content, keyed by the same `id` used in the
 * `/market-specialists-production/[specialistId]` route and in
 * `SpecialistList`'s `SPECIALISTS` array.
 *
 * Figma: desktop node 584:23618 ("Section - Specialist Detail (UNIQUE:
 * Focused Profile)"), mobile node 584:24022 — only Dr. Rachel Morrison's
 * profile exists in the Figma frame, so she's the only entry here. The
 * shape is deliberately generic so more specialists can be added later
 * without changing `SpecialistProfile`.
 *
 * The two breakpoints use different hero photos in Figma (desktop 584:23622
 * is her portrait; mobile 584:24027 is an unrelated golden retriever puppy
 * stock photo) — `heroImage`/`heroImageMobile` are kept separate so each
 * breakpoint matches its own frame exactly.
 */
export const SPECIALIST_DETAILS: Record<string, SpecialistDetail> = {
  "dr-rachel-morrison": {
    id: "dr-rachel-morrison",
    name: "Dr. Rachel Morrison",
    specialtyIcon: "🔬",
    specialty: "Dermatology",
    bio: "Dr. Rachel Morrison is a board-certified veterinary dermatologist with over 12 years of specialized experience treating skin conditions in dogs and cats. She is known for her comprehensive diagnostic approach and commitment to finding effective treatment solutions for allergic, infectious, and inflammatory skin conditions.",
    heroImage: "/market-specialists-production/dr-rachel-morrison-veterinary-dermatologist-new.png",
    heroImageMobile: "/market-specialists-production/dr-rachel-morrison-mobile-hero-golden-retriever-puppy.webp",
    quickFacts: [
      { label: "Specialty", value: "Dermatology" },
      { label: "Verified Status", value: "✓ Verified specialist" },
      { label: "Experience", value: "12+ years" },
      { label: "Species", value: "Dogs & Cats" },
    ],
    areasOfExpertise: [
      "Allergic dermatitis & food allergies",
      "Bacterial and yeast infections",
      "Parasitic skin conditions",
      "Autoimmune skin diseases",
      "Dermatological diagnostics",
      "Medical and surgical treatment options",
    ],
    location: [
      { label: "Address", value: "234 Pearl District Ave, Portland, OR 97214" },
      { label: "Phone", value: "(503) 555-0147" },
      { label: "Website", value: "www.morrisonvetdermatology.com" },
    ],
    referral: {
      intro:
        "Specialist consultation recommended by your primary veterinarian. Referrals may be submitted directly through your vet clinic.",
      items: [
        "General practitioner referral required",
        "Medical records transferred upon request",
        "Consultation available by appointment",
      ],
    },
    appointment: [
      { label: "Consultation duration", value: "30–45 minutes" },
      { label: "New patient status", value: "Contact clinic to confirm availability" },
      { label: "Preparation", value: "Bring medical records and previous diagnostic results" },
    ],
  },
};
