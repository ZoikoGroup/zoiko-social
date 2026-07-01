'use client'

import { BadgeCheck } from 'lucide-react'

interface UserAvatarProps {
  name: string
  image?: string | undefined
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | undefined
  verified?: boolean | undefined
  professional?: boolean | undefined
  className?: string | undefined
}

const SIZES = {
  xs: { wrap: 'w-6 h-6',   text: 'text-[9px]',  badge: 'w-3 h-3',     border: 'border' },
  sm: { wrap: 'w-8 h-8',   text: 'text-[10px]', badge: 'w-3.5 h-3.5', border: 'border' },
  md: { wrap: 'w-10 h-10', text: 'text-sm',     badge: 'w-4 h-4',     border: 'border' },
  lg: { wrap: 'w-14 h-14', text: 'text-lg',     badge: 'w-5 h-5',     border: 'border-2' },
  xl: { wrap: 'w-20 h-20', text: 'text-2xl',    badge: 'w-6 h-6',     border: 'border-4' },
}

export function UserAvatar({
  name,
  image,
  size = 'md',
  verified = false,
  className = '',
}: UserAvatarProps): React.JSX.Element {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  const s = SIZES[size]

  return (
    <div className={`relative flex-shrink-0 ${className}`}>
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={name}
          className={`${s.wrap} rounded-full object-cover ${s.border} border-surface-container-lowest`}
        />
      ) : (
        <div className={`${s.wrap} rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary ${s.border} border-outline-variant ${s.text}`}>
          {initials}
        </div>
      )}
      {verified && (
        <BadgeCheck className={`absolute -bottom-0.5 -right-0.5 ${s.badge} text-primary bg-white rounded-full`} />
      )}
    </div>
  )
}
