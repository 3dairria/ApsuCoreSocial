import { z } from 'zod'
import { desc, eq, count, sql } from 'drizzle-orm'
import { router, publicProcedure, protectedProcedure } from './trpc.js'
import { posts, users, likes, comments } from '../db/schema.js'

export const postsRouter = router({
  list: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(20),
    }))
    .query(async ({ ctx, input }) => {
      const rows = await ctx.db
        .select({
          post: posts,
          author: users,
          likeCount: count(likes.userId).as('like_count'),
          commentCount: sql<number>`(
            SELECT COUNT(*) FROM comments WHERE comments.post_id = ${posts.id}
          )`.as('comment_count'),
        })
        .from(posts)
        .innerJoin(users, eq(posts.authorId, users.id))
        .leftJoin(likes, eq(likes.postId, posts.id))
        .groupBy(posts.id)
        .orderBy(desc(posts.createdAt))
        .limit(input.limit)

      return rows.map(({ post, author, likeCount, commentCount }) => ({
        ...post,
        author: author.name,
        handle: author.handle,
        avatarColor: author.avatarColor,
        likes: likeCount,
        comments: commentCount,
      }))
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const [row] = await ctx.db
        .select({
          post: posts,
          author: users,
          likeCount: count(likes.userId).as('like_count'),
        })
        .from(posts)
        .innerJoin(users, eq(posts.authorId, users.id))
        .leftJoin(likes, eq(likes.postId, posts.id))
        .where(eq(posts.id, input.id))
        .groupBy(posts.id)
        .limit(1)

      if (!row) throw new Error('Post not found')

      const postComments = await ctx.db
        .select({
          id: comments.id,
          text: comments.text,
          createdAt: comments.createdAt,
          author: users.name,
          avatarColor: users.avatarColor,
        })
        .from(comments)
        .innerJoin(users, eq(comments.authorId, users.id))
        .where(eq(comments.postId, input.id))
        .orderBy(desc(comments.createdAt))

      return {
        ...row.post,
        author: row.author.name,
        handle: row.author.handle,
        avatarColor: row.author.avatarColor,
        likes: row.likeCount,
        comments: postComments,
      }
    }),

  create: protectedProcedure
    .input(z.object({
      type: z.enum(['image', 'music', 'video', 'quote', 'blog']),
      caption: z.string().max(500).optional(),
      quoteText: z.string().max(500).optional(),
      quoteSource: z.string().max(100).optional(),
      blogTitle: z.string().max(200).optional(),
      blogExcerpt: z.string().max(500).optional(),
      trackTitle: z.string().max(200).optional(),
      videoTitle: z.string().max(200).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const id = crypto.randomUUID()
      const wordCount = [input.caption, input.quoteText, input.blogExcerpt]
        .filter(Boolean).join(' ').split(/\s+/).filter(Boolean).length
      const readMinutes = Math.max(1, Math.ceil(wordCount / 200))

      await ctx.db.insert(posts).values({
        id,
        authorId: ctx.userId,
        type: input.type,
        caption: input.caption,
        quoteText: input.quoteText,
        quoteSource: input.quoteSource,
        blogTitle: input.blogTitle,
        blogExcerpt: input.blogExcerpt,
        blogReadTime: input.type === 'blog' ? `${readMinutes} min` : undefined,
        trackTitle: input.trackTitle,
        videoTitle: input.videoTitle,
        createdAt: new Date(),
      })
      return { id }
    }),
})
