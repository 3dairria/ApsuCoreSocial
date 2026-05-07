import { eq, desc, count, and } from 'drizzle-orm'
import { router, protectedProcedure } from './trpc.js'
import { notifications, users, posts } from '../db/schema.js'

export const notificationsRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const rows = await ctx.db
      .select({
        notif: notifications,
        actor: users,
        postImageUrl: posts.imageUrl,
      })
      .from(notifications)
      .innerJoin(users, eq(notifications.actorId, users.id))
      .leftJoin(posts, eq(notifications.postId, posts.id))
      .where(eq(notifications.userId, ctx.userId))
      .orderBy(desc(notifications.createdAt))
      .limit(50)

    return rows.map(({ notif, actor, postImageUrl }) => ({
      id: notif.id,
      type: notif.type,
      read: notif.read,
      createdAt: notif.createdAt,
      postId: notif.postId,
      postImageUrl: postImageUrl ?? null,
      actor: {
        id: actor.id,
        name: actor.name,
        handle: actor.handle,
        avatarColor: actor.avatarColor,
      },
    }))
  }),

  markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
    await ctx.db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.userId, ctx.userId))
    return { ok: true }
  }),

  unreadCount: protectedProcedure.query(async ({ ctx }) => {
    const [row] = await ctx.db
      .select({ count: count(notifications.id) })
      .from(notifications)
      .where(and(
        eq(notifications.userId, ctx.userId),
        eq(notifications.read, false),
      ))
    return { count: row?.count ?? 0 }
  }),
})
