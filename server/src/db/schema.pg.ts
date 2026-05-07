import { pgTable, pgEnum, text, boolean, timestamp, index } from 'drizzle-orm/pg-core'

export const postTypeEnum = pgEnum('post_type', ['image', 'music', 'video', 'quote', 'blog'])
export const notifTypeEnum = pgEnum('notification_type', ['like', 'comment', 'follow', 'mention'])

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  handle: text('handle').notNull().unique(),
  name: text('name').notNull(),
  bio: text('bio').notNull().default(''),
  avatarColor: text('avatar_color').notNull().default('#7C3AED'),
  passwordHash: text('password_hash'),
  createdAt: timestamp('created_at').notNull(),
})

export const posts = pgTable('posts', {
  id: text('id').primaryKey(),
  authorId: text('author_id').notNull().references(() => users.id),
  type: postTypeEnum('type').notNull(),
  caption: text('caption'),
  imageUrl: text('image_url'),
  trackTitle: text('track_title'),
  album: text('album'),
  duration: text('duration'),
  albumColor: text('album_color'),
  videoThumb: text('video_thumb'),
  videoTitle: text('video_title'),
  videoDuration: text('video_duration'),
  isLive: boolean('is_live').notNull().default(false),
  quoteText: text('quote_text'),
  quoteSource: text('quote_source'),
  quoteTag: text('quote_tag'),
  blogTitle: text('blog_title'),
  blogExcerpt: text('blog_excerpt'),
  blogTag: text('blog_tag'),
  blogReadTime: text('blog_read_time'),
  createdAt: timestamp('created_at').notNull(),
}, (t) => ({
  authorIdx: index('posts_author_idx').on(t.authorId),
  createdAtIdx: index('posts_created_at_idx').on(t.createdAt),
}))

export const follows = pgTable('follows', {
  followerId: text('follower_id').notNull().references(() => users.id),
  followingId: text('following_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').notNull(),
}, (t) => ({
  followerIdx: index('follows_follower_idx').on(t.followerId),
  followingIdx: index('follows_following_idx').on(t.followingId),
}))

export const likes = pgTable('likes', {
  userId: text('user_id').notNull().references(() => users.id),
  postId: text('post_id').notNull().references(() => posts.id),
  createdAt: timestamp('created_at').notNull(),
}, (t) => ({
  postIdx: index('likes_post_idx').on(t.postId),
}))

export const comments = pgTable('comments', {
  id: text('id').primaryKey(),
  postId: text('post_id').notNull().references(() => posts.id),
  authorId: text('author_id').notNull().references(() => users.id),
  text: text('text').notNull(),
  createdAt: timestamp('created_at').notNull(),
}, (t) => ({
  postIdx: index('comments_post_idx').on(t.postId),
}))

export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  type: notifTypeEnum('type').notNull(),
  actorId: text('actor_id').notNull().references(() => users.id),
  postId: text('post_id').references(() => posts.id),
  read: boolean('read').notNull().default(false),
  createdAt: timestamp('created_at').notNull(),
}, (t) => ({
  userIdx: index('notifications_user_idx').on(t.userId),
  createdAtIdx: index('notifications_created_at_idx').on(t.createdAt),
}))
