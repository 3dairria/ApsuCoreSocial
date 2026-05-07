import { router } from './trpc.js'
import { authRouter } from './auth.js'
import { postsRouter } from './posts.js'
import { usersRouter } from './users.js'
import { interactionsRouter } from './interactions.js'
import { notificationsRouter } from './notifications.js'

export const appRouter = router({
  auth: authRouter,
  posts: postsRouter,
  users: usersRouter,
  interactions: interactionsRouter,
  notifications: notificationsRouter,
})

export type AppRouter = typeof appRouter
