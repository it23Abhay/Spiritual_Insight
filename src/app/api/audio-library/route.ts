import { NextRequest, NextResponse } from 'next/server'
import { apiRateLimiter } from '@/lib/rateLimit'
import { db } from '@/lib/db'
import { collection, getDocs } from 'firebase/firestore'

const AUDIO_DATA = [
  { id: '1', title: 'Om Namah Shivaya', artist: 'Pandit Ravi Shankar', category: 'Mantras', fileUrl: '', duration: 504, albumImage: '🕉️' },
  { id: '2', title: 'Jai Ganesh Jai Ganesh', artist: 'Anuradha Paudwal', category: 'Bhajans', fileUrl: '', duration: 312, albumImage: '🐘' },
  { id: '3', title: 'Hanuman Chalisa', artist: 'Hariharan', category: 'Bhajans', fileUrl: '', duration: 663, albumImage: '🐒' },
  { id: '4', title: 'Sukhkarta Dukhharta', artist: 'Lata Mangeshkar', category: 'Aarti', fileUrl: '', duration: 275, albumImage: '🪔' },
  { id: '5', title: 'Morning Meditation', artist: 'Sri M', category: 'Meditation', fileUrl: '', duration: 1200, albumImage: '🧘' },
  { id: '6', title: 'Gayatri Mantra', artist: 'Vikram Hazra', category: 'Mantras', fileUrl: '', duration: 407, albumImage: '☀️' },
  { id: '7', title: 'Raghupati Raghav Raja Ram', artist: 'Classical Ensemble', category: 'Bhajans', fileUrl: '', duration: 435, albumImage: '🏹' },
  { id: '8', title: 'Shri Krishna Aarti', artist: 'Deva Premal', category: 'Aarti', fileUrl: '', duration: 300, albumImage: '🦚' },
  { id: '9', title: 'Deep Sleep Meditation', artist: 'Ananda More', category: 'Meditation', fileUrl: '', duration: 1800, albumImage: '🌙' },
  { id: '10', title: 'Mahamrityunjaya Mantra', artist: 'Shankar Sahney', category: 'Mantras', fileUrl: '', duration: 558, albumImage: '🌺' },
]

export async function GET(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
  const rateLimitResponse = apiRateLimiter.check(ip)
  
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const querySnapshot = await getDocs(collection(db, 'audio_library'))
    if (!querySnapshot.empty) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tracks = querySnapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }))
      return NextResponse.json({ tracks })
    }
  } catch (error) {
    console.error('Error fetching audio_library:', error)
  }

  return NextResponse.json({ tracks: AUDIO_DATA })
}
