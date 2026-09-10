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
  alpacaSelfie: `${dir}/alpaca-selfie.png`,
  /** Laughing friends in winter hats with a dog leaning in. */
  friendsWithDog: `${dir}/friends-with-dog.png`,
  /** French bulldog in a yellow sweater against a blue backdrop. */
  frenchieSweater: `${dir}/frenchie-sweater.png`,
  /** Wide-eyed black pug, filling the frame. */
  pug: `${dir}/pug.png`,
  /** Five-panel strip of big cats: jaguar, lion cub, lion, leopard, cheetah. */
  bigCatCollage: `${dir}/big-cat-collage.png`,
  /** Family under autumn trees with a golden retriever. */
  familyAutumnDog: `${dir}/family-autumn-dog.png`,
  /** Masked veterinarian holding a rabbit in a clinic. */
  vetWithRabbit: `${dir}/vet-with-rabbit.png`,
  /** Golden retriever carrying a tulip in its mouth. */
  goldenWithTulip: `${dir}/golden-with-tulip.png`,
  /** Ginger cat asleep in a blanket. */
  sleepingGingerCat: `${dir}/sleeping-ginger-cat.png`,
  /** Kingfisher perched, teal and orange plumage. */
  kingfisher: `${dir}/kingfisher.png`,
  /** Giant panda eating bamboo. News lead story. */
  panda: `${dir}/panda.png`,
  /** Golden retriever head-on, small square. News thumbnail. */
  goldenPortrait: `${dir}/golden-portrait.png`,
  /** Dolphins from above at the ocean surface. News thumbnail. */
  dolphins: `${dir}/dolphins.png`,
  /** A corgi and a terrier standing together. News thumbnail. */
  twoDogs: `${dir}/two-dogs.png`,
  /** Cat in a yellow bandana. News thumbnail. */
  catBandana: `${dir}/cat-bandana.png`,
  /** Two guinea pigs sharing food. */
  guineaPigs: `${dir}/guinea-pigs.png`,
  /** People gathered outdoors around a white animal in a park. */
  meetupOutdoors: `${dir}/meetup-outdoors.png`,
  /** Charity runners in numbered bibs with a clipboard. */
  charityRun: `${dir}/charity-run.png`,
  /** A cat and a golden retriever curled up together. */
  catDogCuddling: `${dir}/cat-dog-cuddling.png`,
  /** French bulldog lying on a yellow background. */
  frenchieYellow: `${dir}/frenchie-yellow.png`,
  /** Trainer working with a room full of dogs. */
  trainingClass: `${dir}/training-class.png`,
  /** Bengal tiger close-up. Currently unused — kept for future slots. */
  tiger: `${dir}/tiger.png`,
} as const;
