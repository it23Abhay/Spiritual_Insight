'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import VideoCard from '@/components/ui/VideoCard'
import SearchBar from '@/components/ui/SearchBar'
import CategoryTabs from '@/components/ui/CategoryTabs'

const CATEGORIES = ['All', 'Spiritual Shorts', 'Kids Stories', 'Festival Specials', 'Temple Docs']

const VIDEOS = [
  { id: '1', title: 'The Story of Lord Shiva', category: 'Spiritual Shorts', duration: '8:30', thumbnailEmoji: '🕉️' },
  { id: '2', title: 'Krishna and Sudama', category: 'Kids Stories', duration: '12:00', thumbnailEmoji: '🦚' },
  { id: '3', title: 'Diwali Celebration Guide', category: 'Festival Specials', duration: '15:00', thumbnailEmoji: '🪔' },
  { id: '4', title: 'Varanasi Temple Tour', category: 'Temple Docs', duration: '22:00', thumbnailEmoji: '⛪' },
  { id: '5', title: "Hanuman's Devotion", category: 'Spiritual Shorts', duration: '6:45', thumbnailEmoji: '🐒' },
  { id: '6', title: "Ganesha's Wisdom Tales", category: 'Kids Stories', duration: '9:20', thumbnailEmoji: '🐘' },
  { id: '7', title: 'Holi — Festival of Colors', category: 'Festival Specials', duration: '18:00', thumbnailEmoji: '🎨' },
  { id: '8', title: 'Tirupati Balaji Documentary', category: 'Temple Docs', duration: '35:00', thumbnailEmoji: '🏛️' },
]

const RECOMMENDED = [VIDEOS[0], VIDEOS[2], VIDEOS[4]]

export default function VideosPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  const filtered = VIDEOS.filter((v) => {
    const matchCat = activeCategory === 'All' || v.category === activeCategory
    const matchSearch = v.title.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const currentVideo = VIDEOS.find((v) => v.id === activeVideo)

  const handleOpen = (id: string) => {
    setActiveVideo(id)
    if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: unknown }).gtag === 'function') {
      (window as unknown as { gtag: (e: string, n: string, p: object) => void }).gtag('event', 'video_play', { video_id: id })
    }
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="gradient-spiritual px-4 pt-10 pb-14">
        <div className="mx-auto max-w-5xl">
          <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold text-white mb-1">
            📹 Video Library
          </motion.h1>
          <p className="text-white/70 text-sm">Spiritual Shorts · Kids Stories · Festival Specials · Temple Docs</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 -mt-6 space-y-6 pb-10">
        {/* Recommended row */}
        <section aria-label="Recommended videos">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">⭐ Recommended for You</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
            {RECOMMENDED.map((v) => (
              <motion.button
                key={v.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleOpen(v.id)}
                className="snap-start flex-shrink-0 w-48 rounded-2xl glass-card border border-white/60 overflow-hidden shadow-md text-left"
              >
                <div className="flex h-28 items-center justify-center gradient-calm">
                  <span className="text-5xl">{v.thumbnailEmoji}</span>
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-gray-700 truncate">{v.title}</p>
                  <p className="text-xs text-saffron mt-0.5">{v.category}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        {/* Search + Tabs */}
        <div className="glass-card rounded-2xl p-4 shadow-md border border-white/60">
          <SearchBar value={search} onChange={setSearch} placeholder="Search videos…" />
          <div className="mt-3">
            <CategoryTabs tabs={CATEGORIES} active={activeCategory} onChange={setActiveCategory} />
          </div>
        </div>

        {/* Video player modal */}
        <AnimatePresence>
          {activeVideo && currentVideo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-2xl border border-white/60 overflow-hidden shadow-xl"
            >
              <div className="flex h-64 items-center justify-center gradient-calm relative">
                <span className="text-8xl opacity-30">{currentVideo.thumbnailEmoji}</span>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl mb-2">{currentVideo.thumbnailEmoji}</span>
                  <p className="font-bold text-gray-800">{currentVideo.title}</p>
                  <p className="text-sm text-gray-500 mt-1">{currentVideo.duration}</p>
                </div>
              </div>
              <div className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold text-gray-800">{currentVideo.title}</p>
                  <span className="text-xs text-deep-blue">{currentVideo.category}</span>
                </div>
                <button
                  onClick={() => setActiveVideo(null)}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                  aria-label="Close video player"
                >
                  Close
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full text-center text-gray-400 py-10">
                No videos found.
              </motion.p>
            ) : (
              filtered.map((v) => (
                <motion.div key={v.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <VideoCard {...v} onClick={handleOpen} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
