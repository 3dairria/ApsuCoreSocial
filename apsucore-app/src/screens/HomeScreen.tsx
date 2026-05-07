import { useState, useRef, useCallback } from 'react'
import StoryRow from '../components/feed/StoryRow'
import PostCard from '../components/post/PostCard'
import { PostCardSkeleton, StoryRowSkeleton } from '../components/ui/Skeleton'
import { POSTS } from '../lib/data'
import { trpc } from '../lib/trpc'
import type { Screen } from '../lib/types'
import type { Post } from '../lib/types'

const FEED_TABS = ['Volgend', 'Ontdekken', 'Trending'] as const
type FeedTab = (typeof FEED_TABS)[number]

const PULL_THRESHOLD = 72

interface Props {
  onNav: (screen: Screen, state?: Record<string, unknown>) => void
}

function filterLocal(posts: Post[], tab: FeedTab) {
  if (tab === 'Volgend') return posts.slice(0, 7)
  if (tab === 'Ontdekken') return [...posts].sort((a, b) => b.likes - a.likes)
  return [...posts].sort((a, b) => b.comments - a.comments)
}

export default function HomeScreen({ onNav }: Props) {
  const [activeTab, setActiveTab] = useState<FeedTab>('Volgend')
  const [refreshing, setRefreshing] = useState(false)
  const [pullY, setPullY] = useState(0)
  const touchStartY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const isPulling = useRef(false)

  const { data: apiPosts, isLoading, refetch } = trpc.posts.list.useQuery({ limit: 20 })

  // Merge API posts (typed minimally) with local fallback
  const remotePosts = apiPosts?.map(p => ({
    id: p.id,
    type: p.type as Post['type'],
    author: p.author,
    handle: `@${p.handle}`,
    avatar: p.author[0],
    avatarColor: p.avatarColor,
    time: new Date(p.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' }),
    likes: p.likes,
    comments: p.comments,
    caption: p.caption ?? undefined,
    imageUrl: p.imageUrl ?? undefined,
    trackTitle: p.trackTitle ?? undefined,
    album: p.album ?? undefined,
    duration: p.duration ?? undefined,
    albumColor: p.albumColor ?? undefined,
    quoteText: p.quoteText ?? undefined,
    quoteSource: p.quoteSource ?? undefined,
    quoteTag: p.quoteTag ?? undefined,
    blogTitle: p.blogTitle ?? undefined,
    blogExcerpt: p.blogExcerpt ?? undefined,
    blogTag: p.blogTag ?? undefined,
    blogReadTime: p.blogReadTime ?? undefined,
  }) satisfies Post) ?? []

  // Fall back to local mock data when API has no posts yet
  const allPosts: Post[] = remotePosts.length > 0 ? [...remotePosts, ...POSTS] : POSTS
  const posts = filterLocal(allPosts, activeTab)

  function switchTab(tab: FeedTab) {
    if (tab === activeTab) return
    setActiveTab(tab)
  }

  async function triggerRefresh() {
    setRefreshing(true)
    setPullY(0)
    await refetch()
    setTimeout(() => setRefreshing(false), 600)
  }

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const scrollParent = containerRef.current?.closest('.overflow-y-auto') as HTMLElement | null
    const scrollTop = scrollParent ? scrollParent.scrollTop : window.scrollY
    if (scrollTop > 0) return
    touchStartY.current = e.touches[0].clientY
    isPulling.current = true
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling.current || refreshing) return
    const dy = e.touches[0].clientY - touchStartY.current
    if (dy <= 0) { setPullY(0); return }
    const damped = dy < PULL_THRESHOLD ? dy : PULL_THRESHOLD + (dy - PULL_THRESHOLD) * 0.3
    setPullY(Math.min(damped, PULL_THRESHOLD + 30))
  }, [refreshing])

  const onTouchEnd = useCallback(() => {
    if (!isPulling.current) return
    isPulling.current = false
    if (pullY >= PULL_THRESHOLD) {
      void triggerRefresh()
    } else {
      setPullY(0)
    }
  }, [pullY])

  const progress = Math.min(pullY / PULL_THRESHOLD, 1)
  const loading = isLoading && !apiPosts

  return (
    <div ref={containerRef} onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}>
      {/* Pull-to-refresh indicator */}
      <div
        className="flex items-center justify-center overflow-hidden transition-all duration-200"
        style={{ height: refreshing ? 52 : pullY > 0 ? pullY : 0 }}
      >
        <div
          className={`w-8 h-8 rounded-full border-2 border-purple-lt flex items-center justify-center ${refreshing ? 'animate-refresh' : ''}`}
          style={refreshing ? undefined : { opacity: progress, transform: `rotate(${progress * 180}deg)` }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-purple-lt">
            <path d="M7 1.5A5.5 5.5 0 1 1 1.5 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
            <path d="M1.5 3.5V7H5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>

      {loading ? <StoryRowSkeleton /> : <StoryRow />}

      {/* Feed tabs */}
      <div className="flex border-b border-border sticky top-0 bg-bg z-10">
        {FEED_TABS.map(tab => (
          <button
            key={tab}
            type="button"
            onClick={() => switchTab(tab)}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors relative ${
              activeTab === tab ? 'text-text' : 'text-muted'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-0.5 rounded-full bg-purple-lt" />
            )}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div>
        {loading || refreshing
          ? Array.from({ length: 3 }).map((_, i) => <PostCardSkeleton key={i} />)
          : posts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onOpen={(id) => onNav('post-detail', { postId: id })}
              />
            ))
        }
      </div>
    </div>
  )
}
