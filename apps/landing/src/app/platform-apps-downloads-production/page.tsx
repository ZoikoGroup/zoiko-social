import type { Metadata } from "next";
import Hero from "./components/Hero";
import ChoosePlatform from "./components/ChoosePlatform";
import OfficialApps from "./components/OfficialApps";
import SystemRequirements from "./components/SystemRequirements";
import WhyDownload from "./components/WhyDownload";
import GettingStarted from "./components/GettingStarted";
import OfficialSource from "./components/OfficialSource";
import VersionUpdates from "./components/VersionUpdates";
import Faq from "./components/Faq";
import FinalCta from "./components/FinalCta";

export const metadata: Metadata = {
  title: "Apps & Downloads | Zoiko Social",
  description:
    "Download the Zoiko Social app for iOS and Android, or use the web app. System requirements, official download sources, version info, and answers to common questions.",
};

/**
 * Platform > Apps & Downloads.
 *
 * Figma: desktop frame "zoikoSocial-platform-apps-downloads-production"
 * (1440w light, 6867px tall). Section order, copy, and backgrounds follow
 * that frame end to end:
 *   Hero ("Download Zoiko Social Today") → Choose Your Platform (4 cards)
 *   → Official Zoiko Social Apps (2×2) → System Requirements (3 columns)
 *   → Why Download Zoiko Social? (3 cards) → Getting Started in 3 Steps
 *   → Official Source & Security (✓ checklist panel) → Current Version &
 *   Updates → FAQ (9-item accordion) → "Ready to join" CTA panel.
 *
 * The frame's own header (search bar, tab nav, Join Free) and footer are
 * already reproduced by the root layout, so this page only renders the
 * page-specific sections between them. Photos and icons were exported to
 * /public/platform-apps-downloads-production and are placed per section:
 * the 1440x399 hero photo, the 1230x344 CTA panel photo, the four 36px
 * platform icons (Apple, smartphone, globe, desktop), and the 36px
 * feature icons (devices, sync — the bell icon for "Push Notifications"
 * was not exported; the frame's slot renders an inline SVG fallback).
 */
export default function PlatformAppsDownloadsProductionPage() {
  return (
    <>
      <Hero />
      <ChoosePlatform />
      <OfficialApps />
      <SystemRequirements />
      <WhyDownload />
      <GettingStarted />
      <OfficialSource />
      <VersionUpdates />
      <Faq />
      <FinalCta />
    </>
  );
}
