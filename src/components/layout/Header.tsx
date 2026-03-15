'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, User, LogIn } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const navItems = [
  { href: '/', tKey: 'Home', emoji: '🏠' },
  { href: '/jap-mala', tKey: 'JapMala', emoji: '📿' },
  { href: '/ai-guide', tKey: 'AIGuide', emoji: '🤖' },
  { href: '/kids', tKey: 'KidsZone', emoji: '🎨' },
  { href: '/audio', tKey: 'AudioLibrary', emoji: '🎵' },
  { href: '/videos', tKey: 'VideoLibrary', emoji: '📹' },
  { href: '/books', tKey: 'Books', emoji: '📚' },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-50 w-full glass-card border-b border-white/30 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl transition-transform duration-300 group-hover:rotate-12">🕉️</span>
          <span className="font-bold text-lg text-gradient-spiritual hidden sm:block">Spiritual Insights</span>
          <span className="font-bold text-lg text-gradient-spiritual sm:hidden">Spiritual</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Desktop Navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-saffron bg-saffron/10'
                    : 'text-gray-600 hover:text-saffron hover:bg-saffron/5'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-saffron/10 rounded-lg"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                  )}
                <span className="relative">{t(item.tKey)}</span>
              </Link>
            )
          })}
        </nav>

        {/* Right icons */}
        <div className="flex items-center gap-2">
          {status === 'loading' ? (
            <div className="hidden sm:block h-8 w-20 bg-gray-100 animate-pulse rounded-lg" />
          ) : session ? (
            <Link
              href="/profile"
              className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-gray-200 hover:border-saffron/50 hover:bg-saffron/5 transition-all duration-200"
            >
              {session.user?.image ? (
                <Image src={session.user.image} alt="User profile icon" width={24} height={24} className="rounded-full" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-saffron/20 flex items-center justify-center text-saffron text-xs"><User size={14}/></div>
              )}
              <span className="text-sm font-medium text-gray-700 hidden md:block">
                {session.user?.name?.split(' ')[0] || t('Profile')}
              </span>
            </Link>
          ) : (
            <Link
              href="/auth/signin"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full bg-saffron text-white text-sm font-medium hover:bg-orange-500 shadow-md transition-all duration-200"
            >
              <LogIn size={16} />
              <span className="hidden md:block">{t('SignIn')}</span>
            </Link>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-saffron/10 hover:text-saffron transition-all duration-200"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X size={22} />
                </motion.span>
              ) : (
                <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu size={22} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden border-t border-white/30 bg-white/90 backdrop-blur-md"
          >
            <nav id="mobile-nav" className="flex flex-col gap-1 p-4" aria-label="Mobile Navigation">
              {navItems.map((item, i) => {
                const isActive = pathname === item.href
                return (
                  <motion.div
                    key={item.href}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-saffron/10 text-saffron'
                          : 'text-gray-700 hover:bg-saffron/5 hover:text-saffron'
                      }`}
                    >
                      <span className="text-xl">{item.emoji}</span>
                      {t(item.tKey)}
                    </Link>
                  </motion.div>
                )
              })}
              <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: navItems.length * 0.05 }}>
                {session ? (
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-saffron/5 hover:text-saffron transition-all duration-200"
                  >
                    {session.user?.image ? (
                      <Image src={session.user.image} alt="User profile icon" width={24} height={24} className="rounded-full" />
                    ) : (
                      <User size={20} className="text-gray-500" />
                    )}
                    {t('Profile')}
                  </Link>
                ) : (
                  <Link
                    href="/auth/signin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 mt-2 px-4 py-3 rounded-xl text-sm font-medium bg-saffron text-white hover:bg-orange-500 shadow-sm transition-all duration-200"
                  >
                    <LogIn size={20} />
                    {t('SignIn')}
                  </Link>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
