import { initializeApp } from 'firebase/app'
import { getMessaging, onBackgroundMessage } from 'firebase/messaging/sw'

const FIRBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY
const FIRBASE_AUTH_DOMAIN = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
const FIRBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
const FIRBASE_STORAGE_BUCKET = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
const FIRBASE_MESSAGING_SENDER_ID = process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
const FIRBASE_APP_ID = process.env.NEXT_PUBLIC_FIREBASE_APP_ID
const FIRBASE_MEASUREMENT_ID = process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

const firebaseConfig = {
  // Using placeholders or defaulting to process.env if available
  // The service worker needs raw string values in a built app, so we'll 
  // try to fetch them from URL params or a cached config in production,
  // but for local dev this allows the SW to register at least.
  apiKey: FIRBASE_API_KEY,
  authDomain: FIRBASE_AUTH_DOMAIN,
  projectId: FIRBASE_PROJECT_ID,
  storageBucket: FIRBASE_STORAGE_BUCKET,
  messagingSenderId: FIRBASE_MESSAGING_SENDER_ID,
  appId: FIRBASE_APP_ID,
  measurementId: FIRBASE_MEASUREMENT_ID
}

// Ensure the sw actually starts up securely.  In a real app, you must inject your config.
try {
  const app = initializeApp(firebaseConfig)
  const messaging = getMessaging(app)

  onBackgroundMessage(messaging, (payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload)
    
    // Customize notification here
    const notificationTitle = payload.notification?.title || 'Spiritual Insights'
    const notificationOptions = {
      body: payload.notification?.body,
      icon: '/favicon.ico',
      badge: '/favicon.ico'
    }

    if (self && 'registration' in self && self.registration?.showNotification) {
      self.registration.showNotification(notificationTitle, notificationOptions)
    }
  })
} catch(e) {
  console.log('Firebase SW config not fully populated in dev', e)
}
