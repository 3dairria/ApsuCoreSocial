import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowLeft, Heart, MessageCircle, Repeat2, Share2, Send, MoreHorizontal } from 'lucide-react'
import { trpc } from '../lib/trpc'
import { POSTS } from '../lib/data'
import type { Screen } from '../lib/types'

interface Props {
  onNav: (screen: Screen) => void
  onBack: () => void
}

function Avatar({ color, initial, size = 36 }: { color: string; initial: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}
    >
      {initial}
    </div>
  )
}

function timeAgo(date: string | Date) {
  const diff = (Date.now() - new Date(date).getTime()) / 60000
  if (diff < 60) return `${Math.floor(diff)}m`
  if (diff < 1440) return `${Math.floor(diff / 60)}u`
  return `${Math.floor(diff / 1440)}d`
}

export default function PostDetailScreen({ onNav, onBack }: Props) {
  const location = useLocation()
  const postId = (location.state as { postId?: string } | null)?.postId

  const { data: apiPost, isLoading } = trpc.posts.getById.useQuery(
    { id: postId! },
    { enabled: !!postId },
  )

  const likeMutation = trpc.interactions.likeToggle.useMutation()
  const commentMutation = trpc.interactions.commentCreate.useMutation()
  const utils = trpc.useUtils()

  // Fallback to local data when postId not in API
  const localPost = POSTS.find(p => p.id === postId) ?? POSTS[0]
  const localComments = [
    { id: 'r1', author: 'Nexus Drift', avatarColor: '#D4A843', text: 'Ongelooflijk werk, de textuur is zo rijk!', createdAt: new Date(Date.now() - 5 * 60000) },
    { id: 'r2', author: 'Aion Stelios', avatarColor: '#1e6e4e', text: 'Precies wat ik voelde bij het zien.', createdAt: new Date(Date.now() - 12 * 60000) },
    { id: 'r3', author: 'Solara AI', avatarColor: '#9D5FF5', text: 'Welk model heb je gebruikt?', createdAt: new Date(Date.now() - 28 * 60000) },
  ]

  const post = apiPost ?? null
  const isApiPost = !!post

  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(isApiPost ? (apiPost?.likes ?? 0) : localPost.likes)
  const [reply, setReply] = useState('')
  const [localReplies, setLocalReplies] = useState<Array<{ id: string; text: string }>>([])

  const displayAuthor = isApiPost ? post.author : localPost.author
  const displayHandle = isApiPost ? `@${post.handle}` : localPost.handle
  const displayAvatarColor = isApiPost ? post.avatarColor : localPost.avatarColor
  const displayImageUrl = isApiPost ? post.imageUrl : localPost.imageUrl
  const displayCaption = isApiPost ? post.caption : localPost.caption
  const displayComments = isApiPost ? post.comments : localComments

  function handleLike() {
    const newLiked = !liked
    setLiked(newLiked)
    setLikeCount(n => newLiked ? n + 1 : n - 1)
    if (postId) {
      likeMutation.mutate({ postId }, {
        onSuccess: () => { void utils.posts.getById.invalidate({ id: postId }) },
      })
    }
  }

  async function handleReply() {
    if (!reply.trim()) return
    if (postId && isApiPost) {
      await commentMutation.mutateAsync({ postId, text: reply })
      void utils.posts.getById.invalidate({ id: postId })
    } else {
      setLocalReplies(prev => [...prev, { id: `lr${Date.now()}`, text: reply }])
    }
    setReply('')
  }

  if (isLoading && postId) {
    return (
      <div className="min-h-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <button onClick={onBack} className="text-muted"><ArrowLeft size={20} strokeWidth={1.75} /></button>
          <span className="text-sm font-semibold text-text">Post</span>
          <div className="w-5" />
        </div>
        <div className="p-4 space-y-3">
          <div className="skeleton h-10 w-10 rounded-full" />
          <div className="skeleton h-4 w-32 rounded" />
          <div className="skeleton h-48 w-full rounded-xl" />
          <div className="skeleton h-4 w-full rounded" />
          <div className="skeleton h-4 w-2/3 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-up min-h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-bg z-10">
        <button onClick={onBack} className="text-muted">
          <ArrowLeft size={20} strokeWidth={1.75} />
        </button>
        <span className="text-sm font-semibold text-text">Post</span>
        <button className="text-muted">
          <MoreHorizontal size={20} strokeWidth={1.75} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Author */}
        <div className="flex items-center gap-3 px-4 py-3">
          <button onClick={() => onNav('creator-profile')}>
            <Avatar color={displayAvatarColor} initial={displayAuthor[0]} size={42} />
          </button>
          <div className="flex-1">
            <button onClick={() => onNav('creator-profile')}>
              <p className="text-sm font-semibold text-text leading-tight">{displayAuthor}</p>
              <p className="text-xs text-muted">{displayHandle}</p>
            </button>
          </div>
          <button className="text-xs px-4 py-1.5 rounded-full border border-purple text-purple-lt font-medium">
            Volgen
          </button>
        </div>

        {/* Image */}
        {displayImageUrl && (
          <img src={displayImageUrl} alt="" className="w-full" />
        )}

        {/* Caption */}
        {displayCaption && (
          <p className="px-4 py-3 text-sm text-text/90 font-serif leading-relaxed">{displayCaption}</p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-5 px-4 py-3 border-b border-border">
          <button onClick={handleLike} className="flex items-center gap-1.5 text-muted active:scale-90 transition-transform">
            <Heart
              size={20}
              strokeWidth={1.75}
              className={liked ? 'fill-red-500 stroke-red-500 animate-heart-pop' : ''}
            />
            <span className="text-sm">{likeCount}</span>
          </button>
          <button className="flex items-center gap-1.5 text-muted">
            <MessageCircle size={20} strokeWidth={1.75} />
            <span className="text-sm">{displayComments.length}</span>
          </button>
          <button className="flex items-center gap-1.5 text-muted">
            <Repeat2 size={20} strokeWidth={1.75} />
          </button>
          <button className="flex items-center gap-1.5 text-muted ml-auto">
            <Share2 size={20} strokeWidth={1.75} />
          </button>
        </div>

        {/* Comments */}
        <div className="px-4 py-3">
          <p className="text-xs text-muted uppercase tracking-widest mb-4">
            Reacties ({displayComments.length + localReplies.length})
          </p>
          <div className="space-y-5">
            {displayComments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <Avatar color={comment.avatarColor} initial={comment.author[0]} size={32} />
                <div className="flex-1">
                  <div className="bg-surface rounded-xl px-3 py-2.5">
                    <p className="text-xs font-semibold text-text mb-0.5">{comment.author}</p>
                    <p className="text-sm text-text/85 leading-snug">{comment.text}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 px-1">
                    <span className="text-[11px] text-muted">{timeAgo(comment.createdAt)}</span>
                    <button className="text-[11px] text-muted">Reageer</button>
                  </div>
                </div>
              </div>
            ))}
            {localReplies.map(r => (
              <div key={r.id} className="flex gap-3">
                <Avatar color="#7C3AED" initial="J" size={32} />
                <div className="flex-1">
                  <div className="bg-surface rounded-xl px-3 py-2.5">
                    <p className="text-xs font-semibold text-text mb-0.5">Jouw Naam</p>
                    <p className="text-sm text-text/85 leading-snug">{r.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reply input */}
      <div className="flex items-center gap-3 px-4 py-3 border-t border-border bg-bg">
        <Avatar color="#7C3AED" initial="J" size={32} />
        <div className="flex-1 flex items-center bg-surface border border-border rounded-full px-3.5 h-9 gap-2">
          <input
            type="text"
            value={reply}
            onChange={e => setReply(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && void handleReply()}
            placeholder="Schrijf een reactieâ€¦"
            className="flex-1 bg-transparent text-sm text-text placeholder:text-muted outline-none"
          />
          {reply.trim() && (
            <button
              onClick={() => void handleReply()}
              className="text-purple-lt flex-shrink-0"
            >
              <Send size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
