const FAQS = [
  {
    question: "Is the Zoiko Social app free?",
    answer:
      "Yes. The Zoiko Social app is free to download and use on iOS, Android, and web. Optional Premium features are available through a subscription, but every core feature — communities, news, events, and adoption tools — is free.",
  },
  {
    question: "Do I need a Zoiko Social account to use the app?",
    answer:
      "You can browse some public content without an account, but you'll need a free Zoiko Social account to join communities, post, message, and sync your preferences across devices.",
  },
  {
    question: "Can I use my web account on the mobile app?",
    answer:
      "Yes. Your Zoiko Social account works across all platforms. Sign in with the same email or phone on the mobile app, web app, and (once released) the desktop apps — your content and settings follow you.",
  },
  {
    question: "How much storage space does the app require?",
    answer:
      "The iOS app requires about 20 MB of free space and the Android app about 18 MB. Additional space is used gradually for cached media and offline content, which you can clear anytime from settings.",
  },
  {
    question: "Does the app work offline?",
    answer:
      "Yes. You can read saved content, browse your joined communities, and draft messages offline. Everything syncs automatically when you're back online. The web app also supports offline reading through progressive web app (PWA) caching.",
  },
  {
    question: "How do I get app notifications?",
    answer:
      "On first launch, the app asks for permission to send notifications. You can adjust which alerts you receive (communities, rescues, events, messages) anytime from the app's notification settings or your device settings.",
  },
  {
    question: "Are premium features available in the mobile app?",
    answer:
      "Yes. The full Premium experience — ad-free feed, advanced privacy, enhanced media, and more — is available in the iOS and Android apps. Manage your subscription from the app store or your account settings.",
  },
  {
    question: "How often are apps updated?",
    answer:
      "We release updates regularly with new features, performance improvements, and security patches. iOS and Android apps update automatically through their app stores; the web app is always the latest version.",
  },
  {
    question: "What should I do if I encounter a bug or issue?",
    answer:
      "Use \"Report a Problem\" in the app's help section, or visit the Help Center on zoiko.social. Include your device model, OS version, and app version (found in Settings → About) so we can investigate faster.",
  },
] as const;

/** Plus/chevron toggle for the FAQ accordion, per the Figma frame's
 * grey-95 rounded-lg badge holding a cyan-15 "+" glyph. */
function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7 2.5V11.5M2.5 7H11.5"
        stroke="#3b8894"
        strokeWidth="1.28"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * "Frequently asked questions" — 9-item accordion on a grey-97 band, per
 * the Figma frame. Uses the project's native `<details>/<summary>`
 * pattern (see platform-premium-plans-production/components/Faq.tsx):
 * rounded-2xl white rows, a grey-95 rounded-lg toggle badge holding a
 * plus that rotates to × on open, centered 800px column.
 */
export default function Faq() {
  return (
    <section className="w-full bg-[#f1f4f5] px-6 pb-24 pt-20 lg:px-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col items-center gap-12 px-6">
        <h2 className="text-center font-jakarta text-3xl font-extrabold leading-[51.2px] text-[#0f3d46]">
          Frequently asked questions
        </h2>

        <div className="flex w-full max-w-[800px] flex-col items-start">
          {FAQS.map((faq) => (
            <div key={faq.question} className="w-full py-2">
              <details className="group w-full overflow-hidden rounded-2xl border border-[#dce5e8] bg-white">
                <summary className="flex min-h-16 w-full cursor-pointer list-none items-center justify-between px-6 py-4">
                  <span className="font-jakarta text-base font-bold leading-6 text-[#0f3d46]">{faq.question}</span>
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[#e8edf0] transition-transform group-open:rotate-45">
                    <PlusIcon />
                  </span>
                </summary>
                <p className="px-6 pb-6 pt-1 font-jakarta text-sm leading-6 text-[#55707c]">{faq.answer}</p>
              </details>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
