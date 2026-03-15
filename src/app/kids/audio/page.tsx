'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, PlayCircle } from 'lucide-react'

const AUDIO_STORIES = [
  { id: '1', title: 'Little Krishna\'s Butter Theft', duration: '5:20', emoji: '🧈', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: '2', title: 'How Ganesha Got His Elephant Head', duration: '7:45', emoji: '🐘', color: 'bg-orange-100 text-orange-800 border-orange-200' },
  { id: '3', title: 'Hanuman\'s Devotion to Rama', duration: '6:10', emoji: '🐒', color: 'bg-red-100 text-red-800 border-red-200' },
]

export default function KidsAudioStoriesPage() {
  return (
    <div className="min-h-screen bg-blue-50 pb-16">
      <div className="bg-white border-b border-blue-100 px-4 py-4 sticky top-16 z-40">
        <div className="max-w-4xl mx-auto flex items-center">
          <Link href="/kids" className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Kids Zone
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🎙️ Audio Stories</h1>
        <p className="text-gray-500 mb-8">Close your eyes and listen to beautiful mythological tales.</p>

        <div className="space-y-4">
          {AUDIO_STORIES.map((story, i) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className={`flex items-center gap-4 rounded-full border p-3 pr-6 shadow-sm transition-all cursor-pointer ${story.color}`}
            >
              <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center text-3xl shadow-sm">
                {story.emoji}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">{story.title}</h3>
                <p className="text-sm opacity-80">{story.duration} • Listen Now</p>
              </div>
              <button className="h-10 w-10 text-current hover:scale-110 flex-shrink-0 transition-transform">
                <PlayCircle size={40} className="fill-white" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
