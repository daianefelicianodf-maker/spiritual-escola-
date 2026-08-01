import { ExternalLink, Trash2 } from 'lucide-react'
import type { Channel } from '@/lib/types'
import { useDarkPlannerStore } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'
import { channelUrl, formatCompactNumber } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export function ChannelCard({ channel }: { channel: Channel }) {
  const { t, locale } = useTranslation()
  const removeChannel = useDarkPlannerStore((s) => s.removeChannel)

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: channel.avatarColor }}
          >
            {channel.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-text">{channel.name}</p>
            <a
              href={channelUrl(channel)}
              target="_blank"
              rel="noopener noreferrer"
              title={t('open_on_youtube')}
              className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-accent"
            >
              {channel.handle}
              <ExternalLink size={11} />
            </a>
          </div>
        </div>
        <button
          type="button"
          onClick={() => removeChannel(channel.id)}
          className="rounded-md p-1.5 text-text-muted hover:bg-danger/10 hover:text-danger cursor-pointer"
          aria-label={t('remove')}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {channel.niche && (
        <Badge tone="accent" className="mt-3">
          {channel.niche}
        </Badge>
      )}

      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-center">
        <div>
          <p className="text-sm font-semibold text-text">{formatCompactNumber(channel.subscribers, locale)}</p>
          <p className="text-[11px] text-text-muted">{t('subscribers')}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-text">{formatCompactNumber(channel.totalViews, locale)}</p>
          <p className="text-[11px] text-text-muted">{t('views')}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-text">{channel.videosCount}</p>
          <p className="text-[11px] text-text-muted">{t('videos')}</p>
        </div>
      </div>
    </Card>
  )
}
