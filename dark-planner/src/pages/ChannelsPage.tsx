import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useDarkPlannerStore } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'
import { SEED_CHANNEL_IDS } from '@/lib/mock-data'
import { Button } from '@/components/ui/Button'
import { ChannelCard } from '@/components/channels/ChannelCard'
import { ImportChannelDialog } from '@/components/channels/ImportChannelDialog'

export function ChannelsPage() {
  const { t } = useTranslation()
  const channels = useDarkPlannerStore((s) => s.channels)
  const [dialogOpen, setDialogOpen] = useState(false)
  const hasExampleChannels = channels.some((c) => SEED_CHANNEL_IDS.includes(c.id))

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text">{t('channels_title')}</h1>
          <p className="mt-1 text-sm text-text-muted">{t('channels_subtitle')}</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus size={16} />
          {t('import_channel')}
        </Button>
      </div>

      {hasExampleChannels && (
        <p className="mt-4 rounded-xl border border-border bg-surface-2 px-4 py-3 text-xs text-text-muted">
          {t('example_channels_notice')}
        </p>
      )}

      {channels.length === 0 ? (
        <p className="mt-10 text-center text-sm text-text-muted">{t('no_channels')}</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {channels.map((channel) => (
            <ChannelCard key={channel.id} channel={channel} />
          ))}
        </div>
      )}

      <ImportChannelDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
