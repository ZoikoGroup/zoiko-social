const STEPS = [
  {
    number: "1",
    title: "Download the App",
    description: (
      <>
        Choose your platform above and
        <br />
        download from the official App Store or
        <br />
        Play Store. No account needed yet.
      </>
    ),
  },
  {
    number: "2",
    title: "Create or Sign In",
    description: (
      <>
        New user? Sign up with email or phone.
        <br />
        Existing user? Sign in with your Zoiko
        <br />
        Social credentials. Same account
        <br />
        everywhere.
      </>
    ),
  },
  {
    number: "3",
    title: "Start Exploring",
    description: (
      <>
        Discover communities, follow topics,
        <br />
        connect with animal lovers worldwide.
        <br />
        Your preferences sync across all devices.
      </>
    ),
  },
];

/**
 * "Getting Started in 3 Steps" — grey-97 band with three white rounded-3xl
 * cards, per the Figma frame. Each card: grey-95 rounded-3xl numbered
 * badge (cyan-25 extrabold digit), bold title, azure-42 body. Below the
 * cards, the centered "Account Continuity:" note (bold lead-in, normal
 * body, both azure-42).
 */
export default function GettingStarted() {
  return (
    <section id="getting-started" className="w-full bg-[#f1f4f5] px-6 py-20 lg:px-28">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-12">
        <h2 className="text-center font-jakarta text-4xl font-extrabold leading-10 text-[#0f3d46]">
          Getting Started in 3 Steps
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="flex flex-1 flex-col items-center gap-2 rounded-3xl border border-[#dce5e8] bg-white px-8 py-8"
            >
              <div className="flex w-12 justify-center rounded-3xl bg-[#e8edf0] py-3">
                <p className="text-center font-jakarta text-xl font-extrabold text-[#0f5a68]">{step.number}</p>
              </div>
              <p className="pt-2 text-center font-jakarta text-base font-bold text-[#0f3d46]">{step.title}</p>
              <p className="text-center font-jakarta text-base font-normal leading-7 text-[#55707c]">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <p className="text-center font-jakarta text-base font-normal leading-7 text-[#55707c]">
          <span className="font-bold">Account Continuity:</span> Your Zoiko Social account is the same whether you use
          iOS, Android, web, or desktop. Sign in once, access everywhere. Premium
          <br className="hidden sm:inline" />
          membership, settings, and saved content follow you across all platforms.
        </p>
      </div>
    </section>
  );
}