export interface Professional {
  id: string;
  name: string;
  role: string;
  practice: string;
  location: string;
  animals: string[];
  modalities: string[];
  avatar: string;
  cover: string;
  status: string; // e.g. "Accepting new clients" or "Updated Sep 27, 2026"
  isStatusDate?: boolean;
}

export interface Practice {
  id: string;
  name: string;
  location: string;
  description: string;
  verifiedCountText: string;
  cover: string;
  teamAvatars: string[];
}

export interface Category {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

export const CATEGORIES: Category[] = [
  {
    id: "veterinary",
    title: "Veterinary",
    subtitle: "Vets, practices and specialty care",
    image: "/professional-directory/category-veterinary.png",
  },
  {
    id: "training",
    title: "Training and behavior",
    subtitle: "Trainers and behavior consultants",
    image: "/professional-directory/category-training-behavior.png",
  },
  {
    id: "grooming",
    title: "Grooming",
    subtitle: "Groomers and mobile grooming",
    image: "/professional-directory/category-grooming.png",
  },
  {
    id: "nutrition",
    title: "Nutrition",
    subtitle: "Animal nutrition professionals",
    image: "/professional-directory/category-nutrition.png",
  },
  {
    id: "caregiving",
    title: "Caregiving",
    subtitle: "Pet sitters, walkers and boarding",
    image: "/professional-directory/category-caregiving.png",
  },
  {
    id: "rehabilitation",
    title: "Rehabilitation",
    subtitle: "Hydrotherapy and physical rehab",
    image: "/professional-directory/category-rehabilitation.png",
  },
];

export const SPONSORED_PRO = {
  id: "coastline",
  name: "Coastline Mobile Vets",
  role: "Mobile veterinary practice",
  location: "San Francisco Bay Area",
  modality: "Mobile",
  avatar: "/professional-directory/pro-sponsored-coastline.png",
};

export const PROFESSIONALS: Professional[] = [
  {
    id: "maya-okafor",
    name: "Dr. Maya Okafor",
    role: "Veterinarian",
    practice: "Harbor Point Veterinary Clinic",
    location: "San Francisco, CA",
    animals: ["Dogs", "Cats"],
    modalities: ["In person"],
    cover: "/professional-directory/pro-maya-okafor-cover.png",
    avatar: "/professional-directory/pro-maya-okafor-avatar.png",
    status: "Accepting new clients",
  },
  {
    id: "aaron-kim",
    name: "Aaron Kim",
    role: "Dog trainer",
    practice: "Northside Paws Training Co.",
    location: "Seattle, WA",
    animals: ["Dogs"],
    modalities: ["In person", "Virtual"],
    cover: "/professional-directory/pro-aaron-kim-cover.png",
    avatar: "/professional-directory/pro-aaron-kim-avatar.png",
    status: "Accepting new clients",
  },
  {
    id: "sofia-reyes",
    name: "Sofia Reyes",
    role: "Mobile groomer",
    practice: "Independent",
    location: "Oakland, CA",
    animals: ["Dogs", "Cats"],
    modalities: ["Mobile"],
    cover: "/professional-directory/pro-sofia-reyes-cover.png",
    avatar: "/professional-directory/pro-sofia-reyes-avatar.png",
    status: "Updated Sep 27, 2026",
    isStatusDate: true,
  },
  {
    id: "lena-ruiz",
    name: "Dr. Lena Ruiz",
    role: "Veterinary rehabilitation",
    practice: "Harbor Point Veterinary Clinic",
    location: "San Francisco, CA",
    animals: ["Dogs", "Cats"],
    modalities: ["In person", "Virtual"],
    cover: "/professional-directory/pro-lena-ruiz-cover.png",
    avatar: "/professional-directory/pro-lena-ruiz-avatar.png",
    status: "Accepting new clients",
  },
  {
    id: "james-thornton",
    name: "James Thornton",
    role: "Behavior consultant",
    practice: "Northside Paws Training Co.",
    location: "Seattle, WA",
    animals: ["Dogs", "Cats"],
    modalities: ["Virtual"],
    cover: "/professional-directory/pro-james-thornton-cover.png",
    avatar: "/professional-directory/pro-james-thornton-avatar.png",
    status: "Accepting new clients",
  },
  {
    id: "priya-nair",
    name: "Priya Nair",
    role: "Animal nutritionist",
    practice: "Independent",
    location: "London, UK",
    animals: ["Dogs", "Cats"],
    modalities: ["Virtual"],
    cover: "/professional-directory/pro-priya-nair-cover.png",
    avatar: "/professional-directory/pro-priya-nair-avatar.png",
    status: "Accepting new clients",
  },
  {
    id: "tom-gallagher",
    name: "Tom Gallagher",
    role: "Equine veterinarian",
    practice: "Riverside Equine Practice",
    location: "Dublin, Ireland",
    animals: ["Horses"],
    modalities: ["In person"],
    cover: "/professional-directory/pro-tom-gallagher-cover.png",
    avatar: "/professional-directory/pro-tom-gallagher-avatar.png",
    status: "Updated Sep 5, 2026",
    isStatusDate: true,
  },
  {
    id: "hannah-weiss",
    name: "Hannah Weiss",
    role: "Pet sitter",
    practice: "Independent",
    location: "Toronto, ON",
    animals: ["Dogs", "Cats"],
    modalities: ["In person"],
    cover: "/professional-directory/pro-hannah-weiss-cover.png",
    avatar: "/professional-directory/pro-hannah-weiss-avatar.png",
    status: "Accepting new clients",
  },
  {
    id: "kwame-mensah",
    name: "Dr. Kwame Mensah",
    role: "Avian and exotics vet",
    practice: "Greenway Exotics Clinic",
    location: "Manchester, UK",
    animals: ["Birds", "Exotics"],
    modalities: ["In person"],
    cover: "/professional-directory/pro-kwame-mensah-cover.png",
    avatar: "/professional-directory/pro-kwame-mensah-avatar.png",
    status: "Accepting new clients",
  },
];

export const PRACTICES: Practice[] = [
  {
    id: "harbor-point",
    name: "Harbor Point Veterinary Clinic",
    location: "San Francisco, CA",
    description: "Full-service companion animal clinic with an on-site rehab suite.",
    verifiedCountText: "3 verified professionals · Updated Sep 24, 2026",
    cover: "/professional-directory/practice-harbor-point-cover.png",
    teamAvatars: [
      "/professional-directory/practice-harbor-point-team-1.png",
      "/professional-directory/practice-harbor-point-team-2.png",
      "/professional-directory/practice-harbor-point-team-3.png",
    ],
  },
  {
    id: "northside-paws",
    name: "Northside Paws Training Co.",
    location: "Seattle, WA",
    description: "Group classes and one-to-one behavior plans for dogs of every age.",
    verifiedCountText: "2 verified professionals · Updated Sep 19, 2026",
    cover: "/professional-directory/practice-northside-paws-cover.png",
    teamAvatars: [
      "/professional-directory/practice-northside-paws-team-1.png",
      "/professional-directory/practice-northside-paws-team-2.png",
    ],
  },
];

export const VERIFICATION_STEPS = [
  {
    step: "01",
    title: "Apply",
    desc: "Professional submits details",
  },
  {
    step: "02",
    title: "Identity",
    desc: "Identity is confirmed",
  },
  {
    step: "03",
    title: "Credentials",
    desc: "License or training checked",
  },
  {
    step: "04",
    title: "Approved",
    desc: "Badge goes live",
  },
  {
    step: "05",
    title: "Rechecked",
    desc: "Every 12 months",
  },
];

export const FAQ_ITEMS = [
  {
    q: "What does “Verified professional” mean?",
    a: "The Verified Professional badge confirms that an animal-care provider has undergone identity verification and category-specific status checks by Zoiko Social. It indicates that the individual or practice is who they claim to be and holds verified credentials for their field. It is not an endorsement, guarantee of outcome, or subjective rating.",
  },
  {
    q: "How is Best match decided?",
    a: "Best match ranking is calculated purely on relevance: matching your active search query, selected category, species of animal, location/region, and modality (in-person, mobile, or virtual). Listings are never ranked higher based on payment, sponsorship, or advertising spend.",
  },
  {
    q: "Can professionals pay to rank higher?",
    a: "No. Organic search results in the professional directory cannot be bought or boosted. Sponsored listings are clearly labeled as 'Sponsored', displayed in a dedicated, clearly separated container, and have zero impact on organic search ranking.",
  },
  {
    q: "Why are there no star ratings?",
    a: "Zoiko Social prioritizes verified qualifications, transparent practice details, and objective standards over subjective 5-star review scores, which can easily be manipulated or brigaded. Instead, we show verification badges, licensing details, practice affiliations, and verified client history.",
  },
  {
    q: "Can I book an appointment here?",
    a: "You can view practice availability (such as 'Accepting new clients'), working modalities, and direct contact details or practice website links to schedule consultations directly with the professional or clinic.",
  },
  {
    q: "Is this for emergencies?",
    a: "No. This directory is for standard care, specialist services, consultations, training, and routine health services. If your animal is experiencing an acute medical emergency, please contact your nearest 24/7 emergency veterinary hospital immediately.",
  },
];
