import { useState } from 'react'
import { useDarkPlannerStore } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'
import { seedMetrics } from '@/lib/mock-data'
import { NativeSelect } from '@/components/ui/Field'
import { OverviewCharts } from '@/components/analytics/OverviewCharts'

export function AnalyticsPage() {
  const { t } = useTranslation()
  const channels = useDarkPlannerStore((s) => s.channels)
  const [channelId, setChannelId] = useState(channels[0]?.id ?? '')

  const activeChannelId = channels.some((c) => c.id === channelId) ? channelId : channels[0]?.id
  const metrics = activeChannelId ? (seedMetrics[activeChannelId] ?? []) : []

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text">{t('analytics_title')}</h1>
          <p className="mt-1 text-sm text-text-muted">{t('analytics_subtitle')}</p>
        </div>
        {channels.length > 0 && (
          <NativeSelect
            className="w-56"
            value={activeChannelId}
            onChange={(e) => setChannelId(e.target.value)}
          >
            {channels.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </NativeSelect>
        )}
      </div>

      <div className="mt-6">
        {channels.length === 0 ? (
          <p className="text-sm text-text-muted">{t('no_channels')}</p>
        ) : metrics.length === 0 ? (
          <p className="text-sm text-text-muted">{t('select_channel')}</p>
        ) : (
          <OverviewCharts metrics={metrics} />
        )}
      </div>
    </div>
  )
}
