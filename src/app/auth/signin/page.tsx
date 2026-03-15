'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { LogIn, Mail } from 'lucide-react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const res = await signIn('email', { email, redirect: false })
      if (res?.error) {
        setMessage('Error sending email. Please try again.')
      } else {
        setMessage('Check your email for the magic login link!')
      }
    } catch (err) {
      setMessage('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/profile' })
  }

  return (
    <div className="min-h-screen gradient-calm flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card border border-white/60 p-8 rounded-3xl shadow-xl flex flex-col items-center text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 gradient-spiritual" />

        <div className="h-16 w-16 bg-saffron/10 rounded-2xl flex items-center justify-center text-3xl mb-4 text-saffron">
          <LogIn size={32} />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome Back</h1>
        <p className="text-gray-500 text-sm mb-8">Sign in to track your mala sessions and save your favourite audio.</p>

        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-medium shadow-sm hover:shadow-md hover:bg-gray-50 transition-all mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            <path fill="none" d="M1 1h22v22H1z" />
          </svg>
          Continue with Google
        </button>

        <div className="flex items-center w-full mb-6">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-3 text-xs text-gray-400 uppercase tracking-widest">Or</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        <form onSubmit={handleEmailSignIn} className="w-full space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-saffron/20 focus:border-saffron text-sm text-gray-700 bg-white/50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-saffron hover:bg-orange-500 text-white py-2.5 rounded-xl font-medium shadow-md transition-all disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>

        <AnimatePresence>
          {message && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="text-sm mt-4 text-deep-blue font-medium"
            >
              {message}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
