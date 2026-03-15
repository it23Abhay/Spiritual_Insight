export class RateLimiter {
  private windowSize: number
  private maxRequests: number
  private store: Map<string, { count: number; resetTime: number }>

  constructor(windowSizeMs = 60000, maxRequestsPerWindow = 10) {
    this.windowSize = windowSizeMs
    this.maxRequests = maxRequestsPerWindow
    this.store = new Map()
  }

  /**
   * Checks if an IP has exceeded the rate limit.
   * @param ip The client IP address
   * @returns undefined if allowed, or a Response object with 429 Too Many Requests if limited
   */
  public check(ip: string): Response | undefined {
    const now = Date.now()
    const record = this.store.get(ip)

    if (!record) {
      this.store.set(ip, { count: 1, resetTime: now + this.windowSize })
      return undefined
    }

    if (now > record.resetTime) {
      // Time window passed, reset counter
      this.store.set(ip, { count: 1, resetTime: now + this.windowSize })
      return undefined
    }

    if (record.count >= this.maxRequests) {
      // Limit exceeded
      return new Response(JSON.stringify({ error: 'Too Many Requests', retryAfter: Math.ceil((record.resetTime - now) / 1000) }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((record.resetTime - now) / 1000).toString(),
        },
      })
    }

    // Increment count
    record.count += 1
    return undefined
  }
}

// Export a singleton instance for 10 requests per minute
export const apiRateLimiter = new RateLimiter(60000, 10)
