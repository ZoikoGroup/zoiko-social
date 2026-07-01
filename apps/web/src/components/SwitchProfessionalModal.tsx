'use client'

import { useState } from 'react'
import { X, Heart, Stethoscope, Scissors, HandHeart, Award, ShoppingBag, Tag, Building2, Home, Leaf, Dna, Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface Role {
  id: string
  label: string
  description: string
  Icon: LucideIcon
  type: 'personal' | 'professional' | 'business'
}

const ROLES: Role[] = [
  { id: 'pet-owner',     label: 'Pet Owner',           description: 'Share your life with your pets',         Icon: Heart,       type: 'personal'     },
  { id: 'vet',           label: 'Veterinarian',         description: 'Licensed animal medical professional',   Icon: Stethoscope, type: 'professional' },
  { id: 'caretaker',     label: 'Caretaker / Groomer',  description: 'Day-to-day care and grooming services',  Icon: Scissors,    type: 'professional' },
  { id: 'rescuer',       label: 'Animal Rescuer',        description: 'Rescue, foster, and rehabilitation',     Icon: HandHeart,   type: 'professional' },
  { id: 'trainer',       label: 'Pet Trainer',           description: 'Behaviour training and coaching',        Icon: Award,       type: 'professional' },
  { id: 'product-seller',label: 'Product Seller',        description: 'Sell pet food, toys, and accessories',   Icon: ShoppingBag, type: 'business'     },
  { id: 'pet-seller',    label: 'Pet / Animal Seller',   description: 'Ethical sale and adoption of animals',   Icon: Tag,         type: 'business'     },
  { id: 'shelter',       label: 'Shelter / Organisation',description: 'Rescue shelters and animal NGOs',        Icon: Building2,   type: 'business'     },
  { id: 'sitter',        label: 'Pet Sitter / Boarding', description: 'Home boarding and pet sitting services', Icon: Home,        type: 'professional' },
  { id: 'wildlife',      label: 'Wildlife Expert',       description: 'Wildlife conservation and research',     Icon: Leaf,        type: 'professional' },
  { id: 'breeder',       label: 'Responsible Breeder',   description: 'Ethical and registered breeding',        Icon: Dna,         type: 'business'     },
]

const TYPE_COLOR: Record<Role['type'], string> = {
  personal:     'bg-outline-variant/20 text-outline',
  professional: 'bg-primary/10 text-primary',
  business:     'bg-secondary/10 text-secondary',
}

interface SwitchProfessionalModalProps {
  open: boolean
  onClose: () => void
  onConfirm: (role: Role) => void
}

export function SwitchProfessionalModal({ open, onClose, onConfirm }: SwitchProfessionalModalProps): React.JSX.Element | null {
  const [selected, setSelected] = useState<string | null>(null)

  if (!open) return null

  const selectedRole = ROLES.find((r) => r.id === selected)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-surface-container-lowest rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-outline-variant/20">
          <div>
            <h2 className="font-headline text-headline-md text-on-surface">Switch to Professional</h2>
            <p className="text-label-sm text-outline mt-0.5">Choose the role that best describes your work</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role grid */}
        <div className="overflow-y-auto p-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {ROLES.map((role) => {
            const isSelected = selected === role.id
            return (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                className={`relative flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-outline-variant/30 hover:border-primary/40 hover:bg-surface-container'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-3 right-3 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </span>
                )}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'bg-primary/10' : 'bg-surface-container-low'}`}>
                  <role.Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`} />
                </div>
                <div>
                  <p className="text-label-md font-bold text-on-surface leading-tight">{role.label}</p>
                  <p className="text-[11px] text-outline leading-tight mt-0.5">{role.description}</p>
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${TYPE_COLOR[role.type]}`}>
                  {role.type}
                </span>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-outline-variant/20 flex items-center justify-between gap-4">
          <p className="text-label-sm text-outline">You can switch back to a personal account any time.</p>
          <div className="flex gap-3 flex-shrink-0">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-outline-variant text-on-surface-variant text-label-md hover:bg-surface-container transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              onClick={() => selectedRole && onConfirm(selectedRole)}
              disabled={!selected}
              className="px-5 py-2 rounded-lg bg-primary text-white text-label-md font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
