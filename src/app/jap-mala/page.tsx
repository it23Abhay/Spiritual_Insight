'use client'

import { useCallback, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useMalaStore } from '@/store/malaStore'
import { RotateCcw, Play, Pause } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const BEAD_COUNT = 108
const RADIUS = 140
const CENTER = 170

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

export default function JapMalaPage() {
  const { count, completedMalas, isRunning, increment, reset, pause, resume } = useMalaStore()
  const { t } = useTranslation()

  const toggleRunning = () => (isRunning ? pause() : resume())

  const handleBeadClick = useCallback(() => {
    if (isRunning) increment()
  }, [isRunning, increment])

  const prevCompletedRef = useRef(completedMalas)
  useEffect(() => {
    if (completedMalas > prevCompletedRef.current) {
      if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: unknown }).gtag === 'function') {
        (window as unknown as { gtag: (e: string, n: string, p: object) => void }).gtag('event', 'jap_mala_complete', {
          total_malas: completedMalas
        })
      }
    }
    prevCompletedRef.current = completedMalas
  }, [completedMalas])

  const beads = Array.from({ length: BEAD_COUNT }, (_, i) => {
    const angle = (360 / BEAD_COUNT) * i
    const pos = polarToCartesian(CENTER, CENTER, RADIUS, angle)
    const isFilled = i < count % BEAD_COUNT || (count > 0 && count % BEAD_COUNT === 0)
    const isActive = i === (count % BEAD_COUNT === 0 && count > 0 ? BEAD_COUNT - 1 : (count % BEAD_COUNT) - 1)
    return { i, pos, isFilled, isActive }
  })

  const progress = ((count % BEAD_COUNT) / BEAD_COUNT) * 100
  const currentBead = count % BEAD_COUNT === 0 && count > 0 ? BEAD_COUNT : count % BEAD_COUNT

  return (
    <div className="min-h-screen gradient-calm px-4 py-10">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-deep-blue dark:text-blue-300 mb-1">📿 {t('DigitalJapMala')}</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{t('TapTheMala')}</p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          {[
            { label: t('CurrentBead'), value: `${currentBead} / ${BEAD_COUNT}` },
            { label: t('CompletedMalas'), value: completedMalas },
            { label: t('TotalCount'), value: count },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl p-4 text-center border border-white/60 dark:border-white/10">
              <p className="text-2xl font-bold text-deep-blue dark:text-blue-300">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* SVG Mala */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
          className="flex justify-center mb-8"
        >
          <svg
            width={CENTER * 2}
            height={CENTER * 2}
            viewBox={`0 0 ${CENTER * 2} ${CENTER * 2}`}
            className="w-full max-w-sm cursor-pointer select-none drop-shadow-lg"
            onClick={handleBeadClick}
            role="button"
            aria-label="Tap to count"
          >
            {/* Track circle */}
            <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="#E5E7EB" strokeWidth={2} strokeDasharray="4 4" />

            {/* Beads */}
            {beads.map(({ i, pos, isFilled, isActive }) => (
              <motion.circle
                key={i}
                cx={pos.x}
                cy={pos.y}
                r={isActive ? 7 : 5}
                fill={isActive ? '#FF9933' : isFilled ? '#F5C542' : '#F3F4F6'}
                stroke={isActive ? '#CC7A29' : isFilled ? '#CC9E35' : '#D1D5DB'}
                strokeWidth={isActive ? 2 : 1}
                animate={isActive ? { scale: [1, 1.4, 1], opacity: [1, 0.7, 1] } : {}}
                transition={{ duration: 0.4 }}
              />
            ))}

            {/* Center sumeru bead */}
            <circle cx={CENTER} cy={CENTER} r={30} fill="white" stroke="#FF9933" strokeWidth={2} className="drop-shadow" />
            <text x={CENTER} y={CENTER - 4} textAnchor="middle" fontSize={16} fill="#1E3A8A" fontWeight="bold">
              🕉️
            </text>
            <text x={CENTER} y={CENTER + 16} textAnchor="middle" fontSize={11} fill="#FF9933" fontWeight="600">
              {count}
            </text>
          </svg>
        </motion.div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress through mala</span>
            <span>{progress.toFixed(0)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              className="h-full gradient-gold rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className="flex items-center gap-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 px-6 py-3 text-sm font-medium text-gray-600 dark:text-gray-300 shadow-sm hover:bg-gray-50 transition-all"
            aria-label="Reset mala"
          >
            <RotateCcw size={16} />
            {t('Reset')}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleRunning}
            className={`flex items-center gap-2 rounded-full px-8 py-3 text-sm font-semibold text-white shadow-md transition-all ${
              isRunning ? 'bg-deep-blue hover:bg-deep-blue-800' : 'gradient-spiritual'
            }`}
            aria-label={isRunning ? 'Pause mala' : 'Start mala'}
          >
            {isRunning ? <><Pause size={16} /> {t('Pause')}</> : <><Play size={16} /> {t('Start')}</>}
          </motion.button>
        </div>

        {/* Tip */}
        <p className="text-center text-xs text-gray-400 mt-6">
          {isRunning ? '✅ Tap the mala ring or anywhere on the SVG to count' : '▶️ Press Start then tap the mala to begin counting'}
        </p>
      </div>
    </div>
  )
}
