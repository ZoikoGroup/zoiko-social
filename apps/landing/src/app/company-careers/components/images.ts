/**
 * Image assets for the company-careers page.
 * All images are properly named and downloaded from Figma node 956:3186.
 */
const DIR = "/company-careers";

export const IMAGES = {
  /** Section 1: Hero image */
  hero: `${DIR}/careers-hero.png`,

  /** Section 2: Why work here - Team brainstorming session */
  whyWorkBrainstorming: `${DIR}/why-work-team-brainstorming.png`,

  /** Section 3: Teams / Areas of Work - 8 Discipline Icons */
  teamIcons: {
    productDesign: `${DIR}/team-product-design.png`,
    engineering: `${DIR}/team-engineering.png`,
    dataAi: `${DIR}/team-data-ai.png`,
    trustSafety: `${DIR}/team-trust-safety.png`,
    contentEditorial: `${DIR}/team-content-editorial.png`,
    communitySupport: `${DIR}/team-community-support.png`,
    partnershipsGrowth: `${DIR}/team-partnerships-growth.png`,
    operationsCorporate: `${DIR}/team-operations-corporate.png`,
  },

  /** Section 5: How we hire - Interviewer and candidate in modern office */
  howWeHire: `${DIR}/how-we-hire-interview.png`,

  /** Section 6: Working principles - Cross-functional whiteboard session */
  workingPrinciples: `${DIR}/working-principles-team.png`,

  /** Section 8: Inclusion & accessibility - Inclusive workplace team */
  inclusionWorkplace: `${DIR}/inclusion-workplace.png`,

  /** Section 11: CTA Banner background */
  ctaBannerBg: `${DIR}/cta-banner-bg.png`,

  /** Section 7: Global Locations waving flags */
  flags: {
    us: `${DIR}/flag-us.png`,
    uk: `${DIR}/flag-uk.png`,
  },
} as const;
