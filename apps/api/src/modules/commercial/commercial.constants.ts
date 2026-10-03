export const COMMERCIAL_PLANS = {
  seller_professional: {
    monthlyPriceUsd: 24.99,
    annualPriceUsd: 249,
    limits: {
      activeProducts: 100,
    },
  },
  care_professional: {
    monthlyPriceUsd: 39.99,
    annualPriceUsd: 399,
    limits: {
      locations: 1,
      teamMembers: 10,
      activeServices: 50,
    },
  },
  breeder_professional: {
    monthlyPriceUsd: 29.99,
    annualPriceUsd: 299,
    limits: {
      activeProfiles: 5,
    },
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
