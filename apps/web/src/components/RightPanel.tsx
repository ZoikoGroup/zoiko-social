'use client'

import { Info } from 'lucide-react'

export function RightPanel(): React.JSX.Element {
  return (
    <div className="space-y-gutter">
      {/* Professional Suggestions */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 shadow-sm">
        <h3 className="text-label-md font-bold mb-4 flex items-center justify-between">
          Professional Suggestions
          <Info className="w-4 h-4 text-outline" />
        </h3>
        <div className="space-y-4">
          {[
            { name: 'Dr. Sarah Vance', title: 'Chief Vet at Paws Clinic', initials: 'SV', color: 'bg-secondary/10 text-secondary' },
            { name: 'Mark Thompson', title: 'K9 Behavioral Analyst', initials: 'MT', color: 'bg-primary/10 text-primary' },
          ].map((person) => (
            <div key={person.name} className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full ${person.color} flex items-center justify-center font-bold text-sm flex-shrink-0 border border-outline-variant`}>
                {person.initials}
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-label-md font-semibold truncate">{person.name}</span>
                <span className="text-[11px] text-outline leading-tight truncate">{person.title}</span>
                <button className="mt-2 w-fit px-3 py-1 border border-primary text-primary rounded-full text-label-sm font-semibold hover:bg-primary/5 transition-colors cursor-pointer">
                  + Follow
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trending Topics */}
      <section className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-4 shadow-sm">
        <h3 className="text-label-md font-bold mb-4">Trending in Animal Welfare</h3>
        <div className="space-y-4">
          {[
            { tag: '#RescueTech', title: 'AI in Shelter Management', count: '2.5k' },
            { tag: '#VetCare2024', title: 'Telemedicine for Rural Areas', count: '1.2k' },
            { tag: '#PetPolicy', title: 'Global Standards for Ethics', count: '845' },
          ].map((trend) => (
            <div key={trend.tag} className="flex flex-col gap-0.5 cursor-pointer group">
              <span className="text-label-sm text-outline">{trend.tag}</span>
              <span className="text-label-md font-semibold text-on-surface group-hover:text-primary transition-colors">{trend.title}</span>
              <span className="text-[10px] text-outline">{trend.count} professionals discussing</span>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="flex flex-wrap gap-x-4 gap-y-2 px-2 text-[11px] text-outline">
        <a className="hover:text-primary hover:underline cursor-pointer" href="#">About</a>
        <a className="hover:text-primary hover:underline cursor-pointer" href="#">Accessibility</a>
        <a className="hover:text-primary hover:underline cursor-pointer" href="#">Help Center</a>
        <a className="hover:text-primary hover:underline cursor-pointer" href="#">Privacy &amp; Terms</a>
        <a className="hover:text-primary hover:underline cursor-pointer" href="#">Ad Choices</a>
        <p className="mt-2 w-full">ZoikoSocial &copy; 2026</p>
      </footer>
    </div>
  )
}
