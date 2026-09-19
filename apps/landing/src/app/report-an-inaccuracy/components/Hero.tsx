import Image from "next/image";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="max-w-6xl mx-auto px-6 pt-10">
      <div className="bg-white rounded-3xl shadow-sm border border-[#E5E7EB] p-10 flex flex-col md:flex-row gap-10">
        <div className="flex-1 space-y-6">
          <h2 className="text-[#073B47] text-base font-semibold">News &middot; Editorial Standards</h2>
          <h1 className="text-[#073B47] text-3xl md:text-4xl font-extrabold tracking-tight">Report an Inaccuracy</h1>
          <p className="text-[#5E7076] text-lg leading-relaxed max-w-lg">
            A precise, traceable way to flag a suspected factual error in a Zoiko
            Social News story — separate from safety reporting, platform
            moderation, and legal notices. You'll get a case you can track, without
            turning this into a public accusation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="#submit-report" className="bg-[#066879] hover:bg-[#055765] text-white px-8 py-3 rounded-xl font-semibold text-center transition-colors">
              Start an editorial report
            </Link>
            <Link href="#track-case" className="bg-white border border-[#E5E7EB] hover:bg-gray-50 text-[#073B47] px-8 py-3 rounded-xl font-semibold text-center transition-colors">
              Track an existing case
            </Link>
          </div>
        </div>
        <div className="flex-1 relative rounded-2xl overflow-hidden min-h-[300px]">
          <Image 
            src="/report-an-inaccuracy/editor-reviewing-346ca7.png" 
            alt="Editor reviewing pages" 
            fill 
            className="object-cover rounded-2xl"
          />
          <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg flex items-center gap-3">
            <CheckCircle className="text-[#066879] w-5 h-5 flex-shrink-0" />
            <p className="text-[#102A32] text-sm font-semibold">A report is a request for editorial review — not proof of an error.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
