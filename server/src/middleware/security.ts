import type { MiddlewareHandler } from 'hono'

// In-memory rate limit store — replace with Redis for multi-instance production
const store = new Map<string, { count: number; reset: number }>()

// Periodically clean up expired entries
setInterval(() => {
  const now = Date.now()
  for (const [key, val] of store) {
    if (now > val.reset) store.delete(key)
  }
}, 60_000)

function getIp(c: Parameters<MiddlewareHandler>[0]): string {
  return (
    c.req.header('x-forwarded-for')?.split(',')[0].trim() ??
    c.req.header('x-real-ip') ??
    'unknown'
  )
}

/** Rate limit middleware — max requests per windowMs per IP */
export function rateLimit(max: number, windowMs: number): MiddlewareHandler {
  return async (c, next) => {
    const key = `${getIp(c)}:${c.req.path}`
    const now = Date.now()
    const record = store.get(key)

    if (!record || now > record.reset) {
      store.set(key, { count: 1, reset: now + windowMs })
    } else {
      record.count++
      if (record.count > max) {
        c.header('Retry-After', String(Math.ceil((record.reset - now) / 1000)))
        return c.json({ error: 'Too Many Requests' }, 429)
      }
    }

    await next()
  }
}

/** Security headers middleware */
export function securityHeaders(): MiddlewareHandler {
  const isProd = process.env.NODE_ENV === 'production'
  return async (c, next) => {
    await next()
    c.header('X-Frame-Options', 'DENY')
    c.header('X-Content-Type-Options', 'nosniff')
    c.header('X-XSS-Protection', '1; mode=block')
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin')
    c.header('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
    if (isProd) {
      c.header('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
    }
  }
}

/** Block requests larger than maxBytes */
export function requestSizeLimit(maxBytes: number): MiddlewareHandler {
  return async (c, next) => {
    const length = c.req.header('content-length')
    if (length && parseInt(length, 10) > maxBytes) {
      return c.json({ error: 'Payload Too Large' }, 413)
    }
    await next()
  }
}
