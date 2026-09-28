import Hero from "./components/Hero";
import CompanyAtAGlance from "./components/CompanyAtAGlance";
import LatestNewsroomUpdates from "./components/LatestNewsroomUpdates";
import MediaResources from "./components/MediaResources";
import InterviewTopics from "./components/InterviewTopics";
import TrustGovernance from "./components/TrustGovernance";
import PressReleasesArchive from "./components/PressReleasesArchive";
import MediaInquiryForm from "./components/MediaInquiryForm";
import FAQ from "./components/FAQ";
import CTABanner from "./components/CTABanner";

export const metadata = {
  title: "Press & Media | Zoiko Social",
  description: "News, company facts, and media resources from Zoiko Social.",
};

export default function CompanyPressMediaPage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <CompanyAtAGlance />
      <LatestNewsroomUpdates />
      <MediaResources />
      <InterviewTopics />
      <TrustGovernance />
      <PressReleasesArchive />
      <MediaInquiryForm />
      <FAQ />
      <CTABanner />
    </main>
  );
}
