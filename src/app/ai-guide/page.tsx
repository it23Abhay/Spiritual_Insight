'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles } from 'lucide-react'
import ChatMessage from '@/components/ui/ChatMessage'
import { useSession } from 'next-auth/react'
import { saveChatHistory } from '@/lib/db'

interface Message {
  role: 'user' | 'ai'
  content: string
  timestamp: string
}

const suggestedQuestions = [
  "What is the meaning of Om Namah Shivaya?",
  "How do I meditate properly?",
  "Tell me the story of Lord Ganesha",
  "What is karma?",
  "Which mantra is best for peace?",
]

const getTimestamp = () =>
  new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

export default function AIGuidePage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: 'Namaste 🙏 I am your AI Spiritual Guide. Ask me anything about mantras, meditation, mythology, festivals, or moral teachings. How can I help you today?',
      timestamp: getTimestamp(),
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Save session to Firestore when user leaves or session has >= 2 messages
  useEffect(() => {
    const userId = (session?.user as { id?: string })?.id
    if (!userId || messages.length < 2) return

    const saveSession = () => {
      const forStorage = messages.map((m) => ({
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
      }))
      saveChatHistory(userId, forStorage).catch(console.error)
    }

    window.addEventListener('beforeunload', saveSession)
    return () => window.removeEventListener('beforeunload', saveSession)
  }, [session, messages])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const userMsg: Message = { role: 'user', content: text.trim(), timestamp: getTimestamp() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    // GA event
    if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: unknown }).gtag === 'function') {
      (window as unknown as { gtag: (e: string, n: string, p: object) => void }).gtag('event', 'ai_chat_sent', { message_length: text.trim().length })
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      })
      const data = await res.json()
      const aiMsg: Message = {
        role: 'ai',
        content: data.reply ?? `I'm sorry, I could not understand that. Please try again.`,
        timestamp: getTimestamp(),
      }
      setMessages((prev) => [...prev, aiMsg])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', content: '⚠️ Unable to reach the AI Guide right now. Please check your connection.', timestamp: getTimestamp() },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto px-4 py-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-4"
      >
        <div className="inline-flex items-center gap-2 rounded-full gradient-spiritual px-4 py-1.5 text-white text-sm font-medium shadow mb-3">
          <Sparkles size={14} />
          AI Spiritual Guide
        </div>
        <h1 className="text-2xl font-bold text-deep-blue">Ask Your Spiritual Questions</h1>
        <p className="text-sm text-gray-500 mt-1">Mantras · Meditation · Mythology · Festivals · Teachings</p>
      </motion.div>

      {/* Suggested chips */}
      {messages.length <= 1 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-2 justify-center mb-4"
        >
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => sendMessage(q)}
              className="rounded-full border border-saffron/30 bg-saffron/5 px-3 py-1.5 text-xs font-medium text-saffron hover:bg-saffron/15 transition-colors"
            >
              {q}
            </button>
          ))}
        </motion.div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 pb-4">
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChatMessage role={msg.role} content={msg.content} timestamp={msg.timestamp} />
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start gap-2 items-end">
            <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-spiritual text-white text-sm shadow">🕉️</div>
            <div className="glass-card rounded-2xl rounded-bl-sm border border-white/60 px-4 py-3">
              <div className="flex gap-1.5 items-center h-5">
                {[0, 1, 2].map((d) => (
                  <motion.div
                    key={d}
                    className="h-2 w-2 rounded-full bg-saffron"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: d * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input bar */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={(e) => { e.preventDefault(); sendMessage(input) }}
        className="flex gap-3 mt-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about mantras, meditation, mythology…"
          disabled={loading}
          aria-label="Ask a spiritual question"
          className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 shadow-sm focus:border-saffron focus:outline-none focus:ring-2 focus:ring-saffron/20 disabled:opacity-60 transition-all"
        />
        <motion.button
          type="submit"
          disabled={!input.trim() || loading}
          whileTap={{ scale: 0.95 }}
          className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl gradient-spiritual text-white shadow-md disabled:opacity-50 transition-opacity"
          aria-label="Send message"
        >
          <Send size={18} />
        </motion.button>
      </motion.form>
    </div>
  )
}
