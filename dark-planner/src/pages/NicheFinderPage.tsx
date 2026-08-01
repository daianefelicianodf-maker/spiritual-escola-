import { useState } from 'react'
import { Search, KeyRound, Loader2, AlertCircle } from 'lucide-react'
import { useDarkPlannerStore } from '@/lib/store'
import { useTranslation, type TranslationKey } from '@/lib/i18n'
import { searchTrendingVideos, YoutubeApiError } from '@/lib/youtube'
import type { TrendingVideo, TrendingWindow } from '@/lib/types'
import { Card } from '@/components/ui/Card'
import { Field, Input, NativeSelect } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { TrendingVideoCard } from '@/components/niche/TrendingVideoCard'

const REGIONS: { value: string; labelKey?: TranslationKey; label?: string }[] = [
  { value: '', labelKey: 'region_any' },
  { value: 'BR', label: 'Brasil' },
  { value: 'PT', label: 'Portugal' },
  { value: 'US', label: 'United States' },
  { value: 'ES', label: 'España' },
  { value: 'MX', label: 'México' },
]

const WINDOWS: { value: TrendingWindow; labelKey: TranslationKey }[] = [
  { value: '24h', labelKey: 'window_24h' },
  { value: '48h', labelKey: 'window_48h' },
  { value: '7d', labelKey: 'window_7d' },
  { value: '30d', labelKey: 'window_30d' },
]

export function NicheFinderPage() {
  const { t } = useTranslation()
  const apiKey = useDarkPlannerStore((s) => s.youtubeApiKey)
  const setYoutubeApiKey = useDarkPlannerStore((s) => s.setYoutubeApiKey)

  const [keyDraft, setKeyDraft] = useState(apiKey)
  const [keySavedFlash, setKeySavedFlash] = useState(false)

  const [query, setQuery] = useState('')
  const [window, setWindowValue] = useState<TrendingWindow>('7d')
  const [region, setRegion] = useState('')

  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'done'>('idle')
  const [errorKey, setErrorKey] = useState<TranslationKey>('error_unknown')
  const [results, setResults] = useState<TrendingVideo[]>([])

  function handleSaveKey(e: React.FormEvent) {
    e.preventDefault()
    setYoutubeApiKey(keyDraft)
    setKeySavedFlash(true)
    setTimeout(() => setKeySavedFlash(false), 2500)
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!query.trim()) return

    if (!apiKey.trim()) {
      setStatus('error')
      setErrorKey('error_missing_key')
      return
    }

    setStatus('loading')
    try {
      const videos = await searchTrendingVideos({
        apiKey,
        query: query.trim(),
        window,
        regionCode: region || undefined,
      })
      setResults(videos)
      setStatus('done')
    } catch (err) {
      setStatus('error')
      if (err instanceof YoutubeApiError) {
        const keyByCode: Record<typeof err.code, TranslationKey> = {
          missing_key: 'error_missing_key',
          invalid_key: 'error_invalid_key',
          quota_exceeded: 'error_quota_exceeded',
          network: 'error_network',
          unknown: 'error_unknown',
        }
        setErrorKey(keyByCode[err.code])
      } else {
        setErrorKey('error_unknown')
      }
    }
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-semibold text-text">{t('niche_finder_title')}</h1>
        <p className="mt-1 text-sm text-text-muted">{t('niche_finder_subtitle')}</p>
      </div>

      <Card className="mt-6">
        <form onSubmit={handleSaveKey} className="flex items-end gap-3">
          <div className="flex-1">
            <Field label={t('api_key_label')}>
              <Input
                type="password"
                value={keyDraft}
                onChange={(e) => setKeyDraft(e.target.value)}
                placeholder={t('api_key_placeholder')}
              />
            </Field>
          </div>
          <Button type="submit" variant="secondary" className="mb-3">
            <KeyRound size={14} />
            {keySavedFlash ? t('api_key_saved') : t('api_key_save')}
          </Button>
        </form>
        <p className="text-xs text-text-muted">{t('api_key_hint')}</p>
      </Card>

      <Card className="mt-4">
        <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-3">
          <div className="min-w-56 flex-1">
            <Field label={t('field_niche')}>
              <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t('search_niche_placeholder')} />
            </Field>
          </div>
          <div className="w-40">
            <Field label={t('window_label')}>
              <NativeSelect value={window} onChange={(e) => setWindowValue(e.target.value as TrendingWindow)}>
                {WINDOWS.map((w) => (
                  <option key={w.value} value={w.value}>
                    {t(w.labelKey)}
                  </option>
                ))}
              </NativeSelect>
            </Field>
          </div>
          <div className="w-44">
            <Field label={t('region_label')}>
              <NativeSelect value={region} onChange={(e) => setRegion(e.target.value)}>
                {REGIONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.labelKey ? t(r.labelKey) : r.label}
                  </option>
                ))}
              </NativeSelect>
            </Field>
          </div>
          <Button type="submit" disabled={status === 'loading'} className="mb-3">
            {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
            {status === 'loading' ? t('searching') : t('search_button')}
          </Button>
        </form>
      </Card>

      {status === 'error' && (
        <p className="mt-4 flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          <AlertCircle size={16} />
          {t(errorKey)}
        </p>
      )}

      {status === 'idle' && <p className="mt-10 text-center text-sm text-text-muted">{t('results_empty')}</p>}

      {status === 'done' && results.length === 0 && (
        <p className="mt-10 text-center text-sm text-text-muted">{t('results_none')}</p>
      )}

      {results.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((video) => (
            <TrendingVideoCard key={video.videoId} video={video} />
          ))}
        </div>
      )}
    </div>
  )
}
