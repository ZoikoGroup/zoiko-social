import type { Metadata } from "next";
import Hero from "./components/Hero";
import VetFinder from "./components/VetFinder";
import ProviderProfile from "./components/ProviderProfile";

export const metadata: Metadata = {
  title: "Veterinarians | Zoiko Social Market",
  description:
    "Find veterinarians with clearer trust signals — verified provider details, location context, and care information for a more informed next step.",
};

export default function MarketVeterinariansPage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <VetFinder />
      <ProviderProfile />
    </div>
  );
}
