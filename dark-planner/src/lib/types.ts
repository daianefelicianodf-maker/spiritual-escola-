export type Locale = 'pt-BR' | 'en' | 'es'

export interface Channel {
  id: string
  name: string
  handle: string
  url?: string
  avatarColor: string
  subscribers: number
  totalViews: number
  videosCount: number
  niche: string
  connectedAt: string
}

export type VideoStage = 'idea' | 'script' | 'recording' | 'editing' | 'published'

export interface PlannedVideo {
  id: string
  channelId: string
  title: string
  stage: VideoStage
  dueDate: string
  scriptFileName?: string
  audioFileName?: string
  notes?: string
}

export interface ChannelMetricPoint {
  date: string
  views: number
  subscribers: number
}

export type TrendingWindow = '24h' | '48h' | '7d' | '30d'

export interface TrendingVideo {
  videoId: string
  title: string
  thumbnail: string
  publishedAt: string
  viewCount: number
  channelId: string
  channelTitle: string
  channelHandle?: string
  channelThumbnail?: string
  channelSubscribers: number
  viewsPerDay: number
  viralScore: number
}
