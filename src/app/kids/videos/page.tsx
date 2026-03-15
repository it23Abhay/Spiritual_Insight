'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Play } from 'lucide-react'

const VIDEOS = [
  { id: '1', title: 'The Story of Diwali', desc: 'Learn why we celebrate the festival of lights!', emoji: '🪔', color: 'bg-rose-100' },
  { id: '2', title: 'Prahlad and Holika', desc: 'The brave little devotee of Vishnu.', emoji: '🔥', color: 'bg-orange-100' },
  { id: '3', title: 'Krishna defeats Kaliya', desc: 'Krishna dances on the multi-headed serpent.', emoji: '🐍', color: 'bg-emerald-100' },
]

export default function KidsVideosPage() {
  return (
    <div className="min-h-screen bg-rose-50 pb-16">
      <div className="bg-white border-b border-rose-100 px-4 py-4 sticky top-16 z-40">
        <div className="max-w-4xl mx-auto flex items-center">
          <Link href="/kids" className="flex items-center text-rose-600 hover:text-rose-800 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Kids Zone
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🎬 Animated Videos</h1>
        <p className="text-gray-500 mb-8">Fun, colorful, and educational videos for kids.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {VIDEOS.map((video, i) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg border border-rose-100 transition-all cursor-pointer group"
            >
              <div className={`aspect-video ${video.color} relative flex items-center justify-center`}>
                <span className="text-6xl">{video.emoji}</span>
                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center text-rose-500 shadow-md">
                    <Play size={28} className="ml-1" />
                  </div>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-800 text-lg mb-1">{video.title}</h3>
                <p className="text-sm text-gray-500">{video.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
