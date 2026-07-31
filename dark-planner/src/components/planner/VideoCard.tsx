import { FileText, Mic } from 'lucide-react'
import type { PlannedVideo } from '@/lib/types'
import { useDarkPlannerStore } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'
import { formatDate } from '@/lib/utils'

export function VideoCard({ video, onDragStart }: { video: PlannedVideo; onDragStart: (id: string) => void }) {
  const { locale } = useTranslation()
  const channel = useDarkPlannerStore((s) => s.channels.find((c) => c.id === video.channelId))

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = 'move'
        onDragStart(video.id)
      }}
      className="cursor-grab rounded-xl border border-border bg-surface-2 p-3 active:cursor-grabbing"
    >
      <p className="text-sm font-medium text-text">{video.title}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs text-text-muted">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: channel?.avatarColor }} />
          {channel?.name}
        </span>
        <span className="text-xs text-text-muted">{formatDate(video.dueDate, locale)}</span>
      </div>
      {(video.scriptFileName || video.audioFileName) && (
        <div className="mt-2 flex gap-2">
          {video.scriptFileName && (
            <span className="flex items-center gap-1 rounded-md bg-surface px-1.5 py-0.5 text-[10px] text-text-muted">
              <FileText size={11} />
              {truncateFileName(video.scriptFileName)}
            </span>
          )}
          {video.audioFileName && (
            <span className="flex items-center gap-1 rounded-md bg-surface px-1.5 py-0.5 text-[10px] text-text-muted">
              <Mic size={11} />
              {truncateFileName(video.audioFileName)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

function truncateFileName(fileName: string): string {
  return fileName.length > 16 ? `${fileName.slice(0, 14)}…` : fileName
}
