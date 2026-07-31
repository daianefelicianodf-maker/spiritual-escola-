import { useState } from 'react'
import { useDarkPlannerStore } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'
import { Dialog } from '@/components/ui/Dialog'
import { Field, Input, NativeSelect } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { FileInput } from '@/components/ui/FileInput'

interface NewVideoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewVideoDialog({ open, onOpenChange }: NewVideoDialogProps) {
  const { t } = useTranslation()
  const channels = useDarkPlannerStore((s) => s.channels)
  const addVideo = useDarkPlannerStore((s) => s.addVideo)

  const emptyForm = {
    channelId: channels[0]?.id ?? '',
    title: '',
    dueDate: new Date().toISOString().slice(0, 10),
    scriptFileName: undefined as string | undefined,
    audioFileName: undefined as string | undefined,
  }
  const [form, setForm] = useState(emptyForm)

  function reset() {
    setForm({ ...emptyForm, channelId: channels[0]?.id ?? '' })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.channelId) return
    addVideo(form)
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) reset()
        onOpenChange(next)
      }}
      title={t('new_video_title')}
      description={t('new_video_desc')}
    >
      <form onSubmit={handleSubmit}>
        <Field label={t('field_channel')}>
          <NativeSelect
            required
            value={form.channelId}
            onChange={(e) => setForm((f) => ({ ...f, channelId: e.target.value }))}
          >
            {channels.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </NativeSelect>
        </Field>
        <Field label={t('field_title')}>
          <Input
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
        </Field>
        <Field label={t('field_due_date')}>
          <Input
            type="date"
            required
            value={form.dueDate}
            onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
          />
        </Field>
        <Field label={t('field_script')}>
          <FileInput
            label={t('upload_script')}
            accept=".doc,.docx,.pdf,.txt"
            fileName={form.scriptFileName}
            onFileSelected={(fileName) => setForm((f) => ({ ...f, scriptFileName: fileName }))}
          />
        </Field>
        <Field label={t('field_audio')}>
          <FileInput
            label={t('upload_audio')}
            accept="audio/*"
            fileName={form.audioFileName}
            onFileSelected={(fileName) => setForm((f) => ({ ...f, audioFileName: fileName }))}
          />
        </Field>
        <div className="mt-5 flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            {t('cancel')}
          </Button>
          <Button type="submit" disabled={channels.length === 0}>
            {t('create')}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
