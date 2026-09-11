import type { Metadata } from "next";
import ReelsViewer from "./_components/ReelsViewer";
import { C } from "./_components/theme";

export const metadata: Metadata = {
  title: "Reels | Zoiko Social",
  description: "Short videos from across the Zoiko Social animal community.",
};

export default function DiscoverReelsPage() {
  return (
    <div className="min-h-screen" style={{ background: C.page }}>
      <ReelsViewer />
    </div>
  );
}
