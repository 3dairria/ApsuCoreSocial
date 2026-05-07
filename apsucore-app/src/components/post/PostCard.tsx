import { useState } from 'react'
import {
  Heart, MessageCircle, Repeat2, Share2, Play, Music2,
  BookOpen, Quote, BookMarked, Moon, MoreHorizontal, Globe, Image,
} from 'lucide-react'
import type { Post } from '../../lib/types'
import { useToast } from '../../lib/toast'
import ShareSheet from '../ui/ShareSheet'
import ZenMode from '../ui/ZenMode'
import PostMenu from '../ui/PostMenu'

interface Props {
  post: Post
  onOpen?: (id: string) => void
}

// Simulated EN translations for captions/quotes
const EN_TRANSLATIONS: Record<string, string> = {
  'Nacht van de digitale stilte — gegenereerd met Flux 1.1 Pro. Wat zie jij in de ruis?':
    'Night of digital silence — generated with Flux 1.1 Pro. What do you see in the noise?',
  'De machine droomt niet. Zij herinnert zich wat wij nooit hebben geweten.':
    'The machine does not dream. It remembers what we never knew.',
  'Organische structuren, samengesteld uit licht en code.':
    'Organic structures, composed of light and code.',
  'Waarom AI geen kunstenaar vervangt maar een spiegel wordt':
    'Why AI does not replace the artist but becomes a mirror',
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

function CardHeader({
  post, onMenu, translated, onTranslate,
}: {
  post: Post
  onMenu: () => void
  translated: boolean
  onTranslate: () => void
}) {
  const hasTranslation = !!(post.caption || post.quoteText || post.blogTitle)

  return (
    <div className="flex items-center gap-2.5 px-4 pt-4 pb-2">
      <Avatar color={post.avatarColor} initial={post.author[0]} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text leading-tight truncate">{post.author}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-xs text-muted truncate">{post.handle} · {post.time}</p>
          {hasTranslation && (
            <button
              type="button"
              onClick={e => { e.stopPropagation(); onTranslate() }}
              className={`flex items-center gap-0.5 text-[10px] font-medium px-1.5 py-0.5 rounded transition-colors flex-shrink-0 ${
                translated
                  ? 'bg-yellow/20 text-yellow'
                  : 'bg-surface2 text-muted hover:text-yellow'
              }`}
            >
              <Globe size={10} />
              {translated ? 'NL' : 'EN'}
            </button>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={e => { e.stopPropagation(); onMenu() }}
        className="text-muted p-1 -mr-1 flex-shrink-0"
      >
        <MoreHorizontal size={18} strokeWidth={1.75} />
      </button>
    </div>
  )
}

function CardActions({
  post, liked, onLike, onShare, onZen,
}: {
  post: Post
  liked: boolean
  onLike: () => void
  onShare: () => void
  onZen?: () => void
}) {
  const [likeCount, setLikeCount] = useState(post.likes)
  const [saved, setSaved] = useState(false)
  const { showToast } = useToast()

  function handleLike() {
    setLikeCount(prev => liked ? prev - 1 : prev + 1)
    onLike()
    if (!liked) showToast('Geliked!')
  }

  function handleSave() {
    setSaved(s => !s)
    showToast(saved ? 'Verwijderd uit collectie' : 'Opgeslagen in collectie', {
      undoLabel: 'Ongedaan',
      onUndo: () => setSaved(s => !s),
    })
  }

  const isReadable = post.type === 'blog' || post.type === 'quote'

  return (
    <div className="flex items-center gap-4 px-4 py-3 border-t border-border/60">
      <button
        type="button"
        onClick={handleLike}
        className="flex items-center gap-1.5 text-muted active:scale-90 transition-transform"
      >
        <Heart
          size={18}
          strokeWidth={1.75}
          className={liked ? 'fill-red-500 stroke-red-500 animate-heart-pop' : ''}
        />
        <span className="text-xs">{likeCount}</span>
      </button>
      <button type="button" className="flex items-center gap-1.5 text-muted">
        <MessageCircle size={18} strokeWidth={1.75} />
        <span className="text-xs">{post.comments}</span>
      </button>
      <button type="button" className="flex items-center gap-1.5 text-muted">
        <Repeat2 size={18} strokeWidth={1.75} />
      </button>
      <div className="flex items-center gap-3 ml-auto">
        {isReadable && onZen && (
          <button type="button" onClick={onZen} className="text-muted">
            <Moon size={17} strokeWidth={1.75} />
          </button>
        )}
        <button type="button" onClick={handleSave} className="text-muted">
          <BookMarked
            size={17}
            strokeWidth={1.75}
            className={saved ? 'fill-yellow stroke-yellow' : ''}
          />
        </button>
        <button type="button" onClick={onShare} className="text-muted">
          <Share2 size={17} strokeWidth={1.75} />
        </button>
      </div>
    </div>
  )
}

function ImageCard({ post, translated }: { post: Post; translated: boolean }) {
  const caption = translated
    ? (EN_TRANSLATIONS[post.caption ?? ''] ?? post.caption)
    : post.caption
  return (
    <>
      {post.imageUrl ? (
        <img
          src={post.imageUrl}
          alt={caption ?? ''}
          className="w-full aspect-[3/2] object-cover bg-surface2"
        />
      ) : (
        <div className="w-full aspect-[3/2] bg-surface2 flex items-center justify-center">
          <Image size={36} className="text-muted2" strokeWidth={1.25} />
        </div>
      )}
      {caption && (
        <p className={`px-4 py-2.5 text-sm text-text/90 font-serif leading-relaxed ${translated ? 'border-l-2 border-yellow ml-4' : ''}`}>
          {caption}
        </p>
      )}
    </>
  )
}

function MusicCard({ post }: { post: Post }) {
  const [playing, setPlaying] = useState(false)
  return (
    <div className="mx-4 mb-3 rounded-lg overflow-hidden" style={{ background: post.albumColor ?? '#1e1e22' }}>
      <div className="flex items-center gap-3 p-3">
        <div
          className="w-14 h-14 rounded-md flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(0,0,0,0.3)' }}
        >
          <Music2 size={24} className="text-white/70" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{post.trackTitle}</p>
          <p className="text-xs text-white/60 truncate">{post.album}</p>
          <p className="text-xs text-white/50 mt-0.5">{post.duration}</p>
        </div>
        <button
          type="button"
          onClick={() => setPlaying(p => !p)}
          className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center active:scale-95 transition-transform flex-shrink-0"
        >
          {playing ? (
            <div className="flex items-end gap-0.5 h-4">
              {[1, 2, 3, 4].map(i => (
                <div
                  key={i}
                  className="wave-bar"
                  style={{ height: `${[60, 100, 75, 90][i - 1]}%`, animationDelay: `${i * 0.12}s` }}
                />
              ))}
            </div>
          ) : (
            <Play size={16} className="text-white ml-0.5" fill="white" />
          )}
        </button>
      </div>
    </div>
  )
}

function VideoCard({ post }: { post: Post }) {
  return (
    <div className="relative mx-4 mb-3 rounded-lg overflow-hidden">
      <img
        src={post.videoThumb}
        alt={post.videoTitle ?? ''}
        className="w-full aspect-video object-cover bg-surface2"
      />
      <div className="absolute inset-0 bg-black/30 flex flex-col justify-between p-3">
        <div className="flex items-start gap-2">
          {post.isLive ? (
            <span className="flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-live" />
              LIVE
            </span>
          ) : (
            <span className="bg-black/60 text-white text-[11px] px-1.5 py-0.5 rounded ml-auto">
              {post.videoDuration}
            </span>
          )}
          {post.isLive && post.viewCount && (
            <span className="bg-black/60 text-white text-[11px] px-1.5 py-0.5 rounded ml-auto">
              {post.viewCount} kijkers
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-black/40 flex items-center justify-center">
            <Play size={16} className="text-white ml-0.5" fill="white" />
          </div>
          <p className="text-white text-xs font-medium leading-snug line-clamp-2 flex-1">
            {post.videoTitle}
          </p>
        </div>
      </div>
    </div>
  )
}

function QuoteCard({ post, translated }: { post: Post; translated: boolean }) {
  const text = translated
    ? (EN_TRANSLATIONS[post.quoteText ?? ''] ?? post.quoteText)
    : post.quoteText
  return (
    <div className={`mx-4 mb-3 rounded-lg border bg-surface2 p-4 ${translated ? 'border-yellow/40' : 'border-purple-dim'}`}>
      <Quote size={20} className="text-purple-lt mb-2 opacity-60" />
      <p className="font-serif text-base italic text-text leading-relaxed mb-3">{text}</p>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted">{post.quoteSource}</p>
        {post.quoteTag && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-dim text-purple-lt font-medium">
            {post.quoteTag}
          </span>
        )}
      </div>
    </div>
  )
}

function BlogCard({ post, translated }: { post: Post; translated: boolean }) {
  const title = translated
    ? (EN_TRANSLATIONS[post.blogTitle ?? ''] ?? post.blogTitle)
    : post.blogTitle
  return (
    <div className="mx-4 mb-3 rounded-lg bg-surface2 border border-border overflow-hidden">
      <div className="p-3.5">
        <div className="flex items-center gap-2 mb-2">
          {post.blogTag && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow/10 text-yellow font-medium">
              {post.blogTag}
            </span>
          )}
          {post.blogReadTime && (
            <span className="text-[10px] text-muted flex items-center gap-1">
              <BookOpen size={11} />
              {post.blogReadTime}
            </span>
          )}
          {translated && (
            <span className="text-[10px] text-yellow ml-auto">🇬🇧 EN</span>
          )}
        </div>
        <h3 className="font-serif text-base font-semibold text-text leading-snug mb-1.5">{title}</h3>
        <p className="text-xs text-muted leading-relaxed line-clamp-2">{post.blogExcerpt}</p>
      </div>
    </div>
  )
}

export default function PostCard({ post, onOpen }: Props) {
  const [liked, setLiked] = useState(post.liked ?? false)
  const [translated, setTranslated] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showZen, setShowZen] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const isReadable = post.type === 'blog' || post.type === 'quote'

  const content = {
    image: <ImageCard post={post} translated={translated} />,
    music: <MusicCard post={post} />,
    video: <VideoCard post={post} />,
    quote: <QuoteCard post={post} translated={translated} />,
    blog: <BlogCard post={post} translated={translated} />,
  }[post.type]

  return (
    <>
      <article
        className="bg-surface border-b border-border/60 animate-fade-up cursor-pointer"
        onClick={() => onOpen?.(post.id)}
      >
        <CardHeader
          post={post}
          onMenu={() => setShowMenu(true)}
          translated={translated}
          onTranslate={() => setTranslated(t => !t)}
        />
        <div onClick={e => e.stopPropagation()}>{content}</div>
        <CardActions
          post={post}
          liked={liked}
          onLike={() => setLiked(l => !l)}
          onShare={() => setShowShare(true)}
          onZen={isReadable ? () => setShowZen(true) : undefined}
        />
      </article>

      {showShare && (
        <ShareSheet onClose={() => setShowShare(false)} postAuthor={post.author} />
      )}
      {showZen && (
        <ZenMode post={post} onClose={() => setShowZen(false)} />
      )}
      {showMenu && (
        <PostMenu
          author={post.author}
          onClose={() => setShowMenu(false)}
          onDismiss={() => setDismissed(true)}
        />
      )}
    </>
  )
}
