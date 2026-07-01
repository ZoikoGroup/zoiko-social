import type { HTMLAttributes } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'dot' | 'number'
  count?: number
}

export function Badge({
  variant = 'dot',
  count,
  className = '',
  ...props
}: BadgeProps): React.JSX.Element {
  if (variant === 'number' && count && count > 0) {
    return (
      <span
        className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-amber-light text-white text-[0.6rem] font-bold flex items-center justify-center px-1 leading-none ${className}`}
        {...props}
      >
        {count > 99 ? '99+' : count}
      </span>
    )
  }

  return (
    <span
      className={`absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-light border-2 border-white ${className}`}
      aria-label="Badge"
      {...props}
    />
  )
}
