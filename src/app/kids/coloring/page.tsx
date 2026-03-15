'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Download } from 'lucide-react'

const COLORING_PAGES = [
  { id: '1', title: 'Baby Ganesha', emoji: '🐘' },
  { id: '2', title: 'Peacock Feather', emoji: '🦚' },
  { id: '3', title: 'Om Symbol Mandala', emoji: '🕉️' },
  { id: '4', title: 'Diya (Lamp)', emoji: '🪔' },
  { id: '5', title: 'Lotus Flower', emoji: '🪷' },
  { id: '6', title: 'Bow and Arrow', emoji: '🏹' },
]

export default function KidsColoringPage() {
  return (
    <div className="min-h-screen bg-green-50 pb-16">
      <div className="bg-white border-b border-green-100 px-4 py-4 sticky top-16 z-40">
        <div className="max-w-4xl mx-auto flex items-center">
          <Link href="/kids" className="flex items-center text-green-600 hover:text-green-800 font-medium">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Kids Zone
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🖍️ Coloring Pages</h1>
        <p className="text-gray-500 mb-8">Download and print these beautiful outlines for coloring!</p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-6">
          {COLORING_PAGES.map((page, i) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl border border-green-200 p-4 shadow-sm hover:shadow-md transition-all flex flex-col font-medium"
            >
              <div className="aspect-square bg-white border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-7xl mb-4 group cursor-pointer relative">
                <span className="grayscale opacity-50 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100">{page.emoji}</span>
                <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                </div>
              </div>
              <h3 className="text-gray-800 text-sm sm:text-base text-center mb-3 flex-1">{page.title}</h3>
              <button className="flex w-full items-center justify-center gap-2 bg-green-100 hover:bg-green-500 hover:text-white text-green-700 py-2 rounded-xl text-sm transition-colors shadow-sm">
                <Download size={16} /> Print PDF
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
