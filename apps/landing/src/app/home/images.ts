/**
 * Photography for the home page, in /public/home.
 *
 * The files shipped with sentence-style names that did not match their
 * contents ("Gradient.png" was a dog training class), so they were renamed to
 * short slugs describing the actual picture. Each key is the filename without
 * its extension.
 */
const dir = "/home";

export const IMAGES = {
  /** Two people crouched beside an alpaca, taking a selfie. Hero card. */
  alpacaSelfie: `${dir}/alpaca-selfie.webp`,
  /** Laughing friends in winter hats with a dog leaning in. */
  friendsWithDog: `${dir}/friends-with-dog.webp`,
  /** French bulldog in a yellow sweater against a blue backdrop. */
  frenchieSweater: `${dir}/frenchie-sweater.webp`,
  /** Wide-eyed black pug, filling the frame. */
  pug: `${dir}/pug.webp`,
  /** Five-panel strip of big cats: jaguar, lion cub, lion, leopard, cheetah. */
  bigCatCollage: `${dir}/big-cat-collage.webp`,
  /** Family under autumn trees with a golden retriever. */
  familyAutumnDog: `${dir}/family-autumn-dog.webp`,
  /** Masked veterinarian holding a rabbit in a clinic. */
  vetWithRabbit: `${dir}/vet-with-rabbit.webp`,
  /** Golden retriever carrying a tulip in its mouth. */
  goldenWithTulip: `${dir}/golden-with-tulip.webp`,
  /** Ginger cat asleep in a blanket. */
  sleepingGingerCat: `${dir}/sleeping-ginger-cat.webp`,
  /** Kingfisher perched, teal and orange plumage. */
  kingfisher: `${dir}/kingfisher.webp`,
  /** Giant panda eating bamboo. News lead story. */
  panda: `${dir}/panda.webp`,
  /** Golden retriever head-on, small square. News thumbnail. */
  goldenPortrait: `${dir}/golden-portrait.webp`,
  /** Dolphins from above at the ocean surface. News thumbnail. */
  dolphins: `${dir}/dolphins.webp`,
  /** A corgi and a terrier standing together. News thumbnail. */
  twoDogs: `${dir}/two-dogs.webp`,
  /** Cat in a yellow bandana. News thumbnail. */
  catBandana: `${dir}/cat-bandana.webp`,
  /** Two guinea pigs sharing food. */
  guineaPigs: `${dir}/guinea-pigs.webp`,
  /** People gathered outdoors around a white animal in a park. */
  meetupOutdoors: `${dir}/meetup-outdoors.webp`,
  /** Charity runners in numbered bibs with a clipboard. */
  charityRun: `${dir}/charity-run.webp`,
  /** A cat and a golden retriever curled up together. */
  catDogCuddling: `${dir}/cat-dog-cuddling.webp`,
  /** French bulldog lying on a yellow background. */
  frenchieYellow: `${dir}/frenchie-yellow.webp`,
  /** Trainer working with a room full of dogs. */
  trainingClass: `${dir}/training-class.webp`,
  /** Bengal tiger close-up. Currently unused — kept for future slots. */
  tiger: `${dir}/tiger.webp`,
} as const;
