import { create } from 'zustand'

export interface ToastItem {
  id: string
  message: string
  type?: 'success' | 'error' | 'info'
  duration?: number
}

interface ToastState {
  toasts: ToastItem[]
  addToast: (message: string, type?: ToastItem['type'], duration?: number) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (message, type = 'info', duration = 3500) =>
    set((s) => ({
      toasts: [
        ...s.toasts,
        { id: `${Date.now()}-${Math.random()}`, message, type, duration },
      ],
    })),
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))

// Convenience hook
export const useToast = () => {
  const { addToast } = useToastStore()
  return {
    success: (msg: string) => addToast(msg, 'success'),
    error: (msg: string) => addToast(msg, 'error'),
    info: (msg: string) => addToast(msg, 'info'),
  }
}
