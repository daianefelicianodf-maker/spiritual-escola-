import type { VideoStage } from '@/lib/types'
import { useTranslation, type TranslationKey } from '@/lib/i18n'
import { Badge } from '@/components/ui/Badge'

const stageConfig: Record<VideoStage, { labelKey: TranslationKey; tone: 'default' | 'accent' | 'success' | 'warning' }> = {
  idea: { labelKey: 'stage_idea', tone: 'default' },
  script: { labelKey: 'stage_script', tone: 'accent' },
  recording: { labelKey: 'stage_recording', tone: 'warning' },
  editing: { labelKey: 'stage_editing', tone: 'warning' },
  published: { labelKey: 'stage_published', tone: 'success' },
}

export function StageBadge({ stage }: { stage: VideoStage }) {
  const { t } = useTranslation()
  const config = stageConfig[stage]
  return <Badge tone={config.tone}>{t(config.labelKey)}</Badge>
}

export { stageConfig }
