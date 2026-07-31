import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { ChannelMetricPoint } from '@/lib/types'
import { useTranslation } from '@/lib/i18n'
import { formatCompactNumber, formatDate } from '@/lib/utils'
import { Card, CardHeader, CardTitle } from '@/components/ui/Card'

function ChartTooltip({ active, payload, label, locale }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-surface-2 px-3 py-2 text-xs shadow-lg">
      <p className="mb-1 text-text-muted">{formatDate(label, locale)}</p>
      {payload.map((entry: any) => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {formatCompactNumber(entry.value, locale)}
        </p>
      ))}
    </div>
  )
}

export function OverviewCharts({ metrics }: { metrics: ChannelMetricPoint[] }) {
  const { t, locale } = useTranslation()

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t('stat_views')}</CardTitle>
        </CardHeader>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c5cff" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#7c5cff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262632" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(v) => formatDate(v, locale)}
                stroke="#8a8a9a"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(v) => formatCompactNumber(v, locale)}
                stroke="#8a8a9a"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={44}
              />
              <Tooltip content={<ChartTooltip locale={locale} />} />
              <Area type="monotone" dataKey="views" stroke="#7c5cff" fill="url(#viewsGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('stat_subscribers')}</CardTitle>
        </CardHeader>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics}>
              <defs>
                <linearGradient id="subsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff5c9c" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#ff5c9c" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#262632" vertical={false} />
              <XAxis
                dataKey="date"
                tickFormatter={(v) => formatDate(v, locale)}
                stroke="#8a8a9a"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(v) => formatCompactNumber(v, locale)}
                stroke="#8a8a9a"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={44}
              />
              <Tooltip content={<ChartTooltip locale={locale} />} />
              <Area type="monotone" dataKey="subscribers" stroke="#ff5c9c" fill="url(#subsGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}
