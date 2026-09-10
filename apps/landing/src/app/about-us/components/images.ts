/**
 * Photography for the about-us page.
 *
 * The supplied files were sentence-named PNGs whose names did not describe
 * their contents — "Gradient.png" was the hero photograph, and the file named
 * for a volunteer holding a cat is a ginger cat asleep on a bed. They have
 * been renamed to content-accurate slugs and converted to WebP (3.04MB total
 * down to 0.25MB), so these paths need no escaping.
 */
const dir = "/about-us";

export const IMAGES = {
  /** Hero: people on a boardwalk with a dog, already colour-graded teal. */
  heroBoardwalk: `${dir}/hero-boardwalk.webp`,
  /** "Who we are": a ginger cat asleep on a bed. */
  sleepingCat: `${dir}/sleeping-cat.webp`,
  /** "What we build" collage, tall left panel: an Australian shepherd puppy. */
  collagePuppy: `${dir}/puppy-australian-shepherd.webp`,
  /** "What we build" collage, upper right: a French bulldog in a yellow hoodie. */
  collageFrenchie: `${dir}/french-bulldog-hoodie.webp`,
  /** "What we build" collage, lower right: a labrador puppy in a bow tie. */
  collageLabrador: `${dir}/labrador-bow-tie.webp`,
  /** Locations: the Sacramento skyline at dusk. */
  sacramento: `${dir}/sacramento-skyline.webp`,
  /** Locations: an aerial view of London and the Thames. */
  london: `${dir}/london-aerial.webp`,
  /** "Work with us": a laptop on a desk. */
  workspace: `${dir}/workspace-laptop.webp`,
  /** Unplaced in the comp — a black pug close-up, kept for future use. */
  pug: `${dir}/pug-portrait.webp`,
} as const;
