'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSession, signOut } from 'next-auth/react'
import { LogOut, Settings, Heart, Clock, Music } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useTranslation } from 'react-i18next'
import '@/lib/i18n' // import the client-side i18n instance
import { useAudioStore } from '@/store/audioStore'
import { getJapSessions } from '@/lib/db'

interface Session {
  id: string
  mantraName: string
  count: number
  completedMalas: number
  createdAt: { seconds?: number } | string
}

const formatDate = (val: { seconds?: number } | string) => {
  const date = typeof val === 'object' && val?.seconds
    ? new Date(val.seconds * 1000)
    : new Date(val as string)
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export default function ProfilePage() {
  const { data: session } = useSession()
  const { favourites } = useAudioStore()
  const { theme, setTheme } = useTheme()
  const { t, i18n } = useTranslation()

  const userId = (session?.user as { id?: string })?.id ?? ''
  const [sessions, setSessions] = useState<Session[]>([])
  const [loadingSessions, setLoadingSessions] = useState(true)

  useEffect(() => {
    if (!userId) { setLoadingSessions(false); return }
    getJapSessions(userId)
      .then((data) => setSessions(data as Session[]))
      .catch(console.error)
      .finally(() => setLoadingSessions(false))
  }, [userId])

  const totalMalas = sessions.reduce((acc, s) => acc + s.completedMalas, 0)
  const totalBeads = sessions.reduce((acc, s) => acc + s.count, 0)

  return (
    <div className="min-h-screen gradient-calm pb-12">
      {/* Hero */}
      <div className="gradient-spiritual px-4 pt-12 pb-20 text-center text-white">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-white/20 text-5xl mb-4 shadow-lg"
        >
          {session?.user?.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={session.user.image} alt="Profile" className="h-full w-full rounded-full object-cover" />
          ) : (
            '🙏'
          )}
        </motion.div>
        <motion.h1 initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-2xl font-bold mb-0.5">
          {session?.user?.name ?? 'Devotee'}
        </motion.h1>
        <motion.p initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 }} className="text-white/70 text-sm">
          {session?.user?.email ?? 'My Spiritual Journey'}
        </motion.p>
      </div>

      <div className="mx-auto max-w-2xl px-4 -mt-10 space-y-5">
        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-3 gap-4">
          {[
            { label: t('TotalMalas'), value: totalMalas, emoji: '📿' },
            { label: t('TotalBeads'), value: totalBeads, emoji: '🔢' },
            { label: t('Sessions'), value: sessions.length, emoji: '📅' },
          ].map((s) => (
            <div key={s.label} className="glass-card rounded-2xl p-4 text-center border border-white/60 dark:border-white/10 shadow hover:shadow-md transition-shadow">
              <p className="text-xl mb-1">{s.emoji}</p>
              <p className="text-2xl font-bold text-deep-blue dark:text-blue-300">{s.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Jap Mala History */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl border border-white/60 dark:border-white/10 p-5 shadow">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Clock size={16} className="text-saffron" /> {t('JapMalaHistory')}
          </h2>
          {loadingSessions ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="h-14 rounded-xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-4">No sessions yet. Start your first Jap Mala!</p>
          ) : (
            <div className="space-y-3">
              {sessions.map((s) => (
                <div key={s.id} className="flex items-center justify-between rounded-xl bg-saffron/5 px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{s.mantraName}</p>
                    <p className="text-xs text-gray-400">{formatDate(s.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-saffron">{s.count} beads</p>
                    <p className="text-xs text-gray-500">{s.completedMalas} mala{s.completedMalas !== 1 ? 's' : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Favourite Audio */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card rounded-2xl border border-white/60 dark:border-white/10 p-5 shadow">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
            <Heart size={16} className="text-rose-400" /> {t('FavouriteAudio')}
          </h2>
          {favourites.length === 0 ? (
            <p className="text-sm text-gray-400">Save tracks from the Audio Library to see them here.</p>
          ) : (
            <div className="space-y-2">
              {favourites.map((t) => (
                <div key={t.id} className="flex items-center gap-3 rounded-xl bg-rose-50 px-4 py-2.5">
                  <span className="text-xl">{t.albumImage ?? '🎵'}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{t.title}</p>
                    <p className="text-xs text-gray-500 truncate">{t.artist}</p>
                  </div>
                  <Music size={14} className="text-rose-400 flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </motion.section>

        {/* Preferences */}
        <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl border border-white/60 dark:border-white/10 p-5 shadow">
          <h2 className="font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
            <Settings size={16} className="text-gray-500" /> {t('Preferences')}
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800">
              <label htmlFor="lang-select" className="text-sm text-gray-600 dark:text-gray-300">{t('Language')}</label>
              <select 
                id="lang-select" 
                value={i18n.language}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 py-1 text-sm text-gray-700 dark:text-gray-200 focus:border-saffron focus:outline-none focus:ring-1 focus:ring-saffron/20" 
                aria-label="Select language"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
              </select>
            </div>
            <div className="flex items-center justify-between py-2">
              <label htmlFor="theme-select" className="text-sm text-gray-600 dark:text-gray-300">{t('Theme')}</label>
              <select 
                id="theme-select" 
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 px-3 py-1 text-sm text-gray-700 dark:text-gray-200 focus:border-saffron focus:outline-none focus:ring-1 focus:ring-saffron/20" 
                aria-label="Select theme"
              >
                <option value="light">{t('Light')}</option>
                <option value="dark">{t('Dark')}</option>
                <option value="system">{t('System')}</option>
              </select>
            </div>
          </div>
        </motion.section>

        {/* Logout */}
        <motion.button
          onClick={() => signOut({ callbackUrl: '/' })}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          whileTap={{ scale: 0.97 }}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 py-3 text-sm font-medium text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all shadow"
          aria-label="Sign out"
        >
          <LogOut size={16} />
          {t('SignOut')}
        </motion.button>
      </div>
    </div>
  )
}
