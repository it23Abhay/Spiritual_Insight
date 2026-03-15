'use client'

import { motion } from 'framer-motion'
import FeatureCard from '@/components/ui/FeatureCard'
import { useTranslation } from 'react-i18next'

const dailyQuote = {
  text: "The soul is never born nor dies at any time. It has not come into being, does not come into being, and will not come into being. It is unborn, eternal, ever-existing, and primeval.",
  source: "Bhagavad Gita 2.20",
}

const todayMantra = "ॐ नमः शिवाय"
const mantraTranslation = "Om Namah Shivaya — I bow to Shiva, the infinite consciousness"

const features = [
  {
    emoji: "📿",
    title: "Digital Jap Mala",
    description: "Count your mantra recitations with a beautiful 108-bead digital mala.",
    href: "/jap-mala",
    color: "saffron",
  },
  {
    emoji: "🤖",
    title: "AI Spiritual Guide",
    description: "Ask questions about mantras, myths, meditation, and moral teachings.",
    href: "/ai-guide",
    color: "blue",
  },
  {
    emoji: "🎨",
    title: "Kids Zone",
    description: "Safe, ad-free stories, audio tales, and coloring pages for children.",
    href: "/kids",
    color: "rose",
  },
  {
    emoji: "🎵",
    title: "Audio Library",
    description: "Bhajans, mantras, aarti, and guided meditation — all in one place.",
    href: "/audio",
    color: "gold",
  },
  {
    emoji: "📹",
    title: "Video Library",
    description: "Spiritual shorts, festival specials, and temple documentaries.",
    href: "/videos",
    color: "emerald",
  },
  {
    emoji: "📚",
    title: "Books & PDFs",
    description: "Spiritual books, kids' stories, and coloring books to download.",
    href: "/books",
    color: "violet",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

export default function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden gradient-spiritual py-20 px-4 text-white mandala-bg shadow-inner">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-4 text-6xl drop-shadow-md"
          >
            🕉️
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-4 text-4xl font-bold sm:text-5xl drop-shadow-lg"
          >
            Spiritual Insights
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="text-lg text-white/90 drop-shadow-sm font-medium"
          >
            Your daily spiritual companion — mantras, stories, meditation, and more.
          </motion.p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* Daily Spiritual Quote */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
            <span>✨</span> {t('DailyQuote')}
          </h2>
          <div className="glass-card rounded-2xl border border-gold/30 p-6 shadow-sm relative overflow-hidden text-left.">
            <div className="absolute top-0 left-0 w-1 h-full gradient-gold rounded-l-2xl" />
            <p className="text-gray-700 leading-relaxed text-base italic pl-4">
              "{dailyQuote.text}"
            </p>
            <p className="mt-3 pl-4 text-sm font-semibold text-saffron">— {dailyQuote.source}</p>
          </div>
        </motion.section>

        {/* Today's Mantra */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4 flex items-center gap-2">
            <span>🙏</span> {t('TodaysMantra')}
          </h2>
          <div className="gradient-spiritual rounded-2xl p-8 text-white text-center shadow-lg">
            <p className="text-4xl font-bold mb-3 tracking-wide" style={{ fontFamily: 'Noto Sans Devanagari, Noto Sans, sans-serif' }}>
              {todayMantra}
            </p>
            <p className="text-white/90 text-sm mb-6 font-medium">{mantraTranslation}</p>
            <motion.a
              href="/jap-mala"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 rounded-full bg-white text-deep-blue font-semibold px-8 py-3 shadow-md hover:shadow-lg transition-all duration-200"
              aria-label="Start Jap Mala session"
            >
              <span aria-hidden="true">📿</span> {t('StartJapMala')}
            </motion.a>
          </div>
        </motion.section>

        {/* Feature Cards */}
        <section>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-6 flex items-center gap-2">
            <span>🌟</span> {t('Explore')}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, idx) => (
              <motion.div 
                key={feature.href} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
