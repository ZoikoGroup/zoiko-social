import type { Metadata } from "next";
import EmergencyFinder from "./components/EmergencyFinder";
import WhyTrust from "./components/WhyTrust";
import ProviderProfile from "./components/ProviderProfile";
import FAQ from "./components/FAQ";

export const metadata: Metadata = {
  title: "Emergency Vet Care | Zoiko Social Market",
  description:
    "Discover trusted emergency veterinary care providers in your area. A marketplace discovery tool — not an emergency dispatcher. Always confirm availability directly with the facility.",
};

export default function MarketEmergencyVetCarePage() {
  return (
    <div className="min-h-screen bg-white">
      <EmergencyFinder>
        <WhyTrust />
      </EmergencyFinder>
      <ProviderProfile />
      <FAQ />
    </div>
  );
}
