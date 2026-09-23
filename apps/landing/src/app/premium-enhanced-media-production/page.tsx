import type { Metadata } from "next";
import Hero from "./components/Hero";
import CompareQuality from "./components/CompareQuality";
import MediaTiers from "./components/MediaTiers";
import WhatYouCanDo from "./components/WhatYouCanDo";
import EnhancedCapabilities from "./components/EnhancedCapabilities";
import WhatYouGetDontGet from "./components/WhatYouGetDontGet";
import CheckAccessBanner from "./components/CheckAccessBanner";
import PricingPlans from "./components/PricingPlans";
import FinalCta from "./components/FinalCta";

export const metadata: Metadata = {
  title: "Premium Enhanced Media | Zoiko Social",
  description:
    "Share photos and videos with enhanced quality capabilities. Premium uploads support higher-resolution content with improved processing and playback quality.",
};

/**
 * Premium > Enhanced Media.
 *
 * Figma: desktop node 732:5123 ("zoikoSocial-premium-enhanced-media-production"),
 * mobile node 732:5550 ("412w light"). One responsive tree — Tailwind's `lg:`
 * breakpoint switches layout; several sections are breakpoint-exclusive
 * because their content genuinely only exists on one frame (confirmed via
 * get_metadata on both frames end to end, not assumed):
 *  - Hero: mobile has a literal breadcrumb text node desktop lacks; desktop
 *    has a real 3-photo collage mobile lacks. See Hero.tsx.
 *  - "Compare media quality" and "Media quality tiers" exist on both, but
 *    with per-breakpoint-different example photos, and Tiers additionally
 *    has a structurally different card design per breakpoint (desktop:
 *    plain photo cards; mobile: emoji + bullet-list cards). See
 *    CompareQuality.tsx / MediaTiers.tsx.
 *  - "What you can do" (4 cards: Upload 4K photos, Longer videos, Batch
 *    upload, Edit before posting) exists ONLY on desktop (732:518/522).
 *  - "Enhanced capabilities" (4 cards: Photo Upload, Video Upload,
 *    Processing, Playback) and "What you get and don't get" (available vs.
 *    not-included checklists + a warning callout) exist ONLY on mobile
 *    (732:5681/5685 and 732:5758/5761/5806) — desktop's metadata goes
 *    straight from "Media quality tiers" to the "Check your media access"
 *    CTA banner with no equivalent nodes at any id.
 *  - "Check your media access" and "Choose your Premium plan" have
 *    identical copy on both breakpoints, just responsive layout.
 *  - The final "Share better quality content" CTA exists on both, but
 *    desktop uses a full-bleed photo background or mobile uses a plain
 *    background — see FinalCta.tsx.
 *
 * Neither frame's own content nodes include a breadcrumb component (the
 * mobile "Home / Premium / Enhanced Media" line lives inside the Hero
 * section itself, reproduced there) and header/footer are already rendered
 * by the root layout, so this page only renders page-specific sections
 * between them.
 */
export default function PremiumEnhancedMediaProductionPage() {
  return (
    <>
      <Hero />
      <CompareQuality />
      <MediaTiers />
      <WhatYouCanDo />
      <EnhancedCapabilities />
      <WhatYouGetDontGet />
      <CheckAccessBanner />
      <PricingPlans />
      <FinalCta />
    </>
  );
}
