import { useState } from 'react'
import { useDarkPlannerStore } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'
import { Dialog } from '@/components/ui/Dialog'
import { Field, Input } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'

interface ImportChannelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const initialForm = { name: '', handle: '', niche: '' }

export function ImportChannelDialog({ open, onOpenChange }: ImportChannelDialogProps) {
  const { t } = useTranslation()
  const importChannel = useDarkPlannerStore((s) => s.importChannel)
  const [form, setForm] = useState(initialForm)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.handle.trim()) return
    importChannel(form)
    setForm(initialForm)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setForm(initialForm)
        onOpenChange(next)
      }}
      title={t('import_channel_title')}
      description={t('import_channel_desc')}
    >
      <form onSubmit={handleSubmit}>
        <Field label={t('field_name')}>
          <Input
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="Mundo Místico"
          />
        </Field>
        <Field label={t('field_handle')}>
          <Input
            required
            value={form.handle}
            onChange={(e) => setForm((f) => ({ ...f, handle: e.target.value }))}
            placeholder="@mundomistico"
          />
        </Field>
        <Field label={t('field_niche')}>
          <Input
            value={form.niche}
            onChange={(e) => setForm((f) => ({ ...f, niche: e.target.value }))}
            placeholder="Espiritualidade"
          />
        </Field>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button type="submit">{t('import')}</Button>
        </div>
      </form>
    </Dialog>
  )
}
