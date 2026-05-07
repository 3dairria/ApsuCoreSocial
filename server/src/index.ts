import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { fetchRequestHandler } from '@trpc/server/adapters/fetch'
import { db } from './db/index.js'
import { appRouter } from './router/index.js'
import { verifyToken } from './lib/jwt.js'
import { rateLimit, securityHeaders, requestSizeLimit } from './middleware/security.js'

const isProd = process.env.NODE_ENV === 'production'
const PORT = parseInt(process.env.PORT ?? '3001', 10)

const ALLOWED_ORIGINS = isProd
  ? (process.env.CORS_ORIGIN ?? '').split(',').map(s => s.trim()).filter(Boolean)
  : ['http://localhost:5174', 'http://localhost:5173', 'http://localhost:4173']

const app = new Hono()

// Security headers on every response
app.use('*', securityHeaders())

// CORS — locked to allowed origins in production
app.use('*', cors({
  origin: isProd
    ? (origin) => ALLOWED_ORIGINS.includes(origin) ? origin : null
    : ALLOWED_ORIGINS,
  credentials: true,
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
}))

// 10 MB max payload
app.use('*', requestSizeLimit(10 * 1024 * 1024))

// Strict rate limit on auth endpoints: 10 per minute per IP
app.use('/trpc/auth.login', rateLimit(10, 60_000))
app.use('/trpc/auth.register', rateLimit(5, 60_000))

// General API rate limit: 200 per minute per IP
app.use('/trpc/*', rateLimit(200, 60_000))

// tRPC handler
app.all('/trpc/*', async (c) => {
  const authHeader = c.req.header('authorization') ?? ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  const userId = token ? await verifyToken(token) : null

  return fetchRequestHandler({
    endpoint: '/trpc',
    req: c.req.raw,
    router: appRouter,
    createContext: () => ({ db, userId }),
    onError: ({ error, path }) => {
      if (isProd) {
        // Never expose stack traces in production
        if (error.code === 'INTERNAL_SERVER_ERROR') {
          console.error(`[tRPC] ${path}:`, error.message)
        }
      } else {
        console.error(`[tRPC] ${path}:`, error)
      }
    },
  })
})

app.get('/', (c) => c.json({ name: 'ApsuCore API', version: '0.1.0', status: 'running', docs: '/health' }))

app.get('/health', (c) => c.json({ ok: true }))

app.notFound((c) => c.json({ error: 'Not Found' }, 404))

app.onError((err, c) => {
  const message = isProd ? 'Internal Server Error' : err.message
  if (isProd) console.error('[Server]', err.message)
  else console.error('[Server]', err)
  return c.json({ error: message }, 500)
})

console.log(`ApsuCore API → http://localhost:${PORT} [${isProd ? 'production' : 'development'}]`)

serve({ fetch: app.fetch, port: PORT })
