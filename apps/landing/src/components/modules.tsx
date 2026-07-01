const modules = [
  { name: 'Social Feed',       desc: 'Posts, reels, stories — filtered for safety',       tag: 'Core' },
  { name: 'Communities',       desc: 'Species-specific groups with moderated discussion',  tag: 'Core' },
  { name: 'Messaging & Calls', desc: 'DMs, group chat, video calls via LiveKit WebRTC',   tag: 'Core' },
  { name: 'News',              desc: 'Verified animal welfare and science news only',      tag: 'Core' },
  { name: 'Events',            desc: 'Rescue drives, adoption fairs, training workshops',  tag: 'Core' },
  { name: 'Adoption',          desc: 'Rehoming listings with welfare verification',        tag: 'Core' },
  { name: 'Products',          desc: 'Marketplace for pet food, accessories, care items',  tag: 'Commerce' },
  { name: 'Pet Care',          desc: 'Two-sided marketplace: find walkers, sitters, groomers', tag: 'Commerce' },
  { name: 'Breeding Match',    desc: 'Ethical matchmaking with health record verification', tag: 'Specialist' },
  { name: 'Lost & Found',      desc: 'Geo-tagged reports with photo and last-seen location', tag: 'Safety' },
  { name: 'Pet Diary',         desc: 'Milestone journal: first walk, birthdays, weight',   tag: 'Personal' },
  { name: 'Health Passport',   desc: 'Vaccination records, vet visits, medications',       tag: 'Health' },
  { name: 'Advertising',       desc: 'Animal-welfare-reviewed ads only — no exploitation', tag: 'Commerce' },
]

const tagColors: Record<string, string> = {
  Core:       'bg-teal-wash text-teal-deep',
  Commerce:   'bg-amber-pale text-amber',
  Specialist: 'bg-sage-pale text-sage',
  Safety:     'bg-red-50 text-red-700',
  Personal:   'bg-purple-50 text-purple-700',
  Health:     'bg-blue-50 text-blue-700',
}

export function Modules(): React.JSX.Element {
  return (
    <section id="modules" className="bg-paper py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-4xl font-bold text-teal-deep">13 platform modules</h2>
          <p className="mt-4 text-lg text-teal-muted">
            Everything animal lovers need, in one governed platform.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {modules.map((m) => (
            <div
              key={m.name}
              className="flex flex-col gap-2 rounded-lg border border-teal-wash p-4 hover:border-teal-muted transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-teal-deep">{m.name}</h3>
                <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${tagColors[m.tag] ?? ''}`}>
                  {m.tag}
                </span>
              </div>
              <p className="text-xs leading-relaxed text-teal-muted">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
