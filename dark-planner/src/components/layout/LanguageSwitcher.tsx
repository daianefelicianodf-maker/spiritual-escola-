import { locales } from '@/lib/i18n'
import { useDarkPlannerStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export function LanguageSwitcher() {
  const locale = useDarkPlannerStore((s) => s.locale)
  const setLocale = useDarkPlannerStore((s) => s.setLocale)

  return (
    <div className="flex items-center rounded-lg border border-border bg-surface-2 p-0.5">
      {locales.map((l) => (
        <button
          key={l.value}
          type="button"
          onClick={() => setLocale(l.value)}
          className={cn(
            'rounded-md px-2.5 py-1 text-xs font-semibold transition-colors cursor-pointer',
            locale === l.value ? 'bg-accent text-white' : 'text-text-muted hover:text-text',
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  )
}
