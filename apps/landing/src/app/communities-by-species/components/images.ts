/**
 * Imagery for the Popular communities page.
 *
 * Supplied as Figma exports with comma-separated names; each was renamed to
 * describe its subject and converted to WebP (758KB down to 77KB).
 *
 * The 42px logos are kept as supplied, but most look like mis-exports: three
 * are the same cat statue, one a map, one a "no dogs" sign, one a face. Only
 * `bird` clearly shows what its community is about. Replacing any of them is
 * a one-line change here.
 */
const img = (name: string) => `/communities-by-species/${name}.webp`;

export const COVERS = {
  dogTraining: img("cover-dog-training"),
  wildlifeRescue: img("cover-wildlife-rescue"),
  adoptionEvent: img("cover-adoption-event"),
  kittenFoster: img("cover-kitten-foster"),
  birdwatching: img("cover-birdwatching"),
  horseRescue: img("cover-horse-rescue"),
  vetClinic: img("cover-vet-clinic"),
  goldenRetriever: img("cover-golden-retriever"),
  dogAnxious: img("cover-dog-anxious"),
  wildBird: img("cover-wild-bird"),
} as const;

export const LOGOS = {
  dogTraining: img("logo-dog-training"),
  wildlife: img("logo-wildlife"),
  adoption: img("logo-adoption"),
  cat: img("logo-cat"),
  bird: img("logo-bird"),
  horse: img("logo-horse"),
  vet: img("logo-vet"),
  dog: img("logo-dog"),
  dogCalm: img("logo-dog-calm"),
} as const;
