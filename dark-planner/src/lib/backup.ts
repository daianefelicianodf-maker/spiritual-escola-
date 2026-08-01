import { useDarkPlannerStore } from './store'
import type { Channel, PlannedVideo } from './types'

interface BackupPayload {
  version: 1
  exportedAt: string
  channels: Channel[]
  videos: PlannedVideo[]
}

export async function exportBackup(): Promise<void> {
  const { channels, videos } = useDarkPlannerStore.getState()
  const payload: BackupPayload = {
    version: 1,
    exportedAt: new Date().toISOString(),
    channels,
    videos,
  }
  const json = JSON.stringify(payload, null, 2)
  const filename = `dark-planner-backup-${new Date().toISOString().slice(0, 10)}.json`

  if (window.claude?.downloads) {
    await window.claude.downloads.save({ filename, data: json })
    return
  }

  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export function importBackupFromFile(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('read_error'))
    reader.onload = () => {
      try {
        const payload = JSON.parse(String(reader.result)) as Partial<BackupPayload>
        if (!Array.isArray(payload.channels) || !Array.isArray(payload.videos)) {
          throw new Error('invalid_shape')
        }
        useDarkPlannerStore.setState({ channels: payload.channels, videos: payload.videos })
        resolve()
      } catch (err) {
        reject(err instanceof Error ? err : new Error('parse_error'))
      }
    }
    reader.readAsText(file)
  })
}
