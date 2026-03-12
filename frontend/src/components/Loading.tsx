import { Loader2 } from 'lucide-react'

/**
 * 统一的加载状态组件
 */

// Spinner - 旋转加载指示器
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  return (
    <Loader2 
      className={`animate-spin ${sizeMap[size]} ${className}`}
      style={{ color: 'var(--color-primary)' }}
    />
  )
}

// 全页面加载状态
interface PageLoadingProps {
  message?: string
}

export function PageLoading({ message = '加载中...' }: PageLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
      <Spinner size="lg" />
      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{message}</p>
    </div>
  )
}

// 骨架屏 - 单行
interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div 
      className={`animate-pulse rounded ${className}`}
      style={{ backgroundColor: 'var(--bg-hover)' }}
    />
  )
}

// 卡片骨架屏
export function CardSkeleton() {
  return (
    <div className="card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  )
}

// 任务卡片骨架屏
export function TaskCardSkeleton() {
  return (
    <div className="card p-3 space-y-2">
      <div className="flex items-start justify-between">
        <Skeleton className="h-4 flex-1 mr-2" />
        <Skeleton className="w-16 h-5 rounded-full" />
      </div>
      <Skeleton className="h-3 w-2/3" />
      <div className="flex items-center gap-2 pt-1">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-16 ml-auto" />
      </div>
    </div>
  )
}

// 统计卡片骨架屏
export function StatCardSkeleton() {
  return (
    <div className="card p-3">
      <div className="flex items-center gap-3">
        <Skeleton className="w-10 h-10 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-8" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  )
}

// 团队成员骨架屏
export function MemberSkeleton() {
  return (
    <div className="p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Skeleton className="w-8 h-8 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
      <Skeleton className="w-14 h-5 rounded-full" />
    </div>
  )
}

// 团队卡片骨架屏
export function TeamCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="p-3 border-b" style={{ borderColor: 'var(--border-light)' }}>
        <Skeleton className="h-5 w-32 mb-1" />
        <Skeleton className="h-3 w-48" />
      </div>
      <div className="divide-y" style={{ borderColor: 'var(--border-light)' }}>
        <MemberSkeleton />
        <MemberSkeleton />
        <MemberSkeleton />
      </div>
    </div>
  )
}

// 任务列表骨架屏
export function TaskListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} style={{ animationDelay: `${i * 50}ms` }} className="animate-in">
          <TaskCardSkeleton />
        </div>
      ))}
    </div>
  )
}

// 统计行骨架屏
export function StatRowSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}>
      {Array.from({ length: count }).map((_, i) => (
        <StatCardSkeleton key={i} />
      ))}
    </div>
  )
}
