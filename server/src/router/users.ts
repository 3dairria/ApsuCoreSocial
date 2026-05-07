import { z } from 'zod'
import { eq, count, like, and, ne } from 'drizzle-orm'
import { router, publicProcedure, protectedProcedure } from './trpc.js'
import { users, follows, posts } from '../db/schema.js'

export const usersRouter = router({
  me: protectedProcedure.query(async ({ ctx }) => {
    const [user] = await ctx.db
      .select()
      .from(users)
      .where(eq(users.id, ctx.userId))
      .limit(1)

    if (!user) return null

    const [followerRow] = await ctx.db
      .select({ count: count() })
      .from(follows)
      .where(eq(follows.followingId, ctx.userId))

    const [followingRow] = await ctx.db
      .select({ count: count() })
      .from(follows)
      .where(eq(follows.followerId, ctx.userId))

    const [postRow] = await ctx.db
      .select({ count: count() })
      .from(posts)
      .where(eq(posts.authorId, ctx.userId))

    return {
      ...user,
      followerCount: followerRow?.count ?? 0,
      followingCount: followingRow?.count ?? 0,
      postCount: postRow?.count ?? 0,
    }
  }),

  updateProfile: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(60),
      handle: z.string().min(2).max(30).regex(/^[a-z0-9_]+$/),
      bio: z.string().max(160).default(''),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(users)
        .set({ name: input.name, handle: input.handle, bio: input.bio })
        .where(eq(users.id, ctx.userId))
      return { ok: true }
    }),

  search: publicProcedure
    .input(z.object({ q: z.string().min(1).max(80) }))
    .query(async ({ ctx, input }) => {
      const term = `%${input.q}%`
      const currentUserId = ctx.userId

      const nameRows = await ctx.db
        .select({ user: users, followerCount: count(follows.followerId).as('fc') })
        .from(users)
        .leftJoin(follows, eq(follows.followingId, users.id))
        .where(and(like(users.name, term), currentUserId ? ne(users.id, currentUserId) : undefined))
        .groupBy(users.id)
        .limit(20)

      const handleRows = await ctx.db
        .select({ user: users, followerCount: count(follows.followerId).as('fc') })
        .from(users)
        .leftJoin(follows, eq(follows.followingId, users.id))
        .where(and(like(users.handle, term), currentUserId ? ne(users.id, currentUserId) : undefined))
        .groupBy(users.id)
        .limit(20)

      const seen = new Set<string>()
      return [...nameRows, ...handleRows]
        .filter(r => { if (seen.has(r.user.id)) return false; seen.add(r.user.id); return true })
        .map(({ user, followerCount }) => ({ ...user, followerCount }))
    }),

  getProfile: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [row] = await ctx.db
        .select({ user: users, followerCount: count(follows.followerId).as('fc') })
        .from(users)
        .leftJoin(follows, eq(follows.followingId, users.id))
        .where(eq(users.id, input.id))
        .groupBy(users.id)
        .limit(1)

      if (!row) throw new Error('User not found')

      let isFollowing = false
      if (ctx.userId) {
        const [f] = await ctx.db
          .select()
          .from(follows)
          .where(and(eq(follows.followerId, ctx.userId), eq(follows.followingId, input.id)))
          .limit(1)
        isFollowing = !!f
      }

      return { ...row.user, followerCount: row.followerCount, isFollowing }
    }),

  followToggle: protectedProcedure
    .input(z.object({ targetId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [existing] = await ctx.db
        .select()
        .from(follows)
        .where(and(eq(follows.followerId, ctx.userId), eq(follows.followingId, input.targetId)))
        .limit(1)

      if (existing) {
        await ctx.db
          .delete(follows)
          .where(and(eq(follows.followerId, ctx.userId), eq(follows.followingId, input.targetId)))
        return { following: false }
      }

      await ctx.db.insert(follows).values({
        followerId: ctx.userId,
        followingId: input.targetId,
        createdAt: new Date(),
      })
      return { following: true }
    }),
})
