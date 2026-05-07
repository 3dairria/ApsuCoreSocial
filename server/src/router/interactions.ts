import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { router, protectedProcedure } from './trpc.js'
import { likes, comments } from '../db/schema.js'

function nanoid() {
  return Math.random().toString(36).slice(2, 11)
}

export const interactionsRouter = router({
  likeToggle: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const [existing] = await ctx.db
        .select()
        .from(likes)
        .where(and(eq(likes.postId, input.postId), eq(likes.userId, ctx.userId)))
        .limit(1)

      if (existing) {
        await ctx.db
          .delete(likes)
          .where(and(eq(likes.postId, input.postId), eq(likes.userId, ctx.userId)))
        return { liked: false }
      }

      await ctx.db.insert(likes).values({
        postId: input.postId,
        userId: ctx.userId,
        createdAt: new Date(),
      })
      return { liked: true }
    }),

  commentCreate: protectedProcedure
    .input(z.object({
      postId: z.string(),
      text: z.string().min(1).max(500),
    }))
    .mutation(async ({ ctx, input }) => {
      const id = `comment_${nanoid()}`
      await ctx.db.insert(comments).values({
        id,
        postId: input.postId,
        authorId: ctx.userId,
        text: input.text,
        createdAt: new Date(),
      })
      return { id }
    }),
})
