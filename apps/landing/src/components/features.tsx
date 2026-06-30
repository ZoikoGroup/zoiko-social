const features = [
  {
    icon: '🛡️',
    title: 'Safety First',
    body: 'Profanity-free everywhere. AI-powered welfare monitoring. Every post is reviewed before it can cause harm.',
  },
  {
    icon: '✅',
    title: 'Verified News',
    body: 'No misinformation. Every news article is fact-checked and linked to certified sources before publication.',
  },
  {
    icon: '📋',
    title: 'Full Auditability',
    body: 'Every moderation action, every decision is logged. Transparency builds trust in a governed community.',
  },
  {
    icon: '🎥',
    title: 'Seamless Video',
    body: 'One-to-one vet consultations, group training sessions, live rescue fundraisers — all from one platform.',
  },
  {
    icon: '🌍',
    title: 'Global Reach',
    body: 'Built for animal lovers everywhere. Multi-language support, local rescue networks, global community.',
  },
  {
    icon: '🔒',
    title: 'Enterprise Security',
    body: 'Row-level security at the database. RBAC+ABAC permissions. Banned users blocked at every layer.',
  },
]

export function Features(): React.JSX.Element {
  return (
    <section id="features" className="bg-surface py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl font-bold text-teal-deep">
            Built differently, on purpose
          </h2>
          <p className="mt-4 text-lg text-teal-muted">
            Every design decision starts with one question: is this safe for animals and their people?
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-lg border border-teal-wash bg-paper p-6">
              <div className="mb-3 text-3xl">{f.icon}</div>
              <h3 className="mb-2 font-semibold text-teal-deep">{f.title}</h3>
              <p className="text-sm leading-relaxed text-teal-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
