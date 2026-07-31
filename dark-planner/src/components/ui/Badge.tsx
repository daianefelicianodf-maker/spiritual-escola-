import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type Tone = 'default' | 'accent' | 'success' | 'warning' | 'danger'

const toneClasses: Record<Tone, string> = {
  default: 'bg-surface-2 text-text-muted',
  accent: 'bg-accent/15 text-accent',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger: 'bg-danger/15 text-danger',
}

export function Badge({
  className,
  tone = 'default',
  ...props
}: HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
      {...props}
    />
  )
}
