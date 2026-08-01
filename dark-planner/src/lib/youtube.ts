import type { TrendingVideo, TrendingWindow } from './types'

const API_BASE = 'https://www.googleapis.com/youtube/v3'

export class YoutubeApiError extends Error {
  code: 'missing_key' | 'invalid_key' | 'quota_exceeded' | 'network' | 'unknown'

  constructor(code: YoutubeApiError['code'], message: string) {
    super(message)
    this.code = code
  }
}

const WINDOW_TO_HOURS: Record<TrendingWindow, number> = {
  '24h': 24,
  '48h': 48,
  '7d': 24 * 7,
  '30d': 24 * 30,
}

function publishedAfterFor(window: TrendingWindow): string {
  const hours = WINDOW_TO_HOURS[window]
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString()
}

async function callApi(path: string, params: Record<string, string>): Promise<any> {
  const url = new URL(`${API_BASE}/${path}`)
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value)

  let res: Response
  try {
    res = await fetch(url.toString())
  } catch {
    throw new YoutubeApiError('network', 'network_error')
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    const reason = body?.error?.errors?.[0]?.reason ?? body?.error?.status ?? ''
    if (res.status === 400 || res.status === 403) {
      if (String(reason).toLowerCase().includes('quota')) {
        throw new YoutubeApiError('quota_exceeded', 'quota_exceeded')
      }
      throw new YoutubeApiError('invalid_key', 'invalid_key')
    }
    throw new YoutubeApiError('unknown', body?.error?.message ?? `http_${res.status}`)
  }

  return res.json()
}

interface SearchTrendingParams {
  apiKey: string
  query: string
  window: TrendingWindow
  regionCode?: string
  maxResults?: number
}

export async function searchTrendingVideos({
  apiKey,
  query,
  window,
  regionCode,
  maxResults = 24,
}: SearchTrendingParams): Promise<TrendingVideo[]> {
  if (!apiKey.trim()) throw new YoutubeApiError('missing_key', 'missing_key')

  const searchJson = await callApi('search', {
    key: apiKey,
    part: 'snippet',
    type: 'video',
    order: 'viewCount',
    maxResults: String(maxResults),
    q: query,
    publishedAfter: publishedAfterFor(window),
    ...(regionCode ? { regionCode } : {}),
  })

  const videoIds: string[] = (searchJson.items ?? []).map((item: any) => item.id?.videoId).filter(Boolean)
  if (videoIds.length === 0) return []

  const videosJson = await callApi('videos', {
    key: apiKey,
    part: 'snippet,statistics',
    id: videoIds.join(','),
  })

  const videoItems: any[] = videosJson.items ?? []
  const channelIds = [...new Set(videoItems.map((v) => v.snippet.channelId as string))]

  const channelsJson = await callApi('channels', {
    key: apiKey,
    part: 'snippet,statistics',
    id: channelIds.join(','),
  })

  const channelById = new Map<string, any>((channelsJson.items ?? []).map((c: any) => [c.id, c]))

  const results: TrendingVideo[] = videoItems.map((v) => {
    const channel = channelById.get(v.snippet.channelId)
    const subscribers = channel?.statistics?.hiddenSubscriberCount
      ? 0
      : Number(channel?.statistics?.subscriberCount ?? 0)
    const viewCount = Number(v.statistics?.viewCount ?? 0)
    const publishedAt = v.snippet.publishedAt as string
    const ageDays = Math.max(1 / 24, (Date.now() - new Date(publishedAt).getTime()) / 86_400_000)
    const viewsPerDay = viewCount / ageDays
    const viralScore = viewsPerDay / Math.max(subscribers, 1000)

    return {
      videoId: v.id,
      title: v.snippet.title,
      thumbnail: v.snippet.thumbnails?.medium?.url ?? v.snippet.thumbnails?.default?.url ?? '',
      publishedAt,
      viewCount,
      channelId: v.snippet.channelId,
      channelTitle: v.snippet.channelTitle,
      channelHandle: channel?.snippet?.customUrl ? `@${String(channel.snippet.customUrl).replace(/^@/, '')}` : undefined,
      channelThumbnail: channel?.snippet?.thumbnails?.default?.url,
      channelSubscribers: subscribers,
      viewsPerDay,
      viralScore,
    }
  })

  return results.sort((a, b) => b.viralScore - a.viralScore)
}

interface TrendingChartParams {
  apiKey: string
  regionCode: string
  categoryId?: string
  maxResults?: number
}

export async function fetchTrendingChart({
  apiKey,
  regionCode,
  categoryId,
  maxResults = 30,
}: TrendingChartParams): Promise<TrendingVideo[]> {
  if (!apiKey.trim()) throw new YoutubeApiError('missing_key', 'missing_key')

  const videosJson = await callApi('videos', {
    key: apiKey,
    part: 'snippet,statistics',
    chart: 'mostPopular',
    regionCode,
    maxResults: String(maxResults),
    ...(categoryId ? { videoCategoryId: categoryId } : {}),
  })

  const videoItems: any[] = videosJson.items ?? []
  if (videoItems.length === 0) return []

  const channelIds = [...new Set(videoItems.map((v) => v.snippet.channelId as string))]
  const channelsJson = await callApi('channels', {
    key: apiKey,
    part: 'snippet,statistics',
    id: channelIds.join(','),
  })
  const channelById = new Map<string, any>((channelsJson.items ?? []).map((c: any) => [c.id, c]))

  const results: TrendingVideo[] = videoItems.map((v) => {
    const channel = channelById.get(v.snippet.channelId)
    const subscribers = channel?.statistics?.hiddenSubscriberCount
      ? 0
      : Number(channel?.statistics?.subscriberCount ?? 0)
    const viewCount = Number(v.statistics?.viewCount ?? 0)
    const publishedAt = v.snippet.publishedAt as string
    const ageDays = Math.max(1 / 24, (Date.now() - new Date(publishedAt).getTime()) / 86_400_000)
    const viewsPerDay = viewCount / ageDays
    const viralScore = viewsPerDay / Math.max(subscribers, 1000)

    return {
      videoId: v.id,
      title: v.snippet.title,
      thumbnail: v.snippet.thumbnails?.medium?.url ?? v.snippet.thumbnails?.default?.url ?? '',
      publishedAt,
      viewCount,
      channelId: v.snippet.channelId,
      channelTitle: v.snippet.channelTitle,
      channelHandle: channel?.snippet?.customUrl ? `@${String(channel.snippet.customUrl).replace(/^@/, '')}` : undefined,
      channelThumbnail: channel?.snippet?.thumbnails?.default?.url,
      channelSubscribers: subscribers,
      viewsPerDay,
      viralScore,
    }
  })

  return results
}

export interface VideoCategory {
  id: string
  title: string
}

export async function fetchVideoCategories({
  apiKey,
  regionCode,
}: {
  apiKey: string
  regionCode: string
}): Promise<VideoCategory[]> {
  if (!apiKey.trim()) throw new YoutubeApiError('missing_key', 'missing_key')

  const json = await callApi('videoCategories', {
    key: apiKey,
    part: 'snippet',
    regionCode,
  })

  return (json.items ?? [])
    .filter((c: any) => c.snippet?.assignable)
    .map((c: any) => ({ id: c.id, title: c.snippet.title }))
}
