'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { useToastStore, ToastItem } from '@/store/toastStore'

const iconMap: Record<NonNullable<ToastItem['type']>, React.ReactNode> = {
  success: <CheckCircle size={16} className="text-green-500 flex-shrink-0" />,
  error: <AlertCircle size={16} className="text-red-500 flex-shrink-0" />,
  info: <Info size={16} className="text-blue-500 flex-shrink-0" />,
}

function SingleToast({ toast }: { toast: ToastItem }) {
  const { removeToast } = useToastStore()

  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), toast.duration ?? 3500)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, removeToast])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 24, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      className="flex items-start gap-3 rounded-2xl border border-white/60 bg-white/90 backdrop-blur-md px-4 py-3 shadow-lg min-w-[260px] max-w-xs"
    >
      {iconMap[toast.type ?? 'info']}
      <p className="flex-1 text-sm text-gray-800 font-medium leading-snug">{toast.message}</p>
      <button
        onClick={() => removeToast(toast.id)}
        className="text-gray-400 hover:text-gray-700 transition-colors mt-0.5"
        aria-label="Dismiss notification"
      >
        <X size={14} />
      </button>
    </motion.div>
  )
}

export default function ToastContainer() {
  const { toasts } = useToastStore()

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t: ToastItem) => (
          <div key={t.id} className="pointer-events-auto">
            <SingleToast toast={t} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}
