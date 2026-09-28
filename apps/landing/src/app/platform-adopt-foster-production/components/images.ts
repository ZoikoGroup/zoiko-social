/**
 * Image assets for the platform-adopt-foster-production page.
 * Downloaded from Figma node 1087:4962 with proper semantic filenames.
 */
const DIR = "/platform-adopt-foster-production";

export const IMAGES = {
  /** Section 1: Hero Search background banner */
  heroBanner: `${DIR}/hero-banner.png`,

  /** Section 2: Featured Animals */
  featured: {
    max: `${DIR}/featured-max-golden-retriever.png`,
    luna: `${DIR}/featured-luna-tabby-cat.png`,
    buddy: `${DIR}/featured-buddy-beagle.png`,
    whiskers: `${DIR}/featured-whiskers-orange-cat.png`,
    iconLocation: `${DIR}/icon-location-pin.png`,
    iconCalendar: `${DIR}/icon-calendar.png`,
  },

  /** Section 3: Animal Grid */
  grid: {
    charlie: `${DIR}/grid-charlie-labrador.png`,
    mittens: `${DIR}/grid-milo-siamese.png`,
    daisy: `${DIR}/grid-bella-german-shepherd.png`,
    shadow: `${DIR}/grid-oliver-british-shorthair.png`,
    biscuit: `${DIR}/grid-rocky-boxer.png`,
    smokey: `${DIR}/grid-cleo-calico.png`,
  },

  /** Section 4: Shelter Spotlight */
  shelterSpotlight: `${DIR}/shelter-spotlight-happy-dog.png`,

  /** Section 6: Success Stories Avatars */
  stories: {
    sarah: `${DIR}/story-sarah-max.png`,
    david: `${DIR}/story-david-luna.png`,
    emily: `${DIR}/story-emma-buddy.png`,
    lisa: `${DIR}/story-michael-whiskers.png`,
  },

  /** Section 7: Bottom CTA Banner Background */
  ctaBanner: `${DIR}/cta-banner-bg.png`,
} as const;
