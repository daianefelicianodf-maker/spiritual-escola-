import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="mb-3 block">
      <span className="mb-1.5 block text-xs font-medium text-text-muted">{label}</span>
      {children}
    </label>
  )
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-lg border border-border bg-surface-2 px-3 text-sm text-text placeholder:text-text-muted/60 outline-none focus:border-accent',
        className,
      )}
      {...props}
    />
  )
}

export function NativeSelect({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'h-10 w-full rounded-lg border border-border bg-surface-2 px-3 text-sm text-text outline-none focus:border-accent',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  )
}
