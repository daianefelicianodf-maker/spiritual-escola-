import { useState } from 'react'
import type { VideoStage } from '@/lib/types'
import { useDarkPlannerStore } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { VideoCard } from './VideoCard'
import { stageConfig } from './StageBadge'

const stages: VideoStage[] = ['idea', 'script', 'recording', 'editing', 'published']

export function PlannerBoard() {
  const { t } = useTranslation()
  const videos = useDarkPlannerStore((s) => s.videos)
  const updateVideoStage = useDarkPlannerStore((s) => s.updateVideoStage)
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [hoverStage, setHoverStage] = useState<VideoStage | null>(null)

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {stages.map((stage) => {
        const items = videos.filter((v) => v.stage === stage)
        return (
          <div
            key={stage}
            onDragOver={(e) => {
              e.preventDefault()
              setHoverStage(stage)
            }}
            onDragLeave={() => setHoverStage((current) => (current === stage ? null : current))}
            onDrop={(e) => {
              e.preventDefault()
              if (draggedId) updateVideoStage(draggedId, stage)
              setDraggedId(null)
              setHoverStage(null)
            }}
            className={cn(
              'flex w-72 shrink-0 flex-col rounded-2xl border border-border bg-surface p-3 transition-colors',
              hoverStage === stage && 'border-accent/60 bg-accent/5',
            )}
          >
            <div className="mb-3 flex items-center justify-between px-1">
              <span className="text-sm font-semibold text-text">{t(stageConfig[stage].labelKey)}</span>
              <span className="text-xs text-text-muted">{items.length}</span>
            </div>
            <div className="flex min-h-16 flex-col gap-2">
              {items.map((video) => (
                <VideoCard key={video.id} video={video} onDragStart={setDraggedId} />
              ))}
              {items.length === 0 && (
                <p className="rounded-xl border border-dashed border-border p-4 text-center text-xs text-text-muted">
                  {t('no_videos')}
                </p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
