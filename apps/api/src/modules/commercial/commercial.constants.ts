export const SERVICE_LIMITS = {
  seller: {
    activeProducts: 100,
  },
  care: {
    locations: 1,
    teamMembers: 10,
    activeServices: 50,
  },
  vet: {
    locations: 1,
    teamMembers: 10,
    activeServices: 50,
  },
  breeder: {
    activeProfiles: 5,
  },
} as const;

export const COMMERCIAL_PLANS = {
  starter: {
    id: 'starter',
    name: 'Starter',
    monthlyPriceUsd: 19.99,
    annualPriceUsd: 199,
    maxServicesAllowed: 1,
    description: 'Perfect for single service providers getting started.',
    serviceLimits: SERVICE_LIMITS,
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    monthlyPriceUsd: 29.99,
    annualPriceUsd: 299,
    maxServicesAllowed: 2,
    description: 'Ideal for growing businesses running one or two services.',
    serviceLimits: SERVICE_LIMITS,
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    monthlyPriceUsd: 49.99,
    annualPriceUsd: 499,
    maxServicesAllowed: 4, // All 4 available services (seller, breeder, care, vet)
    description: 'Full suite access with all 4 commercial services included.',
    serviceLimits: SERVICE_LIMITS,
  },
  // Backward compatibility aliases if needed
  seller_professional: {
    id: 'starter',
    name: 'Starter',
    monthlyPriceUsd: 19.99,
    annualPriceUsd: 199,
    maxServicesAllowed: 1,
    description: 'Starter tier',
    serviceLimits: SERVICE_LIMITS,
  },
  breeder_professional: {
    id: 'professional',
    name: 'Professional',
    monthlyPriceUsd: 29.99,
    annualPriceUsd: 299,
    maxServicesAllowed: 2,
    description: 'Professional tier',
    serviceLimits: SERVICE_LIMITS,
  },
  care_professional: {
    id: 'premium',
    name: 'Premium',
    monthlyPriceUsd: 49.99,
    annualPriceUsd: 499,
    maxServicesAllowed: 3,
    description: 'Premium tier',
    serviceLimits: SERVICE_LIMITS,
  },
} as const;

export const COMMERCIAL_ADDONS = {
  care_additional_location: {
    monthlyPriceUsd: 19.99,
  },
} as const;

export const FREE_ANTI_ABUSE_LIMITS = {
  adoption: {
    individual: 3,
    verified_organization: 50,
  },
  events: {
    standard: 20,
  },
} as const;
