import { User } from 'lucide-react'

interface AvatarProps {
  src?: string | null
  name?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
}

export function Avatar({ src, name, size = 'md', className = '' }: AvatarProps) {
  const initial = name?.[0]?.toUpperCase() || <User size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`rounded-xl object-cover ${sizeMap[size]} ${className}`}
      />
    )
  }

  return (
    <div
      className={`rounded-xl bg-gradient-primary flex items-center justify-center text-white font-bold shadow-glow ${sizeMap[size]} ${className}`}
    >
      {initial}
    </div>
  )
}
