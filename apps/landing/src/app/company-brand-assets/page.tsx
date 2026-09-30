import type { Metadata } from "next";
import Hero from "./components/Hero";
import AssetFinder from "./components/AssetFinder";
import { ColorSystem, MediaKit, Typography, UsagePrinciples } from "./components/Guidelines";
import { CTA, Changelog, FAQ, Rights } from "./components/Policies";

export const metadata: Metadata = {
  title: "Brand Assets | Zoiko Social",
  description:
    "Download approved Zoiko Social logos, colors, typography, and usage guidelines — everything you need to represent Zoiko Social accurately and consistently.",
};

export default function CompanyBrandAssetsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <AssetFinder />
      <ColorSystem />
      <Typography />
      <UsagePrinciples />
      <MediaKit />
      <Rights />
      <Changelog />
      <FAQ />
      <CTA />
    </div>
  );
}
