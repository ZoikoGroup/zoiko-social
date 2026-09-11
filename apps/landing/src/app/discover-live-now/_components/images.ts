/**
 * Photography for the live page, in /public/discover-live-now.
 *
 * The supplied files were Figma export numbers ("Background (8).png",
 * "80 (9).png", "image 13.png"), so each was identified by eye and renamed to
 * describe its subject, then converted to WebP (2.25MB down to 0.30MB).
 */
const dir = "/discover-live-now";
const f = (name: string) => `${dir}/${name}.webp`;

/** Video thumbnails, one per stream. */
export const THUMBS = {
  featured: f("featured-post-surgery"),
  horsesSanctuary: f("stream-horses-sanctuary"),
  peregrine: f("stream-peregrine-falcon"),
  puppyPaw: f("stream-puppy-paw"),
  floodRescue: f("stream-flood-rescue"),
  wingWrap: f("stream-wing-wrap"),
  catCafe: f("stream-cat-cafe"),
  adoptionDay: f("stream-adoption-day"),
  farmCalf: f("stream-farm-calf"),
  fosterCats: f("stream-foster-cats"),
  trailWalk: f("stream-trail-walk"),
  aquarium: f("stream-aquarium"),
  trailRide: f("stream-trail-ride"),
  beardedDragon: f("stream-bearded-dragon"),
} as const;

/** Round photos for the species / topic row. */
export const TOPIC_IMAGES = {
  Dogs: f("topic-dogs"),
  Cats: f("topic-cats"),
  Wildlife: f("topic-wildlife"),
  Veterinary: f("topic-veterinary"),
  Rescue: f("topic-rescue"),
  Farm: f("topic-farm"),
  Birds: f("topic-birds"),
  Horses: f("topic-horses"),
  Events: f("topic-events"),
} as const;

/**
 * Host avatars. Twelve were supplied for thirteen card hosts, so Owen
 * Blackwood has none and renders initials until a photo is added.
 */
export const AVATARS = {
  amaraOkafor: f("avatar-amara-okafor"),
  diegoFuentes: f("avatar-diego-fuentes"),
  urbanBirdRescue: f("avatar-urban-bird-rescue"),
  priyaNatarajan: f("avatar-priya-natarajan"),
  coastalRescue: f("avatar-coastal-rescue"),
  reneeCastillo: f("avatar-renee-castillo"),
  whiskerLounge: f("avatar-whisker-lounge"),
  cityShelter: f("avatar-city-shelter"),
  greenPastures: f("avatar-green-pastures"),
  ruthAlcantara: f("avatar-ruth-alcantara"),
  marcusWebb: f("avatar-marcus-webb"),
  sofiaMarchetti: f("avatar-sofia-marchetti"),
  theoMarsh: f("avatar-theo-marsh"),
} as const;

/** The safety banner's background photograph, already colour-graded. */
export const SAFETY_BANNER = f("safety-banner");
