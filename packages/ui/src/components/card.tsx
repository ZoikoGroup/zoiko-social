import type { HTMLAttributes } from 'react'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-5',
}

export function Card({
  padding = 'md',
  className = '',
  children,
  ...props
}: CardProps): React.JSX.Element {
  return (
    <div
      className={`bg-white border border-[#E2DDD7] rounded-[10px] ${paddingMap[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
