'use client'

import { motion } from 'framer-motion'
import { Play, Pause, Heart } from 'lucide-react'

interface AudioCardProps {
  id: string
  title: string
  artist: string
  category: string
  duration?: string
  coverEmoji?: string
  isPlaying?: boolean
  isFavourite?: boolean
  onPlay?: (id: string) => void
  onFavourite?: (id: string) => void
}

export default function AudioCard({
  id, title, artist, category, duration,
  coverEmoji = '🎵', isPlaying = false, isFavourite = false,
  onPlay, onFavourite,
}: AudioCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="glass-card flex items-center gap-4 rounded-xl p-4 shadow-sm transition-all duration-200 hover:shadow-md"
    >
      {/* Cover art */}
      <div className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl text-2xl ${isPlaying ? 'gradient-gold animate-pulse' : 'bg-saffron/10'}`}>
        {coverEmoji}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate text-sm">{title}</p>
        <p className="text-xs text-gray-500 truncate">{artist}</p>
        <span className="mt-0.5 inline-block rounded-full bg-saffron/10 px-2 py-0.5 text-xs text-saffron font-medium">{category}</span>
      </div>

      {/* Duration */}
      {duration && <span className="text-xs text-gray-400 hidden sm:block">{duration}</span>}

      {/* Favourite */}
      {onFavourite && (
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onFavourite(id)}
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-colors"
          aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
        >
          <Heart
            size={16}
            className={isFavourite ? 'fill-rose-500 text-rose-500' : 'text-gray-300 hover:text-rose-400'}
          />
        </motion.button>
      )}

      {/* Play button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => onPlay?.(id)}
        className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full shadow transition-all duration-200 ${
          isPlaying
            ? 'gradient-spiritual text-white'
            : 'bg-saffron/10 text-saffron hover:bg-saffron hover:text-white'
        }`}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
      </motion.button>
    </motion.div>
  )
}
