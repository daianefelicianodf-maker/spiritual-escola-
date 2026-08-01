import { useEffect, useState } from 'react'
import { Search, KeyRound, Loader2, AlertCircle, Flame } from 'lucide-react'
import { useDarkPlannerStore } from '@/lib/store'
import { useTranslation, type TranslationKey } from '@/lib/i18n'
import { searchTrendingVideos, fetchTrendingChart, fetchVideoCategories, YoutubeApiError, type VideoCategory } from '@/lib/youtube'
import type { TrendingVideo, TrendingWindow } from '@/lib/types'
import { Card } from '@/components/ui/Card'
import { Field, Input, NativeSelect } from '@/components/ui/Field'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
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

const ERROR_KEY_BY_CODE: Record<YoutubeApiError['code'], TranslationKey> = {
  missing_key: 'error_missing_key',
  invalid_key: 'error_invalid_key',
  quota_exceeded: 'error_quota_exceeded',
  network: 'error_network',
  unknown: 'error_unknown',
}

export function NicheFinderPage() {
  const { t } = useTranslation()
  const apiKey = useDarkPlannerStore((s) => s.youtubeApiKey)
  const setYoutubeApiKey = useDarkPlannerStore((s) => s.setYoutubeApiKey)

  const [keyDraft, setKeyDraft] = useState(apiKey)
  const [keySavedFlash, setKeySavedFlash] = useState(false)

  const [mode, setMode] = useState<'niche' | 'trending'>('niche')

  const [query, setQuery] = useState('')
  const [window, setWindowValue] = useState<TrendingWindow>('7d')
  const [region, setRegion] = useState('')

  const [category, setCategory] = useState('')
  const [categories, setCategories] = useState<VideoCategory[]>([])

  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'done'>('idle')
  const [errorKey, setErrorKey] = useState<TranslationKey>('error_unknown')
  const [results, setResults] = useState<TrendingVideo[]>([])

  useEffect(() => {
    if (mode !== 'trending' || !apiKey.trim()) return
    let cancelled = false
    setCategory('')
    fetchVideoCategories({ apiKey, regionCode: region || 'BR' })
      .then((list) => {
        if (!cancelled) setCategories(list)
      })
      .catch(() => {
        if (!cancelled) setCategories([])
      })
    return () => {
      cancelled = true
    }
  }, [mode, apiKey, region])

  function handleSaveKey(e: React.FormEvent) {
    e.preventDefault()
    setYoutubeApiKey(keyDraft)
    setKeySavedFlash(true)
    setTimeout(() => setKeySavedFlash(false), 2500)
  }

  function handleModeChange(next: 'niche' | 'trending') {
    setMode(next)
    setStatus('idle')
    setResults([])
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
      setErrorKey(err instanceof YoutubeApiError ? ERROR_KEY_BY_CODE[err.code] : 'error_unknown')
    }
  }

  async function handleTrendingNow(e: React.FormEvent) {
    e.preventDefault()
    if (!apiKey.trim()) {
      setStatus('error')
      setErrorKey('error_missing_key')
      return
    }

    setStatus('loading')
    try {
      const videos = await fetchTrendingChart({
        apiKey,
        regionCode: region || 'BR',
        categoryId: category || undefined,
      })
      setResults(videos)
      setStatus('done')
    } catch (err) {
      setStatus('error')
      setErrorKey(err instanceof YoutubeApiError ? ERROR_KEY_BY_CODE[err.code] : 'error_unknown')
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

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          onClick={() => handleModeChange('niche')}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer',
            mode === 'niche' ? 'bg-accent text-white' : 'bg-surface-2 text-text-muted hover:text-text',
          )}
        >
          <Search size={14} className="mr-1.5 inline" />
          {t('tab_by_niche')}
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('trending')}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer',
            mode === 'trending' ? 'bg-accent text-white' : 'bg-surface-2 text-text-muted hover:text-text',
          )}
        >
          <Flame size={14} className="mr-1.5 inline" />
          {t('tab_trending_now')}
        </button>
      </div>

      {mode === 'niche' ? (
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
      ) : (
        <Card className="mt-4">
          <p className="mb-3 text-xs text-text-muted">{t('trending_now_subtitle')}</p>
          <form onSubmit={handleTrendingNow} className="flex flex-wrap items-end gap-3">
            <div className="w-44">
              <Field label={t('region_label')}>
                <NativeSelect value={region} onChange={(e) => setRegion(e.target.value)}>
                  {REGIONS.filter((r) => r.value).map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
            </div>
            <div className="w-56">
              <Field label={t('category_label')}>
                <NativeSelect value={category} onChange={(e) => setCategory(e.target.value)}>
                  <option value="">{t('category_all')}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </NativeSelect>
              </Field>
            </div>
            <Button type="submit" disabled={status === 'loading'} className="mb-3">
              {status === 'loading' ? <Loader2 size={16} className="animate-spin" /> : <Flame size={16} />}
              {status === 'loading' ? t('searching') : t('trending_now_button')}
            </Button>
          </form>
        </Card>
      )}

      {status === 'error' && (
        <p className="mt-4 flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          <AlertCircle size={16} />
          {t(errorKey)}
        </p>
      )}

      {status === 'idle' && (
        <p className="mt-10 text-center text-sm text-text-muted">
          {t(mode === 'niche' ? 'results_empty' : 'results_empty_trending')}
        </p>
      )}

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
