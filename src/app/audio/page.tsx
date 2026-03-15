'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react'
import AudioCard from '@/components/ui/AudioCard'
import SearchBar from '@/components/ui/SearchBar'
import CategoryTabs from '@/components/ui/CategoryTabs'
import { useAudioStore, Track } from '@/store/audioStore'
import { useToast } from '@/store/toastStore'

const CATEGORIES = ['All', 'Bhajans', 'Mantras', 'Aarti', 'Meditation']

interface TrackItem {
  id: string
  title: string
  artist: string
  category: string
  duration: string
  coverEmoji: string
  fileUrl: string
}

// Sample tracks — in production these stream from Firebase Storage CDN
const TRACKS: TrackItem[] = [
  { id: '1', title: 'Om Namah Shivaya', artist: 'Pandit Ravi Shankar', category: 'Mantras', duration: '8:24', coverEmoji: '🕉️', fileUrl: '' },
  { id: '2', title: 'Jai Ganesh Jai Ganesh', artist: 'Anuradha Paudwal', category: 'Bhajans', duration: '5:12', coverEmoji: '🐘', fileUrl: '' },
  { id: '3', title: 'Hanuman Chalisa', artist: 'Hariharan', category: 'Bhajans', duration: '11:03', coverEmoji: '🐒', fileUrl: '' },
  { id: '4', title: 'Sukhkarta Dukhharta', artist: 'Lata Mangeshkar', category: 'Aarti', duration: '4:35', coverEmoji: '🪔', fileUrl: '' },
  { id: '5', title: 'Morning Meditation', artist: 'Sri M', category: 'Meditation', duration: '20:00', coverEmoji: '🧘', fileUrl: '' },
  { id: '6', title: 'Gayatri Mantra', artist: 'Vikram Hazra', category: 'Mantras', duration: '6:47', coverEmoji: '☀️', fileUrl: '' },
  { id: '7', title: 'Raghupati Raghav Raja Ram', artist: 'Classical Ensemble', category: 'Bhajans', duration: '7:15', coverEmoji: '🏹', fileUrl: '' },
  { id: '8', title: 'Shri Krishna Aarti', artist: 'Deva Premal', category: 'Aarti', duration: '5:00', coverEmoji: '🦚', fileUrl: '' },
  { id: '9', title: 'Deep Sleep Meditation', artist: 'Ananda More', category: 'Meditation', duration: '30:00', coverEmoji: '🌙', fileUrl: '' },
  { id: '10', title: 'Mahamrityunjaya Mantra', artist: 'Shankar Sahney', category: 'Mantras', duration: '9:18', coverEmoji: '🌺', fileUrl: '' },
]

