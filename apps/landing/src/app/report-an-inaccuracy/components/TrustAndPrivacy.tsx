import Link from "next/link";
import { ShieldAlert, Info, ExternalLink } from "lucide-react";

export default function TrustAndPrivacy() {
  return (
    <section className="max-w-3xl mx-auto px-6 pt-24 pb-10 text-center">
      <h2 className="text-[#073B47] text-[32px] font-extrabold mb-12">Trust & privacy</h2>
      
      <div className="space-y-10 text-left">
        <div className="flex gap-4">
          <div className="mt-1 flex-shrink-0 text-[#102A32]">
             <ShieldAlert size={20} />
          </div>
          <div>
            <h3 className="text-[#102A32] font-bold text-[19px] mb-1">Evidence stays private</h3>
            <p className="text-[#102A32] text-base">Files and links you submit are never published, and are used only for editorial review.</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="mt-1 flex-shrink-0 text-[#102A32]">
             <Info size={20} />
          </div>
          <div>
            <h3 className="text-[#102A32] font-bold text-[19px] mb-1">No public accusation</h3>
            <p className="text-[#102A32] text-base">Reports are never displayed as public claims. There's no vote count, share button, or comment thread here.</p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="mt-1 flex-shrink-0 text-[#102A32]">
             <ExternalLink size={20} />
          </div>
          <div>
            <h3 className="text-[#102A32] font-bold text-[19px] mb-1">Read Source Standards</h3>
            <p className="text-[#102A32] text-base mb-2">See how we rate publishers and what a rating does and doesn't mean.</p>
            <Link href="/source-standards" className="text-[#066879] font-semibold flex items-center gap-1 hover:underline">
              Source Standards <span className="text-xs">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
