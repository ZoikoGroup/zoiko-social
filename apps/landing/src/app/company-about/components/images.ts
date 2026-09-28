/**
 * Image assets for the company-about page.
 * All images are properly named and downloaded from Figma node 956:4230.
 */
const DIR = "/company-about";

export const IMAGES = {
  /** Section 1: Hero background */
  heroBg: `${DIR}/about-hero-bg.png`,

  /** Section 3: What Zoiko Social Is - 7 icons */
  whatZoikoSocialIs: {
    shareCommunicate: `${DIR}/what-share-communicate.png`,
    buildCommunities: `${DIR}/what-build-communities.png`,
    verifiedInfo: `${DIR}/what-verified-info.png`,
    adoptFoster: `${DIR}/what-adopt-foster.png`,
    professionalSupport: `${DIR}/what-professional-support.png`,
    createEvents: `${DIR}/what-create-events.png`,
    commerce: `${DIR}/what-commerce.png`,
  },

  /** Section 5: Built for Three Audiences */
  audiences: {
    individuals: `${DIR}/audience-individuals.png`,
    professionals: `${DIR}/audience-professionals.png`,
    organizations: `${DIR}/audience-organizations.png`,
  },

  /** Section 7: Global & Local banner */
  globalBanner: `${DIR}/global-communities-banner.png`,

  /** Section 8: Life Events & Rituals */
  rituals: {
    adoptionsBirthdays: `${DIR}/ritual-adoptions-birthdays.png`,
    memorials: `${DIR}/ritual-memorials.png`,
    learningTraining: `${DIR}/ritual-learning-training.png`,
    fundraisers: `${DIR}/ritual-fundraisers.png`,
    professionalGrowth: `${DIR}/ritual-professional-growth.png`,
    remembrance: `${DIR}/ritual-remembrance.png`,
  },

  /** Section 9: Zoiko Ecosystem */
  ecosystem: {
    zoikoSocial: `${DIR}/ecosystem-zoiko-social.png`,
    zoikoTv: `${DIR}/ecosystem-zoikotv.png`,
    zoikoMediaCorp: `${DIR}/ecosystem-zoiko-media-corp.png`,
  },

  /** Section 12: CTA Banner background */
  ctaBannerBg: `${DIR}/cta-banner-bg.png`,
} as const;