function formatTime(sec: number) {
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function AudioPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [muted, setMuted] = useState(false)

  const {
    currentTrack, isPlaying, progress, currentTime, duration,
    setTrack, togglePlay, setProgress, setCurrentTime, setDuration,
    playNext, playPrev, addFavourite, removeFavourite, isFavourite, favourites,
    setPlaylist,
  } = useAudioStore()

  const { success, info } = useToast()
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Keep playlist in sync
  useEffect(() => {
    setPlaylist(TRACKS.map((t) => ({ id: t.id, title: t.title, artist: t.artist, category: t.category, fileUrl: t.fileUrl, albumImage: t.coverEmoji })))
  }, [setPlaylist])

  // Create/manage the Audio element
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }
    const audio = audioRef.current

    const onTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
        setCurrentTime(audio.currentTime)
      }
    }
    const onLoadedMetadata = () => setDuration(audio.duration)
    const onEnded = () => playNext()

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
    }
  }, [setProgress, setCurrentTime, setDuration, playNext])

  // React to track/playing state changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (currentTrack?.fileUrl) {
      if (audio.src !== currentTrack.fileUrl) {
        audio.src = currentTrack.fileUrl
        audio.load()
      }
      if (isPlaying) {
        audio.play().catch(() => {})
      } else {
        audio.pause()
      }
    } else {
      // No real URL yet — simulate UI-only playback
      if (!isPlaying) audio.pause()
    }
    audio.muted = muted
  }, [currentTrack, isPlaying, muted])

  const handlePlay = useCallback(
    (id: string) => {
      const track = TRACKS.find((t) => t.id === id)
      if (!track) return
      if (currentTrack?.id === id) {
        togglePlay()
      } else {
        setTrack({ id: track.id, title: track.title, artist: track.artist, category: track.category, fileUrl: track.fileUrl, albumImage: track.coverEmoji })
        if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: unknown }).gtag === 'function') {
          (window as unknown as { gtag: (e: string, n: string, p: object) => void }).gtag('event', 'audio_play', { track_id: id })
        }
      }
    },
    [currentTrack, togglePlay, setTrack]
  )

  const handleFavourite = useCallback(
    (id: string) => {
      const track = TRACKS.find((t) => t.id === id)
      if (!track) return
      if (isFavourite(id)) {
        removeFavourite(id)
        info('Removed from favourites')
      } else {
        addFavourite({ id: track.id, title: track.title, artist: track.artist, category: track.category, fileUrl: track.fileUrl, albumImage: track.coverEmoji })
        success('Added to favourites ❤️')
      }
    },
    [isFavourite, addFavourite, removeFavourite, success, info]
  )

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value)
    setProgress(val)
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (val / 100) * audioRef.current.duration
    }
  }

  const filtered = TRACKS.filter((t) => {
    const matchCat = activeCategory === 'All' || t.category === activeCategory
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.artist.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="min-h-screen pb-36">
      {/* Header */}
      <div className="gradient-spiritual px-4 pt-10 pb-14">
        <div className="mx-auto max-w-4xl">
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-white mb-1">
            🎵 Audio Library
          </motion.h1>
          <p className="text-white/70 text-sm">
            Bhajans, Mantras, Aarti &amp; Meditation
            {favourites.length > 0 && (
              <span className="ml-2 rounded-full bg-white/20 px-2 py-0.5 text-xs">
                ❤️ {favourites.length} saved
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 -mt-6 space-y-5">
        {/* Search */}
        <div className="glass-card rounded-2xl p-4 shadow-md border border-white/60">
          <SearchBar value={search} onChange={setSearch} placeholder="Search tracks or artists…" />
          <div className="mt-3">
            <CategoryTabs tabs={CATEGORIES} active={activeCategory} onChange={setActiveCategory} />
          </div>
        </div>

        {/* Track list */}
        <motion.div layout className="space-y-3">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-400 py-10">
                No tracks found. Try a different search.
              </motion.p>
            ) : (
              filtered.map((track) => (
                <motion.div key={track.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AudioCard
                    id={track.id}
                    title={track.title}
                    artist={track.artist}
                    category={track.category}
                    duration={track.duration}
                    coverEmoji={track.coverEmoji}
                    isPlaying={currentTrack?.id === track.id && isPlaying}
                    isFavourite={isFavourite(track.id)}
                    onPlay={handlePlay}
                    onFavourite={handleFavourite}
                  />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* ──────────── Sticky Audio Player ──────────── */}
      <AnimatePresence>
        {currentTrack && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            className="fixed bottom-0 left-0 right-0 z-40 glass-card border-t border-white/40 px-4 py-3 shadow-2xl"
          >
            <div className="mx-auto max-w-4xl">
              <div className="flex items-center gap-4">
                {/* Cover */}
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-saffron/10 text-2xl">
                  {currentTrack.albumImage ?? '🎵'}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">{currentTrack.title}</p>
                  <p className="text-xs text-gray-500 truncate">{currentTrack.artist}</p>
                </div>
                {/* Controls */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={playPrev}
                    className="text-gray-400 hover:text-saffron transition-colors"
                    aria-label="Previous track"
                  >
                    <SkipBack size={18} />
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePlay}
                    className="flex h-10 w-10 items-center justify-center rounded-full gradient-spiritual text-white shadow"
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                  </motion.button>
                  <button
                    onClick={playNext}
                    className="text-gray-400 hover:text-saffron transition-colors"
                    aria-label="Next track"
                  >
                    <SkipForward size={18} />
                  </button>
                  <button
                    onClick={() => setMuted((m) => !m)}
                    className="text-gray-400 hover:text-saffron transition-colors hidden sm:block"
                    aria-label={muted ? 'Unmute' : 'Mute'}
                  >
                    {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                </div>
              </div>

              {/* Progress bar + times */}
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-gray-400 w-8 text-right tabular-nums">
                  {formatTime(currentTime)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={progress}
                  onChange={handleSeek}
                  className="flex-1 h-1 accent-saffron cursor-pointer"
                  aria-label="Seek audio"
                />
                <span className="text-xs text-gray-400 w-8 tabular-nums">
                  {duration ? formatTime(duration) : '--:--'}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
