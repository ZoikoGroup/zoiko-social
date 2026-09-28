const CARDS = [
  {
    title: "Protected Community",
    body: "Moderation tools and community guidelines keep spaces safe and respectful. Report concerns and see swift action.",
  },
  {
    title: "Your Privacy Matters",
    body: "You control what you share and who sees it. Complete privacy settings for your profile and posts.",
  },
  {
    title: "Verified Advocates",
    body: "Community verification badges help you identify trusted experts and established organizations.",
  },
];

/** "Safety & Trust Built In" — dark teal gradient panel, 3 translucent glass cards. */
export default function SafetyTrustBuiltIn() {
  return (
    <section className="w-full bg-white px-4 py-8 sm:px-8 lg:px-[105px] lg:py-20">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 rounded-[28px] bg-gradient-to-br from-[#073b47] to-[#066879] p-6 sm:p-8 lg:p-12">
        <h2 className="font-jakarta text-2xl font-extrabold tracking-[-0.36px] text-white sm:text-3xl lg:text-4xl">
          Safety & Trust Built In
        </h2>
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-6">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="flex flex-1 flex-col gap-2 rounded-[20px] border border-white/20 bg-white/10 p-6"
            >
              <h4 className="border-b border-white/[0.16] pb-2 text-base font-bold text-white">{card.title}</h4>
              <p className="pt-2 text-sm leading-[23.1px] text-white/90">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
