import { useRef, useState } from 'react'
import { Download, Upload, Check, AlertCircle } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { exportBackup, importBackupFromFile } from '@/lib/backup'
import { LanguageSwitcher } from './LanguageSwitcher'

type Status = { kind: 'success' | 'error'; message: string } | null

export function Topbar() {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<Status>(null)

  function flashStatus(next: Status) {
    setStatus(next)
    setTimeout(() => setStatus(null), 3000)
  }

  async function handleExport() {
    try {
      await exportBackup()
      flashStatus({ kind: 'success', message: t('backup_export_success') })
    } catch {
      // Viewer declined or download unavailable — nothing to recover from here.
    }
  }

  async function handleImportFile(file: File) {
    try {
      await importBackupFromFile(file)
      flashStatus({ kind: 'success', message: t('backup_import_success') })
    } catch {
      flashStatus({ kind: 'error', message: t('backup_import_error') })
    }
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-end gap-3 border-b border-border px-6">
      {status && (
        <span
          className={`flex items-center gap-1.5 text-xs ${status.kind === 'success' ? 'text-success' : 'text-danger'}`}
        >
          {status.kind === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
          {status.message}
        </span>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleImportFile(file)
          e.target.value = ''
        }}
      />

      <button
        type="button"
        title={t('backup_import')}
        onClick={() => fileInputRef.current?.click()}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:bg-surface-2 hover:text-text cursor-pointer"
      >
        <Upload size={16} />
      </button>
      <button
        type="button"
        title={t('backup_export')}
        onClick={handleExport}
        className="flex h-9 w-9 items-center justify-center rounded-lg text-text-muted hover:bg-surface-2 hover:text-text cursor-pointer"
      >
        <Download size={16} />
      </button>

      <LanguageSwitcher />
      <div className="h-9 w-9 rounded-full bg-gradient-to-br from-accent to-accent-2" />
    </header>
  )
}
