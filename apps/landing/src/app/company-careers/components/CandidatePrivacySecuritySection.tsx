import Link from "next/link";
import { C } from "./theme";

export default function CandidatePrivacySecuritySection() {
  return (
    <section className="bg-white py-12 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-12">
        {/* Section Heading */}
        <div className="max-w-[720px] mb-8 sm:mb-10">
          <h2
            className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold leading-[1.2] tracking-[-0.01em]"
            style={{ color: C.firefly }}
          >
            Candidate privacy and security
          </h2>
        </div>

        <div className="flex flex-col gap-6 sm:gap-8">
          {/* Card 1: Data Protection */}
          <div
            className="rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 border-l-4"
            style={{
              background: C.athensGray,
              borderLeftColor: C.mosque,
            }}
          >
            <h3
              className="text-base font-bold mb-2 sm:mb-3"
              style={{ color: C.mosque }}
            >
              Your data is protected
            </h3>
            <p
              className="text-sm sm:text-base lg:text-[17px] leading-relaxed sm:leading-[28px]"
              style={{ color: C.nevada }}
            >
              When you apply for a role at Zoiko Social, your information is used
              for recruitment purposes. We use a trusted ATS (applicant tracking
              system) to manage applications and only share your information with
              relevant hiring team members and recruiters. Your data is not
              shared for marketing or other purposes without your consent.
            </p>
            <div className="mt-3 sm:mt-4">
              <Link
                href="/privacy"
                className="inline-block text-sm sm:text-base font-semibold underline transition hover:opacity-80 break-words"
                style={{ color: C.zest }}
              >
                Read our full candidate privacy notice →
              </Link>
            </div>
          </div>

          {/* Card 2: Recruitment Fraud Prevention */}
          <div
            className="rounded-[16px] sm:rounded-[20px] p-6 sm:p-8 pb-8 sm:pb-12 border-l-4"
            style={{
              background: C.athensGray,
              borderLeftColor: C.mosque,
            }}
          >
            <h3
              className="text-base font-bold mb-2 sm:mb-3"
              style={{ color: C.mosque }}
            >
              Protecting against recruitment fraud
            </h3>
            <p
              className="text-sm sm:text-base lg:text-[17px] leading-relaxed sm:leading-[28px]"
              style={{ color: C.nevada }}
            >
              <span className="font-bold">Be cautious of scams.</span> Legitimate
              Zoiko Social recruiters will only contact you through:
            </p>

            <ul className="mt-3 space-y-2 pl-3 sm:pl-6 text-sm sm:text-base leading-relaxed" style={{ color: C.nevada }}>
              <li className="flex items-start gap-2">
                <span className="select-none text-slate-400">•</span>
                <span>zoikosocial.com careers page or linked ATS</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="select-none text-slate-400">•</span>
                <span>Email from @zoikosocial.com or approved recruiting partners</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="select-none text-slate-400">•</span>
                <span>Legitimate LinkedIn or Indeed profiles</span>
              </li>
            </ul>

            <div className="mt-5 sm:mt-6 pt-4 border-t border-slate-200/60">
              <p
                className="text-sm sm:text-base lg:text-[17px] leading-relaxed sm:leading-[28px]"
                style={{ color: C.nevada }}
              >
                <span className="font-bold">Zoiko Social will never:</span> Ask
                for payment to apply • Request passwords or sensitive financial
                details before hiring • Ask you to purchase equipment upfront •
                Offer jobs via suspicious text or WhatsApp links
              </p>
            </div>

            <div className="mt-4 sm:mt-5">
              <a
                href="mailto:security@zoikosocial.com?subject=Report%20Suspicious%20Recruiter"
                className="inline-block text-sm sm:text-base lg:text-[17px] font-semibold underline transition hover:opacity-80 break-words"
                style={{ color: C.zest }}
              >
                Report a suspicious recruiter →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
