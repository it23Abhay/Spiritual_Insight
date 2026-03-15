'use client'

import { useState, Suspense } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const STORIES_DATA = [
  { id: '1', deity: 'krishna', title: 'The Childhood of Krishna', desc: 'Read about the miraculous birth and early adventures of Lord Krishna.', emoji: '🦚' },
  { id: '2', deity: 'krishna', title: 'Krishna and the Govardhan Hill', desc: 'How little Krishna lifted a mountain to save the villagers.', emoji: '⛰️' },
  { id: '3', deity: 'rama', title: 'The Birth of Lord Rama', desc: 'The joyous arrival of Lord Rama in Ayodhya.', emoji: '🏹' },
  { id: '4', deity: 'hanuman', title: 'Hanuman\'s Leap to the Sun', desc: 'The story of baby Hanuman mistaking the sun for a sweet mango.', emoji: '🥭' },
  { id: '5', deity: 'ganesha', title: 'Ganesha and the Mango', desc: 'How Ganesha won the ultimate race around the universe.', emoji: '🐘' },
]

function StoriesContent() {
  const searchParams = useSearchParams()
  const deityParam = searchParams.get('deity')
  
  const filteredStories = deityParam 
    ? STORIES_DATA.filter(s => s.deity.toLowerCase() === deityParam.toLowerCase())
    : STORIES_DATA

  const deityName = deityParam ? deityParam.charAt(0).toUpperCase() + deityParam.slice(1) : 'Divine'

  return (
    <div className="min-h-screen bg-violet-50 pb-16">
      <div className="bg-white border-b border-violet-100 px-4 py-4 sticky top-16 z-40">
        <div className="max-w-4xl mx-auto flex items-center">
          <Link href="/kids" className="flex items-center text-violet-600 hover:text-violet-800 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Kids Zone
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">✨ {deityName} Stories</h1>
        <p className="text-gray-500 mb-8">Tap on a story card to start reading!</p>

        {filteredStories.length === 0 ? (
          <p className="text-gray-500 text-center py-10">More stories coming soon!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredStories.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-violet-100 hover:border-violet-300 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="text-4xl mb-3">{story.emoji}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{story.title}</h3>
                <p className="text-gray-600 text-sm">{story.desc}</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-violet-600 text-sm font-bold">Read Story →</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function KidsStoriesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-violet-50 flex items-center justify-center">Loading...</div>}>
      <StoriesContent />
    </Suspense>
  )
}
