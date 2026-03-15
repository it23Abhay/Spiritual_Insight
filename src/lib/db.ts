import { db } from './firebase'
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore'

// ── Firestore Collection names ──────────────────
export const COLLECTIONS = {
  USERS: 'users',
  JAP_SESSIONS: 'jap_sessions',
  CHAT_HISTORY: 'chat_history',
  STORIES: 'stories',
  AUDIO_LIBRARY: 'audio_library',
  VIDEO_LIBRARY: 'video_library',
  BOOKS: 'books',
} as const

// ── User helpers ────────────────────────────────
export async function getUser(userId: string) {
  const ref = doc(db, COLLECTIONS.USERS, userId)
  const snap = await getDoc(ref)
  return snap.exists() ? snap.data() : null
}

export async function upsertUser(userId: string, data: Record<string, unknown>) {
  const ref = doc(db, COLLECTIONS.USERS, userId)
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true })
}

// ── Jap Mala session helpers ────────────────────
export async function saveJapSession(
  userId: string,
  session: {
    mantraName: string
    count: number
    completedMalas: number
  }
) {
  const ref = collection(db, COLLECTIONS.JAP_SESSIONS)
  return addDoc(ref, { userId, ...session, createdAt: serverTimestamp() })
}

export async function getJapSessions(userId: string, limitCount = 20) {
  const ref = collection(db, COLLECTIONS.JAP_SESSIONS)
  const q = query(
    ref,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

// ── Chat History helpers ────────────────────────
export async function saveChatHistory(
  userId: string,
  messages: { role: string; content: string; timestamp: string }[]
) {
  const ref = collection(db, COLLECTIONS.CHAT_HISTORY)
  return addDoc(ref, { userId, messages, createdAt: serverTimestamp() })
}

export async function getChatHistory(userId: string, limitCount = 20) {
  const ref = collection(db, COLLECTIONS.CHAT_HISTORY)
  const q = query(
    ref,
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  )
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export { db, addDoc, updateDoc, serverTimestamp, collection, doc }
