import type { Metadata } from "next";
import Hero from "./components/Hero";
import ClinicFinder from "./components/ClinicFinder";
import FacilityProfile from "./components/FacilityProfile";

export const metadata: Metadata = {
  title: "Clinics & Hospitals | Zoiko Social Market",
  description:
    "Find clinics and hospitals with clearer trust signals — verified facilities, multi-doctor teams, specialized services, and location context.",
};

export default function MarketClinicsHospitalsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <ClinicFinder />
      <FacilityProfile />
    </div>
  );
}
