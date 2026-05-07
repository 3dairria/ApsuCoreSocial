import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  handle: text('handle').notNull().unique(),
  name: text('name').notNull(),
  bio: text('bio').notNull().default(''),
  avatarColor: text('avatar_color').notNull().default('#7C3AED'),
  passwordHash: text('password_hash'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const posts = sqliteTable('posts', {
  id: text('id').primaryKey(),
  authorId: text('author_id').notNull().references(() => users.id),
  type: text('type', { enum: ['image', 'music', 'video', 'quote', 'blog'] }).notNull(),
  caption: text('caption'),
  imageUrl: text('image_url'),
  trackTitle: text('track_title'),
  album: text('album'),
  duration: text('duration'),
  albumColor: text('album_color'),
  videoThumb: text('video_thumb'),
  videoTitle: text('video_title'),
  videoDuration: text('video_duration'),
  isLive: integer('is_live', { mode: 'boolean' }).notNull().default(false),
  quoteText: text('quote_text'),
  quoteSource: text('quote_source'),
  quoteTag: text('quote_tag'),
  blogTitle: text('blog_title'),
  blogExcerpt: text('blog_excerpt'),
  blogTag: text('blog_tag'),
  blogReadTime: text('blog_read_time'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (t) => ({
  authorIdx: index('posts_author_idx').on(t.authorId),
  createdAtIdx: index('posts_created_at_idx').on(t.createdAt),
}))

export const follows = sqliteTable('follows', {
  followerId: text('follower_id').notNull().references(() => users.id),
  followingId: text('following_id').notNull().references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (t) => ({
  followerIdx: index('follows_follower_idx').on(t.followerId),
  followingIdx: index('follows_following_idx').on(t.followingId),
}))

export const likes = sqliteTable('likes', {
  userId: text('user_id').notNull().references(() => users.id),
  postId: text('post_id').notNull().references(() => posts.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (t) => ({
  postIdx: index('likes_post_idx').on(t.postId),
}))

export const comments = sqliteTable('comments', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => posts.id),
  authorId: text('author_id').notNull().references(() => users.id),
  text: text('text').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (t) => ({
  postIdx: index('comments_post_idx').on(t.postId),
}))

export const notifications = sqliteTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  type: text('type', { enum: ['like', 'comment', 'follow', 'mention'] }).notNull(),
  actorId: text('actor_id').notNull().references(() => users.id),
  postId: text('post_id').references(() => posts.id),
  read: integer('read', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
}, (t) => ({
  userIdx: index('notifications_user_idx').on(t.userId),
  createdAtIdx: index('notifications_created_at_idx').on(t.createdAt),
}))
