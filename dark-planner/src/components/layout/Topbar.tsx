import { LanguageSwitcher } from './LanguageSwitcher'

export function Topbar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-end gap-3 border-b border-border px-6">
      <LanguageSwitcher />
      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-accent to-accent-2" />
    </header>
  )
}
