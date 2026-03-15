'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

interface FeatureCardProps {
  emoji: string
  title: string
  description: string
  href: string
  color?: string
}

export default function FeatureCard({ emoji, title, description, href, color = 'saffron' }: FeatureCardProps) {
  const colorMap: Record<string, { bg: string; border: string; hover: string }> = {
    saffron:  { bg: 'bg-saffron/5',   border: 'border-saffron/20',   hover: 'hover:border-saffron/50 hover:bg-saffron/10' },
    blue:     { bg: 'bg-deep-blue/5', border: 'border-deep-blue/20', hover: 'hover:border-deep-blue/50 hover:bg-deep-blue/10' },
    gold:     { bg: 'bg-gold/5',      border: 'border-gold/20',      hover: 'hover:border-gold/50 hover:bg-gold/10' },
    rose:     { bg: 'bg-rose-50',     border: 'border-rose-200',     hover: 'hover:border-rose-400 hover:bg-rose-100/60' },
    emerald:  { bg: 'bg-emerald-50',  border: 'border-emerald-200',  hover: 'hover:border-emerald-400 hover:bg-emerald-100/60' },
    violet:   { bg: 'bg-violet-50',   border: 'border-violet-200',   hover: 'hover:border-violet-400 hover:bg-violet-100/60' },
  }

  const c = colorMap[color] ?? colorMap['saffron']

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link
        href={href}
        className={`group flex flex-col gap-3 rounded-2xl border p-6 shadow-sm transition-all duration-300 ${c.bg} ${c.border} ${c.hover}`}
        aria-label={`${title}: ${description}`}
      >
        <span className="text-4xl transition-transform duration-300 group-hover:scale-110" aria-hidden="true">{emoji}</span>
        <div>
          <h3 className="font-semibold text-gray-800 text-base mb-1">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>
        <span className="mt-auto text-xs font-medium text-gray-400 group-hover:text-saffron transition-colors duration-200">
          Explore →
        </span>
      </Link>
    </motion.div>
  )
}
