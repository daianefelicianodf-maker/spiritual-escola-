import type { LucideIcon } from 'lucide-react'
import { Card } from './Card'

interface StatCardProps {
  label: string
  value: string
  icon: LucideIcon
}

export function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
        <Icon size={20} />
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs text-text-muted">{label}</p>
        <p className="text-xl font-semibold text-text">{value}</p>
      </div>
    </Card>
  )
}
