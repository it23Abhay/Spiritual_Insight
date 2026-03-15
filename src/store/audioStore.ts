import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ── Types ────────────────────────────────────────
export interface Track {
  id: string
  title: string
  artist: string
  category: string
  fileUrl: string
  duration?: number
  albumImage?: string
}

interface AudioState {
  currentTrack: Track | null
  isPlaying: boolean
  progress: number      // 0–100 percentage
  currentTime: number   // seconds
  duration: number      // seconds
  volume: number        // 0–1
  playlist: Track[]
  favourites: Track[]

  // Playback actions
  setTrack: (track: Track) => void
  play: () => void
  pause: () => void
  togglePlay: () => void
  setProgress: (progress: number) => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setVolume: (volume: number) => void
  setPlaylist: (tracks: Track[]) => void
  playNext: () => void
  playPrev: () => void

  // Favourites
  addFavourite: (track: Track) => void
  removeFavourite: (id: string) => void
  isFavourite: (id: string) => boolean
}

// ── Store ─────────────────────────────────────────
export const useAudioStore = create<AudioState>()(
  persist(
    (set, get) => ({
      currentTrack: null,
      isPlaying: false,
      progress: 0,
      currentTime: 0,
      duration: 0,
      volume: 0.8,
      playlist: [],
      favourites: [],

      setTrack: (track) => set({ currentTrack: track, progress: 0, currentTime: 0, isPlaying: true }),
      play: () => set({ isPlaying: true }),
      pause: () => set({ isPlaying: false }),
      togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
      setProgress: (progress) => set({ progress }),
      setCurrentTime: (currentTime) => set({ currentTime }),
      setDuration: (duration) => set({ duration }),
      setVolume: (volume) => set({ volume }),
      setPlaylist: (tracks) => set({ playlist: tracks }),

      playNext: () => {
        const { currentTrack, playlist } = get()
        if (!currentTrack || playlist.length === 0) return
        const idx = playlist.findIndex((t) => t.id === currentTrack.id)
        const next = playlist[(idx + 1) % playlist.length]
        set({ currentTrack: next, progress: 0, currentTime: 0, isPlaying: true })
      },

      playPrev: () => {
        const { currentTrack, playlist } = get()
        if (!currentTrack || playlist.length === 0) return
        const idx = playlist.findIndex((t) => t.id === currentTrack.id)
        const prev = playlist[(idx - 1 + playlist.length) % playlist.length]
        set({ currentTrack: prev, progress: 0, currentTime: 0, isPlaying: true })
      },

      addFavourite: (track) =>
        set((s) => ({
          favourites: s.favourites.some((f) => f.id === track.id)
            ? s.favourites
            : [...s.favourites, track],
        })),

      removeFavourite: (id) =>
        set((s) => ({ favourites: s.favourites.filter((f) => f.id !== id) })),

      isFavourite: (id) => get().favourites.some((f) => f.id === id),
    }),
    {
      name: 'audio-store',
      // Only persist favourites and volume — not transient playback state
      partialize: (state) => ({ favourites: state.favourites, volume: state.volume }),
    }
  )
)
