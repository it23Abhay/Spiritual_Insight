import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/notifications/send
 * Body: { token: string, title: string, body: string }
 *
 * Uses the Firebase Admin REST API (FCM v1) to send a push notification
 * to a specific device token. Requires FIREBASE_SERVER_KEY env var.
 *
 * For Vercel Cron, hit this endpoint with a scheduled job.
 * Example: Daily mantra reminder at 6 AM IST.
 */
export async function POST(req: NextRequest) {
  const serverKey = process.env.FIREBASE_SERVER_KEY
  if (!serverKey) {
    return NextResponse.json({ error: 'FIREBASE_SERVER_KEY not set' }, { status: 500 })
  }

  const { token, title, body } = await req.json() as {
    token?: string
    title?: string
    body?: string
  }

  if (!token || !title || !body) {
    return NextResponse.json({ error: 'Missing token, title or body' }, { status: 400 })
  }

  const payload = {
    message: {
      token,
      notification: { title, body },
      webpush: {
        notification: {
          icon: '/icons/icon-192x192.png',
          badge: '/icons/badge-72x72.png',
          requireInteraction: false,
        },
        fcm_options: { link: 'https://spiritual-insights.vercel.app/' },
      },
    },
  }

  try {
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
    const res = await fetch(
      `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${serverKey}`,
        },
        body: JSON.stringify(payload),
      }
    )
    const data = await res.json()
    if (!res.ok) return NextResponse.json({ error: data }, { status: res.status })
    return NextResponse.json({ success: true, messageId: data.name })
  } catch (err) {
    console.error('[FCM send]', err)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}
