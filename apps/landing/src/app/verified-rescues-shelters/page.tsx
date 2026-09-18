
import Hero from "./components/hero";
import { C } from "./components/theme";
import VerifiedByZoikoNotice from "./components/VerifiedByZoikoNotice";
import VerifiedOrganizations from "./components/VerifiedOrganizations";

export default function VerifiedRescuesSheltersPage() {
  return (
    <main style={{ backgroundColor: C.page }}>
      <Hero />
      <VerifiedByZoikoNotice />
      <VerifiedOrganizations />
    </main>
  );
}