'use client'

export function PetDiary(): React.JSX.Element {
  return (
    <div>
      {/* Pet Profile Header */}
      <div className="bg-white rounded-xl border border-[#E2DDD7]/60 p-5 mb-5 flex items-center gap-4 card-shadow">
        <div className="w-[72px] h-[72px] rounded-full border-[3px] border-amber-light bg-gradient-to-br from-[#2a5c48] to-teal-deep flex items-center justify-center text-2xl flex-shrink-0 text-white/70 shadow-[0_4px_12px_rgba(244,168,32,0.2)]">
          <svg width="36" height="36" viewBox="0 0 40 40" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5">
            <ellipse cx="20" cy="26" rx="10" ry="8" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="28" cy="12" r="4" />
            <ellipse cx="20" cy="20" rx="8" ry="6" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <h2 className="text-lg font-bold">Max</h2>
            <span className="text-[0.6rem] font-bold bg-amber-light/10 text-amber-DEFAULT px-2 py-0.5 rounded-full">3 yrs</span>
          </div>
          <p className="text-xs text-teal-muted/70 mb-3">Golden Retriever · Male</p>
          <div className="flex gap-6">
            <div className="text-center">
              <strong className="block text-lg font-bold text-teal-deep">24</strong>
              <span className="text-[0.65rem] text-teal-muted/60 font-medium">Milestones</span>
            </div>
            <div className="text-center">
              <strong className="block text-lg font-bold text-teal-deep">87</strong>
              <span className="text-[0.65rem] text-teal-muted/60 font-medium">Entries</span>
            </div>
            <div className="text-center">
              <strong className="block text-lg font-bold text-teal-deep">32</strong>
              <span className="text-[0.65rem] text-teal-muted/60 font-medium">kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative pl-9 before:content-[''] before:absolute before:left-[17px] before:top-2 before:bottom-0 before:w-[2px] before:bg-gradient-to-b before:from-amber-light/30 before:via-sage/20 before:to-transparent">
        <TimelineEntry
          emoji="🎂"
          borderColor="var(--color-amber-light, #F4A820)"
          title="Birthday — 3 Years Old!"
          date="14 Mar 2026"
          body="Max turned three today. Celebrated with a homemade pumpkin and peanut butter cake (vet-approved recipe). He ate the whole thing in 45 seconds flat and spent the afternoon chasing butterflies in the garden."
        />
        <TimelineEntry
          emoji="⭐"
          borderColor="var(--color-amber-light, #F4A820)"
          title="New Trick — Roll Over on Command"
          date="8 Feb 2026"
          body="After three weeks of positive reinforcement sessions with trainer Sara, Max now reliably rolls over on a single hand signal. No treats needed anymore."
        />
        <TimelineEntry
          emoji="💊"
          borderColor="var(--color-sage, #5C9E78)"
          title="Vet Visit — Annual Health Check"
          date="22 Jan 2026"
          body="All clear from Dr. Vetara Okonkwo DVM. Weight 32.1 kg (stable). Hip X-rays clear. Vaccinations updated. Health Passport updated on ZoikoSocial."
        />
        <TimelineEntry
          emoji="🐾"
          borderColor="var(--color-sage, #5C9E78)"
          title="First Walk at Cubbon Park"
          date="3 Apr 2023"
          body="Max's very first outing as a 3-month-old pup. He was terrified of pigeons and fascinated by fallen leaves. Walked exactly 200 metres before sitting down and refusing to move. Progress."
        />
      </div>

      {/* Weight Chart */}
      <div className="bg-white rounded-xl border border-[#E2DDD7]/60 p-5 mt-5 card-shadow">
        <h4 className="text-xs font-bold mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sage" />
          Weight History (kg)
        </h4>
        <div className="flex items-end gap-2 h-[88px]">
          {[
            { label: "Apr\n'23", value: '5.4', height: '18%' },
            { label: "Jul\n'23", value: '12', height: '34%' },
            { label: "Oct\n'23", value: '19', height: '54%' },
            { label: "Jan\n'24", value: '25', height: '72%' },
            { label: "Jul\n'24", value: '30', height: '84%' },
            { label: "Jan\n'25", value: '31.5', height: '88%' },
            { label: "Jul\n'25", value: '32', height: '90%' },
            { label: "Jan\n'26", value: '32.1', height: '90%', highlight: true },
          ].map((bar) => (
            <div key={bar.label} className="flex flex-col items-center flex-1 gap-1.5 group">
              <span className="text-[0.55rem] text-[#a8b0ab] opacity-0 group-hover:opacity-100 transition-opacity">{bar.value}</span>
              <div
                className="w-full rounded-t-md min-h-[4px] transition-all duration-300 group-hover:brightness-110"
                style={{
                  height: bar.height,
                  background: bar.highlight
                    ? 'linear-gradient(to top, var(--color-amber-light, #F4A820), #f9c65a)'
                    : 'linear-gradient(to top, var(--color-sage, #5C9E78), #7bc49a)',
                }}
              />
              <span className={`text-[0.6rem] text-center tabular-nums ${bar.highlight ? 'text-amber-light font-bold' : 'text-[#a8b0ab]'}`}>
                {bar.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface TimelineEntryProps {
  emoji: string
  borderColor: string
  title: string
  date: string
  body: string
}

function TimelineEntry({ emoji, borderColor, title, date, body }: TimelineEntryProps): React.JSX.Element {
  return (
    <div className="relative mb-5 last:mb-0 group">
      <div
        className="absolute left-[-25px] top-2 w-[22px] h-[22px] rounded-full flex items-center justify-center text-[11px] bg-white border-[2.5px] z-10 transition-transform duration-200 group-hover:scale-110"
        style={{ borderColor }}
      >
        {emoji}
      </div>
      <div className="bg-white rounded-xl border border-[#E2DDD7]/60 p-3.5 transition-all duration-200 group-hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-semibold">{title}</h4>
          <span className="text-[0.68rem] text-[#a8b0ab] font-medium">{date}</span>
        </div>
        <p className="text-[0.78rem] text-teal-mid/80 leading-relaxed">{body}</p>
      </div>
    </div>
  )
}
