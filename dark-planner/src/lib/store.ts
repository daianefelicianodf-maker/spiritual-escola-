import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Channel, Locale, PlannedVideo, VideoStage } from './types'
import { seedChannels, seedPlannedVideos } from './mock-data'
import { uid } from './utils'

interface DarkPlannerState {
  locale: Locale
  setLocale: (locale: Locale) => void

  channels: Channel[]
  activeChannelId: string | null
  setActiveChannel: (id: string | null) => void
  importChannel: (input: { name: string; handle: string; niche: string }) => Channel
  removeChannel: (id: string) => void

  videos: PlannedVideo[]
  addVideo: (input: Omit<PlannedVideo, 'id' | 'stage'> & { stage?: VideoStage }) => PlannedVideo
  updateVideoStage: (id: string, stage: VideoStage) => void
  attachScript: (id: string, fileName: string) => void
  attachAudio: (id: string, fileName: string) => void
  removeVideo: (id: string) => void
}

const AVATAR_COLORS = ['#7c5cff', '#ff5c9c', '#34d399', '#fbbf24', '#38bdf8', '#f472b6']

export const useDarkPlannerStore = create<DarkPlannerState>()(
  persist(
    (set, get) => ({
      locale: 'pt-BR',
      setLocale: (locale) => set({ locale }),

      channels: seedChannels,
      activeChannelId: null,
      setActiveChannel: (id) => set({ activeChannelId: id }),
      importChannel: ({ name, handle, niche }) => {
        const channel: Channel = {
          id: uid('ch'),
          name,
          handle: handle.startsWith('@') ? handle : `@${handle}`,
          avatarColor: AVATAR_COLORS[get().channels.length % AVATAR_COLORS.length],
          subscribers: 0,
          totalViews: 0,
          videosCount: 0,
          niche,
          connectedAt: new Date().toISOString().slice(0, 10),
        }
        set((state) => ({ channels: [...state.channels, channel] }))
        return channel
      },
      removeChannel: (id) =>
        set((state) => ({
          channels: state.channels.filter((c) => c.id !== id),
          videos: state.videos.filter((v) => v.channelId !== id),
          activeChannelId: state.activeChannelId === id ? null : state.activeChannelId,
        })),

      videos: seedPlannedVideos,
      addVideo: (input) => {
        const video: PlannedVideo = { id: uid('v'), stage: 'idea', ...input }
        set((state) => ({ videos: [video, ...state.videos] }))
        return video
      },
      updateVideoStage: (id, stage) =>
        set((state) => ({
          videos: state.videos.map((v) => (v.id === id ? { ...v, stage } : v)),
        })),
      attachScript: (id, fileName) =>
        set((state) => ({
          videos: state.videos.map((v) => (v.id === id ? { ...v, scriptFileName: fileName } : v)),
        })),
      attachAudio: (id, fileName) =>
        set((state) => ({
          videos: state.videos.map((v) => (v.id === id ? { ...v, audioFileName: fileName } : v)),
        })),
      removeVideo: (id) => set((state) => ({ videos: state.videos.filter((v) => v.id !== id) })),
    }),
    { name: 'dark-planner-storage' },
  ),
)
