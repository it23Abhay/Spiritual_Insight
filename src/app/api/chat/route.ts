import { NextRequest, NextResponse } from 'next/server'
import { apiRateLimiter } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
    const rateLimitResponse = apiRateLimiter.check(ip)
    
    if (rateLimitResponse) {
      return rateLimitResponse
    }

    const { message } = await req.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json({
        reply: "The AI Guide is not configured yet. Please add your OpenAI API key to .env.local as OPENAI_API_KEY=sk-...",
      })
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a knowledgeable, calm, and respectful AI Spiritual Guide specializing in Hindu spirituality, mythology, and philosophy. 

Your role is to:
- Explain mantras, their meaning and pronunciation
- Share stories from Hindu mythology (Ramayana, Mahabharata, Puranas)
- Guide users in meditation and mindfulness practices
- Explain festivals, rituals, and their spiritual significance
- Share moral teachings and wisdom from Bhagavad Gita, Upanishads, etc.
- Discuss concepts like karma, dharma, moksha in accessible language

Guidelines:
- Be respectful, non-preachy, and age-appropriate for all audiences
- If asked about other religions, respond with respect and inclusivity
- Keep answers concise (2-4 paragraphs max)
- Use 🙏 or relevant emojis naturally but sparingly
- Never promote superstition or pseudoscience
- If asked anything unrelated to spirituality, gently redirect`,
          },
          { role: 'user', content: message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      if (errorData?.error?.message) {
        return NextResponse.json({ reply: `OpenAI API Error: ${errorData.error.message}` })
      }
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content ?? 'I could not generate a response. Please try again.'

    return NextResponse.json({ reply })
  } catch (err) {
    console.error('[/api/chat] Error:', err)
    return NextResponse.json(
      { error: 'Internal server error', reply: 'Something went wrong. Please try again in a moment.' },
      { status: 500 }
    )
  }
}
