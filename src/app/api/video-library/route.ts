import { NextRequest, NextResponse } from 'next/server'
import { apiRateLimiter } from '@/lib/rateLimit'
import { db } from '@/lib/db'
import { collection, getDocs } from 'firebase/firestore'

const VIDEO_DATA = [
  { id: '1', title: 'The Story of Lord Shiva', category: 'Spiritual Shorts', videoUrl: '', thumbnailUrl: '🕉️', duration: 510 },
  { id: '2', title: 'Krishna and Sudama', category: 'Kids Stories', videoUrl: '', thumbnailUrl: '🦚', duration: 720 },
  { id: '3', title: 'Diwali Celebration Guide', category: 'Festival Specials', videoUrl: '', thumbnailUrl: '🪔', duration: 900 },
  { id: '4', title: 'Varanasi Temple Tour', category: 'Temple Docs', videoUrl: '', thumbnailUrl: '⛪', duration: 1320 },
  { id: '5', title: "Hanuman's Devotion", category: 'Spiritual Shorts', videoUrl: '', thumbnailUrl: '🐒', duration: 405 },
  { id: '6', title: "Ganesha's Wisdom Tales", category: 'Kids Stories', videoUrl: '', thumbnailUrl: '🐘', duration: 560 },
  { id: '7', title: 'Holi — Festival of Colors', category: 'Festival Specials', videoUrl: '', thumbnailUrl: '🎨', duration: 1080 },
  { id: '8', title: 'Tirupati Balaji Documentary', category: 'Temple Docs', videoUrl: '', thumbnailUrl: '🏛️', duration: 2100 },
]

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
  const rateLimitResponse = apiRateLimiter.check(ip)
  
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const querySnapshot = await getDocs(collection(db, 'video_library'))
    if (!querySnapshot.empty) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const videos = querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
      return NextResponse.json({ videos })
    }
  } catch (error) {
    console.error('Error fetching video_library:', error)
  }

  return NextResponse.json({ videos: VIDEO_DATA })
}
