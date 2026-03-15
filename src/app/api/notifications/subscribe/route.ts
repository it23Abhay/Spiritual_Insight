import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

/**
 * POST /api/notifications/subscribe
 * Body: { token: string }
 * Saves the user's FCM device token to their Firestore user document
 * so the server can send targeted push notifications.
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { token } = await req.json() as { token?: string }
  if (!token || typeof token !== 'string') {
    return NextResponse.json({ error: 'Missing FCM token' }, { status: 400 })
  }

  const userId = (session.user as { id?: string })?.id
  if (!userId) {
    return NextResponse.json({ error: 'User ID missing from session' }, { status: 400 })
  }

  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, { fcmToken: token, fcmUpdatedAt: new Date().toISOString() })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[FCM subscribe]', err)
    return NextResponse.json({ error: 'Failed to save token' }, { status: 500 })
  }
}
