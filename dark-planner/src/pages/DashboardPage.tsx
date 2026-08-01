import { Link } from 'react-router-dom'
import { Tv, Users, Eye, Clapperboard } from 'lucide-react'
import { useDarkPlannerStore } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'
import { formatCompactNumber, formatDate } from '@/lib/utils'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StageBadge } from '@/components/planner/StageBadge'
import { BackupHint } from '@/components/ui/BackupHint'

export function DashboardPage() {
  const { t, locale } = useTranslation()
  const channels = useDarkPlannerStore((s) => s.channels)
  const videos = useDarkPlannerStore((s) => s.videos)

  const totalSubscribers = channels.reduce((sum, c) => sum + c.subscribers, 0)
  const totalViews = channels.reduce((sum, c) => sum + c.totalViews, 0)
  const inProgress = videos.filter((v) => v.stage !== 'published')
  const upcoming = [...inProgress]
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 6)

  if (channels.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center text-center">
        <p className="mb-4 text-text-muted">{t('empty_dashboard')}</p>
        <Link to="/channels">
          <Button>{t('import_channel')}</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-text">{t('dashboard_title')}</h1>
      <p className="mt-1 text-sm text-text-muted">{t('dashboard_subtitle')}</p>

      <div className="mt-6">
        <BackupHint />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t('stat_channels')} value={String(channels.length)} icon={Tv} />
        <StatCard label={t('stat_subscribers')} value={formatCompactNumber(totalSubscribers, locale)} icon={Users} />
        <StatCard label={t('stat_views')} value={formatCompactNumber(totalViews, locale)} icon={Eye} />
        <StatCard label={t('stat_videos_in_progress')} value={String(inProgress.length)} icon={Clapperboard} />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t('upcoming_deadlines')}</CardTitle>
        </CardHeader>
        <div className="flex flex-col divide-y divide-border">
          {upcoming.length === 0 && <p className="py-4 text-sm text-text-muted">{t('no_videos')}</p>}
          {upcoming.map((video) => {
            const channel = channels.find((c) => c.id === video.channelId)
            return (
              <div key={video.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-text">{video.title}</p>
                  <p className="text-xs text-text-muted">{channel?.name}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-text-muted">{formatDate(video.dueDate, locale)}</span>
                  <StageBadge stage={video.stage} />
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
