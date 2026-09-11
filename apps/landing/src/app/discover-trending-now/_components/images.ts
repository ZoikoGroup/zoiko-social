/**
 * Photography for the trending page, in /public/discover-trending-now.
 *
 * The supplied files were named for pictures they did not contain — the file
 * called "Elephants walking together…" is a panda, "Gradient.png" is a golden
 * retriever — so each was renamed to describe its actual subject and converted
 * to WebP (2.51MB down to 0.24MB).
 */
const dir = "/discover-trending-now";

export const IMAGES = {
  /** Top trend: a giant panda eating bamboo. */
  panda: `${dir}/panda-bamboo.webp`,
  /** Community meetup post: a golden retriever in a sunlit meadow. */
  goldenMeadow: `${dir}/golden-retriever-meadow.webp`,
  /** Live Ask-a-Vet post: a cat in a yellow bandana, mid-meow. */
  catBandana: `${dir}/cat-bandana.webp`,
  /** Wildlife photographers' field report: a lion walking past a tree. */
  lion: `${dir}/lion-walking.webp`,
  /** Adoption-day event: an Australian shepherd puppy. */
  puppy: `${dir}/puppy-australian-shepherd.webp`,
} as const;

/** The comp's 14px teal seal shown after every verified name. */
export const VERIFIED_BADGE = `${dir}/verified-badge.svg`;

/** Round author avatars, one per account that posts on this page. */
export const AVATARS = {
  goldenRetrieverGuardians: `${dir}/avatar-golden.webp`,
  verifiedVetsNetwork: `${dir}/avatar-labrador.webp`,
  londonCatRescue: `${dir}/avatar-cat.webp`,
  wildlifePhotographers: `${dir}/avatar-tiger.webp`,
  globalWildlifeRescue: `${dir}/avatar-panda.webp`,
} as const;
