import { appUrl } from "@/lib/app-links";

/**
 * The app has no public event-creation form yet, so "Create Event" and the
 * hosting CTA point at the events feed in the app, as the other event landing
 * pages do.
 */
export const APP_EVENTS_URL = appUrl("/events");

/*
 * The Figma mock marks the photo slots with placeholders, and this route has
 * no photography of its own under /public yet. Until dedicated assets are
 * exported, the slots reuse existing photos from the other event pages so
 * nothing renders empty. Swapping in /platform-events/*.webp later is a
 * one-line change per slot.
 */
export const IMG = {
  hero: "/events-rescue/hero-adoption-day.webp",
  featured: "/events-upcoming/adoption-weekend.webp",
  whatAreEvents: "/events-rescue/rescue-picnic.webp",
  hostAnEvent: "/market/1.png",
} as const;

/** Category chips above the filters. */
export const CATEGORIES = [
  "All events",
  "Adoption & Rescue",
  "Training & Education",
  "Community & Wellness",
  "Fundraising & Advocacy",
] as const;

/** The three event cards under the category chips. */
export const EVENT_CARDS = [
  {
    id: "furever-home",
    category: "Adoption",
    title: "Furever Home Adoption Festival",
    date: "03 October, 2026",
    location: "Bryant Park, New York City, New York, USA",
    description:
      "Meet rescue dogs and puppies from local shelters looking for loving homes. The festival features adoption counseling, meet-and-greet play areas, pet care resources, family activities, and local pet vendors throughout the day.",
    organizer: "Best Friends Animal Society",
    image: "/events-rescue/all-weekend-adoption.webp",
    imageAlt: "A person greeting a small rescue dog at an outdoor festival",
  },
  {
    id: "canine-training",
    category: "Training",
    title: "Canine Training Workshop",
    date: "18 October 2026, 9:00AM - 12:30PM",
    location: "Griffith Park, Los Angeles, California, USA",
    description:
      "Join certified dog trainers for an interactive outdoor workshop designed for puppies and adult dogs. Learn leash manners, recall training, socialization skills, and positive reinforcement techniques through live demonstrations and hands-on practice.",
    organizer: "GoodPup Training Collective",
    image: "/events-training-workshops/type-behavior-training.webp",
    imageAlt: "A trainer working with a dog on a grassy field",
  },
  {
    id: "paws-purpose",
    category: "Fundraising",
    title: "Paws & Purpose Charity Walk",
    date: "1 November 2026, 8:00 AM - 1:00 PM CDT",
    location: "Zilker Metropolitan Park, Austin, Texas, USA",
    description:
      "Walk alongside fellow animal lovers to raise funds for rescue shelters, emergency veterinary care, and adoption programs. Enjoy live music, food trucks, pet-friendly activities, sponsor booths, and fundraising challenges throughout the event.",
    organizer: "ASPCA Community Fund",
    image: "/events-upcoming/sanctuary-5k.webp",
    imageAlt: "A group of people walking dogs along a park path",
  },
] as const;

/** The "What are Zoiko Events?" arrow rows. */
export const PLATFORM_FEATURES = [
  {
    title: "Transparent information",
    detail: "— Date, time, location, organizer, and description from event source",
  },
  {
    title: "Verified organizers",
    detail: "— Hosting organizations are identified and verified",
  },
  {
    title: "Multiple formats",
    detail: "— In-person, virtual, and hybrid events from your community",
  },
  {
    title: "Discovery tools",
    detail: "— Filter by category, date, location, and event type",
  },
  {
    title: "Safe participation",
    detail: "— Community standards and safety guidelines apply",
  },
  {
    title: "Event updates",
    detail: "— Real-time status changes (canceled, rescheduled, etc.)",
  },
] as const;

/** The three trust cards. */
export const TRUST_CARDS = [
  {
    title: "🛡️ Source-backed",
    body: "Every event comes from verified organizers. No invented events, dates, or descriptions.",
  },
  {
    title: "✓ Verified organizers",
    body: "Event hosts are identified and verified. We clearly show organizer name and status.",
  },
  {
    title: "📋 Community standards",
    body: "Events must follow our community standards. Safety and welfare are non-negotiable.",
  },
] as const;

/** The ✓ rows in "Host an event on Zoiko Social". */
export const HOSTING_POINTS = [
  "Reach verified animal community members",
  "Get event details in front of interested participants",
  "Manage registrations and updates easily",
  "Connect with rescue and welfare organizations",
  "Build trust through verified organizer status",
] as const;
