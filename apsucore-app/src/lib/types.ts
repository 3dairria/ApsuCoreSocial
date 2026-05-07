export type PostType = 'image' | 'music' | 'video' | 'quote' | 'blog'

export interface Post {
  id: string
  type: PostType
  author: string
  handle: string
  avatar: string
  avatarColor: string
  time: string
  likes: number
  comments: number
  liked?: boolean
  // image
  imageUrl?: string
  caption?: string
  // music
  trackTitle?: string
  album?: string
  duration?: string
  albumColor?: string
  // video
  videoThumb?: string
  videoTitle?: string
  videoDuration?: string
  isLive?: boolean
  viewCount?: string
  // quote
  quoteText?: string
  quoteSource?: string
  quoteTag?: string
  // blog
  blogTitle?: string
  blogExcerpt?: string
  blogTag?: string
  blogReadTime?: string
}

export interface Story {
  id: string
  name: string
  avatar: string
  avatarColor: string
  isAdd?: boolean
  hasNew?: boolean
}

export interface Creator {
  id: string
  name: string
  handle: string
  avatar: string
  avatarColor: string
  bio: string
  followers: string
  verified?: boolean
  tags: string[]
}

export interface ChatItem {
  id: string
  name: string
  avatar: string
  avatarColor: string
  lastMsg: string
  time: string
  unread?: number
}

export interface Notification {
  id: string
  type: 'like' | 'comment' | 'follow' | 'mention' | 'live'
  actor: string
  avatar: string
  avatarColor: string
  text: string
  time: string
  postThumb?: string
  unread?: boolean
}

export type Screen =
  | 'home'
  | 'discover'
  | 'compose'
  | 'chat'
  | 'activity'
  | 'profile'
  | 'edit-profile'
  | 'creator-profile'
  | 'post-detail'
  | 'collections'
  | 'chat-detail'
  | 'settings'
  | 'search'
