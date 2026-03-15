'use client'

import { useEffect } from 'react'
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'
import { app } from '@/lib/firebase'

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        const supported = await isSupported()
        if (!supported) {
          console.log('Firebase Cloud Messaging is not supported in this browser.')
          return
        }

        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          const messaging = getMessaging(app)
          
          // Note: In a real production app, you need a VAPID key in environment variables
          // e.g., const currentToken = await getToken(messaging, { vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY })
          try {
            const currentToken = await getToken(messaging)
            if (currentToken) {
              console.log('FCM Token generated successfully')
              // Here you would typically send the token to your server / Firestore user doc
            }
          } catch (err) {
            console.warn('FCM GetToken missing config or VAPID key. Push disabled for dev.', err)
          }

          // Handle foreground messages
          onMessage(messaging, (payload) => {
            console.log('FCM Message received in foreground:', payload)
            // Here you could trigger a Toast notification using a UI library
            if (payload.notification) {
              new Notification(payload.notification.title || 'Note', {
                body: payload.notification.body,
                icon: payload.notification.image || '/favicon.ico'
              })
            }
          })
        }
      } catch (error) {
        console.error('Failed to set up FCM:', error)
      }
    }

    // Only run in browser
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      setupNotifications()
    }
  }, [])

  return <>{children}</>
}
