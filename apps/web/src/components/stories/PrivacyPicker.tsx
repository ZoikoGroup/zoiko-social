'use client'

import { Globe, Users, Star, Briefcase, ChevronDown } from 'lucide-react'
import { useState } from 'react'

type PrivacyOption = 'public' | 'followers' | 'close_friends' | 'professional'

const PRIVACY_LABELS: Record<PrivacyOption, string> = {
  public: 'Public',
  followers: 'Followers',
  close_friends: 'Close Friends',
  professional: 'Professional',
}

const PRIVACY_ICONS: Record<PrivacyOption, React.JSX.Element> = {
  public: <Globe className="w-4 h-4" />,
  followers: <Users className="w-4 h-4" />,
  close_friends: <Star className="w-4 h-4" />,
  professional: <Briefcase className="w-4 h-4" />,
}

interface PrivacyPickerProps {
  value: PrivacyOption
  onChange: (v: PrivacyOption) => void
}

export function PrivacyPicker({ value, onChange }: PrivacyPickerProps): React.JSX.Element {
  const [open, setOpen] = useState(false)

  const options: PrivacyOption[] = ['public', 'followers', 'close_friends', 'professional']

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[12px] font-medium transition-colors cursor-pointer"
      >
        {PRIVACY_ICONS[value]}
        <span>{PRIVACY_LABELS[value]}</span>
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <div className="absolute top-full mt-2 left-0 w-44 bg-neutral-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 text-[13px] transition-colors cursor-pointer ${
                opt === value
                  ? 'text-white bg-white/10 font-semibold'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              {PRIVACY_ICONS[opt]}
              <span>{PRIVACY_LABELS[opt]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
