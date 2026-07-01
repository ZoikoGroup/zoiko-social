import type { HTMLAttributes } from 'react'

const GRADIENTS = [
  'linear-gradient(135deg,#2a5c48,#0C2A28)',
  'linear-gradient(135deg,#5C9E78,#2a6b4a)',
  'linear-gradient(135deg,#4a6eab,#2a4a80)',
  'linear-gradient(135deg,#a05c2a,#7a3e18)',
  'linear-gradient(135deg,#8C5C9E,#5a3a72)',
  'linear-gradient(135deg,#9e7a5c,#6e5238)',
  'linear-gradient(135deg,#8C3D2A,#c4622a)',
  'linear-gradient(135deg,#6a3a8a,#9a6aaa)',
  'linear-gradient(135deg,#3a5c2a,#6a9c3a)',
  'linear-gradient(135deg,#2a4858,#5a9aa8)',
  'linear-gradient(135deg,#7a5c2a,#b88a3a)',
]

export function getGradient(index = 0): string {
  return GRADIENTS[index % GRADIENTS.length]!
}

export function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map(w => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

const sizeMap: Record<string, string> = {
  sm: 'w-7 h-7 text-[0.6rem]',
  md: 'w-9 h-9 text-xs',
  lg: 'w-10 h-10 text-sm',
  xl: 'w-[52px] h-[52px] text-base',
  '2xl': 'w-[72px] h-[72px] text-2xl border-[3px]',
}

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string
  size?: keyof typeof sizeMap
  gradientIndex?: number
  src?: string | null
  borderColor?: string
}

export function Avatar({
  name,
  size = 'md',
  gradientIndex = 0,
  src,
  borderColor,
  className = '',
  style,
  ...props
}: AvatarProps): React.JSX.Element {
  const initials = getInitials(name)
  const bgGradient = getGradient(gradientIndex)
  const borderStyle = borderColor ? { border: `2px solid ${borderColor}` } : undefined

  if (src) {
    return (
      <div
        className={`${sizeMap[size]} rounded-full flex-shrink-0 overflow-hidden ${className}`}
        style={{ ...borderStyle, ...style }}
        {...props}
      >
        <img src={src} alt={name} className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    <div
      className={`${sizeMap[size]} rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white ${className}`}
      style={{ background: bgGradient, ...borderStyle, ...style }}
      title={name}
      aria-label={name}
      {...props}
    >
      {initials}
    </div>
  )
}
