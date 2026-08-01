import { Info } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { exportBackup } from '@/lib/backup'

export function BackupHint() {
  const { t } = useTranslation()

  return (
    <div className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-surface-2 px-4 py-3 text-xs text-text-muted">
      <Info size={16} className="shrink-0 text-accent" />
      <p className="flex-1">{t('backup_hint')}</p>
      <button
        type="button"
        onClick={() => exportBackup()}
        className="shrink-0 rounded-md bg-accent/15 px-2.5 py-1 font-medium text-accent hover:bg-accent/25 cursor-pointer"
      >
        {t('backup_export')}
      </button>
    </div>
  )
}
