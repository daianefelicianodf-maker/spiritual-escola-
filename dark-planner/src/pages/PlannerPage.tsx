import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useDarkPlannerStore } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'
import { Button } from '@/components/ui/Button'
import { PlannerBoard } from '@/components/planner/PlannerBoard'
import { NewVideoDialog } from '@/components/planner/NewVideoDialog'

export function PlannerPage() {
  const { t } = useTranslation()
  const channels = useDarkPlannerStore((s) => s.channels)
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text">{t('planner_title')}</h1>
          <p className="mt-1 text-sm text-text-muted">{t('planner_subtitle')}</p>
        </div>
        <Button onClick={() => setDialogOpen(true)} disabled={channels.length === 0}>
          <Plus size={16} />
          {t('new_video')}
        </Button>
      </div>

      <div className="mt-6">
        <PlannerBoard />
      </div>

      <NewVideoDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
