'use client'

import { Plus } from 'lucide-react'

const STORIES = [
  { name: 'Post Story', add: true },
  { name: 'RescueMata', gradient: true },
  { name: 'DrVetara', gradient: true },
  { name: 'PawsWild', gradient: false },
  { name: 'ClimateEdu', gradient: true },
  { name: 'BirdsHQ', gradient: false },
]

const INITIALS = ['AR', 'RM', 'DV', 'PW', 'CE', 'BH']
const COLORS = [
  'bg-primary',
  'bg-secondary',
  'bg-tertiary',
  'bg-outline',
  'bg-[#2a4858]',
  'bg-[#8C5C9E]',
]

export function StoryBar(): React.JSX.Element {
  return (
    <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10 flex gap-4 overflow-x-auto no-scrollbar shadow-sm">
      {STORIES.map((story, i) => (
        <div key={story.name} className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group">
          <div className={`relative ${story.gradient ? 'story-gradient' : ''} rounded-full p-0.5`}>
            <div
              className={`w-14 h-14 rounded-full ${story.add ? 'border-2 border-dashed border-outline-variant bg-surface-container' : (COLORS[i] ?? 'bg-surface-variant')} flex items-center justify-center text-white font-semibold text-sm`}
            >
              {story.add ? (
                <span className="text-outline font-bold text-xl">+</span>
              ) : (
                INITIALS[i] ?? story.name[0]
              )}
            </div>
            {story.add && (
              <div className="absolute bottom-0 right-0 bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center border-2 border-surface-container-lowest shadow-sm">
                <Plus className="w-3 h-3" />
              </div>
            )}
          </div>
          <span className="text-[10px] text-on-surface-variant font-medium whitespace-nowrap">{story.name}</span>
        </div>
      ))}
    </div>
  )
}
