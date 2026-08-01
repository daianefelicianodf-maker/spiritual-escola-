import type { Channel, ChannelMetricPoint, PlannedVideo } from './types'
import { uid } from './utils'

export const SEED_CHANNEL_IDS = ['ch_1', 'ch_2', 'ch_3']

export const seedChannels: Channel[] = [
  {
    id: 'ch_1',
    name: 'Mundo Místico',
    handle: '@mundomistico',
    avatarColor: '#7c5cff',
    subscribers: 184000,
    totalViews: 12400000,
    videosCount: 214,
    niche: 'Espiritualidade',
    connectedAt: '2024-02-11',
  },
  {
    id: 'ch_2',
    name: 'Histórias da Noite',
    handle: '@historiasdanoite',
    avatarColor: '#ff5c9c',
    subscribers: 96500,
    totalViews: 5300000,
    videosCount: 132,
    niche: 'Narrativas',
    connectedAt: '2024-06-03',
  },
  {
    id: 'ch_3',
    name: 'Fatos Ocultos',
    handle: '@fatosocultos',
    avatarColor: '#34d399',
    subscribers: 41200,
    totalViews: 1800000,
    videosCount: 58,
    niche: 'Curiosidades',
    connectedAt: '2025-01-20',
  },
]

export const seedPlannedVideos: PlannedVideo[] = [
  { id: uid('v'), channelId: 'ch_1', title: 'Os 7 sinais que sua intuição está tentando te avisar', stage: 'idea', dueDate: '2026-08-05' },
  { id: uid('v'), channelId: 'ch_1', title: 'Por que você sente a presença de alguém que já partiu', stage: 'script', dueDate: '2026-08-03', scriptFileName: 'roteiro-presenca.docx' },
  { id: uid('v'), channelId: 'ch_2', title: 'A casa que ninguém quis comprar (história real)', stage: 'recording', dueDate: '2026-08-02', scriptFileName: 'roteiro-casa.docx', audioFileName: 'narracao-casa-v2.mp3' },
  { id: uid('v'), channelId: 'ch_2', title: 'O diário encontrado no sótão', stage: 'editing', dueDate: '2026-07-30', audioFileName: 'narracao-diario-final.mp3' },
  { id: uid('v'), channelId: 'ch_3', title: '5 fenômenos que a ciência ainda não explicou', stage: 'published', dueDate: '2026-07-24' },
  { id: uid('v'), channelId: 'ch_3', title: 'O mistério do relógio parado às 3h33', stage: 'idea', dueDate: '2026-08-09' },
]

function buildSeries(base: number, days: number): ChannelMetricPoint[] {
  const points: ChannelMetricPoint[] = []
  const today = new Date('2026-07-31')
  let subs = base
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const noise = Math.sin(i / 3) * base * 0.02 + Math.random() * base * 0.015
    subs += noise
    points.push({
      date: d.toISOString().slice(0, 10),
      views: Math.max(0, Math.round(base * 0.08 + noise * 6)),
      subscribers: Math.round(subs),
    })
  }
  return points
}

export const seedMetrics: Record<string, ChannelMetricPoint[]> = {
  ch_1: buildSeries(180000, 30),
  ch_2: buildSeries(94000, 30),
  ch_3: buildSeries(39000, 30),
}
