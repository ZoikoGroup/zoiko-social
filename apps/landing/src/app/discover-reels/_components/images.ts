/**
 * Media for the reels page.
 *
 * Only the first reel's footage was supplied. It arrived as the whole player
 * region, with the frame's drop shadow and outline baked in, so it was cropped
 * to the 9:16 photo inside and converted to WebP; the page draws the frame.
 *
 * Reels 2–6 are STAND-INS borrowed from other pages on this site. They are
 * landscape photos cropped to portrait, so they render softer than real reel
 * footage would. Replace each with a 9:16 image in /public/discover-reels.
 */
const own = (name: string) => `/discover-reels/${name}.webp`;
const standIn = (path: string) => path;

export const REEL_MEDIA = {
  goldensPark: own("reel-goldens-park"),
  catBandana: standIn("/discover-trending-now/cat-bandana.webp"),
  puppy: standIn("/discover-trending-now/puppy-australian-shepherd.webp"),
  lion: standIn("/discover-trending-now/lion-walking.webp"),
  panda: standIn("/discover-trending-now/panda-bamboo.webp"),
  goldenMeadow: standIn("/discover-trending-now/golden-retriever-meadow.webp"),
} as const;

/** Source avatars. Calm Paws Training has none and renders initials. */
export const SOURCE_AVATARS = {
  goldenRetrieverGuardians: own("avatar-golden-retriever-guardians"),
  londonCatRescue: standIn("/discover-trending-now/avatar-cat.webp"),
  verifiedVets: standIn("/discover-trending-now/avatar-labrador.webp"),
  wildlifePhotographers: standIn("/discover-trending-now/avatar-tiger.webp"),
  globalWildlifeRescue: standIn("/discover-trending-now/avatar-panda.webp"),
} as const;

/** The 14px teal verified seal, shared with the trending page. */
export const VERIFIED_BADGE = "/discover-trending-now/verified-badge.svg";
