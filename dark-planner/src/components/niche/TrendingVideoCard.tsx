import { ExternalLink, Plus, Check } from 'lucide-react'
import type { TrendingVideo } from '@/lib/types'
import { useDarkPlannerStore } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'
import { formatCompactNumber, formatDate } from '@/lib/utils'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

const EXPLODING_THRESHOLD = 0.6

export function TrendingVideoCard({ video }: { video: TrendingVideo }) {
  const { t, locale } = useTranslation()
  const channels = useDarkPlannerStore((s) => s.channels)
  const importChannel = useDarkPlannerStore((s) => s.importChannel)
  const alreadyImported = channels.some((c) => c.handle === video.channelHandle || c.name === video.channelTitle)
  const isExploding = video.viralScore >= EXPLODING_THRESHOLD

  return (
    <Card className="flex flex-col gap-3 p-0 overflow-hidden">
      <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
        {video.thumbnail && <img src={video.thumbnail} alt="" className="aspect-video w-full object-cover" />}
      </a>
      <div className="flex flex-1 flex-col gap-3 px-4 pb-4">
        <Badge tone={isExploding ? 'danger' : 'accent'} className="w-fit">
          {isExploding ? t('badge_exploding') : t('badge_rising')}
        </Badge>

        <a
          href={`https://www.youtube.com/watch?v=${video.videoId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="line-clamp-2 text-sm font-semibold text-text hover:text-accent"
        >
          {video.title}
        </a>

        <a
          href={video.channelHandle ? `https://www.youtube.com/${video.channelHandle}` : `https://www.youtube.com/channel/${video.channelId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-accent"
        >
          {video.channelTitle}
          <ExternalLink size={11} />
        </a>

        <div className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
          <div>
            <p className="text-sm font-semibold text-text">{formatCompactNumber(video.viewCount, locale)}</p>
            <p className="text-[11px] text-text-muted">{t('views')}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-text">{formatCompactNumber(video.viewsPerDay, locale)}</p>
            <p className="text-[11px] text-text-muted">{t('views_per_day')}</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-text">{formatCompactNumber(video.channelSubscribers, locale)}</p>
            <p className="text-[11px] text-text-muted">{t('subscribers')}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] text-text-muted">
            {t('published_ago')} {formatDate(video.publishedAt, locale)}
          </p>
          <Button
            size="sm"
            variant="secondary"
            disabled={alreadyImported}
            onClick={() =>
              importChannel({
                name: video.channelTitle,
                handle: video.channelHandle ?? video.channelId,
                niche: '',
                url: video.channelHandle
                  ? `https://www.youtube.com/${video.channelHandle}`
                  : `https://www.youtube.com/channel/${video.channelId}`,
                subscribers: video.channelSubscribers,
              })
            }
          >
            {alreadyImported ? <Check size={14} /> : <Plus size={14} />}
            {alreadyImported ? t('channel_imported') : t('import_this_channel')}
          </Button>
        </div>
      </div>
    </Card>
  )
}
