import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, query, where, orderBy, limit, getDocs, serverTimestamp } from 'firebase/firestore'
import { apiRateLimiter } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
    const rateLimitResponse = apiRateLimiter.check(ip)
    
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const body = await req.json()
    const { userId, mantraName, count, completedMalas } = body

    if (!userId || !mantraName || count === undefined) {
      return NextResponse.json({ error: 'userId, mantraName, and count are required' }, { status: 400 })
    }

    const ref = collection(db, 'jap_sessions')
    const docRef = await addDoc(ref, {
      userId,
      mantraName,
      count,
      completedMalas: completedMalas ?? 0,
      createdAt: serverTimestamp(),
    })

    return NextResponse.json({ id: docRef.id, success: true })
  } catch (err) {
    console.error('[/api/jap-mala/session POST] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ error: 'userId query parameter is required' }, { status: 400 })
    }

    const ref = collection(db, 'jap_sessions')
    const q = query(ref, where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(20))
    const snap = await getDocs(q)
    const sessions = snap.docs.map((d) => ({ id: d.id, ...d.data() }))

    return NextResponse.json({ sessions })
  } catch (err) {
    console.error('[/api/jap-mala/session GET] Error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
