import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Tv, CalendarClock, BarChart3, Moon, Flame } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', labelKey: 'nav_dashboard', icon: LayoutDashboard },
  { to: '/channels', labelKey: 'nav_channels', icon: Tv },
  { to: '/niche-finder', labelKey: 'nav_niche_finder', icon: Flame },
  { to: '/planner', labelKey: 'nav_planner', icon: CalendarClock },
  { to: '/analytics', labelKey: 'nav_analytics', icon: BarChart3 },
] as const

export function Sidebar() {
  const { t } = useTranslation()

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-border bg-surface px-3 py-5">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
          <Moon size={16} className="text-white" />
        </div>
        <span className="text-base font-semibold text-text">{t('appName')}</span>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map(({ to, labelKey, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive ? 'bg-accent/15 text-accent' : 'text-text-muted hover:bg-surface-2 hover:text-text',
              )
            }
          >
            <Icon size={18} />
            {t(labelKey)}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
