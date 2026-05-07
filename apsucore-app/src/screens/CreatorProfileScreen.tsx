import { useState } from 'react'
import { ArrowLeft, CheckCircle2, Grid3X3, BookOpen, MoreHorizontal } from 'lucide-react'
import { POSTS, CREATORS } from '../lib/data'
import { trpc } from '../lib/trpc'
import type { Screen } from '../lib/types'

interface Props {
  onNav: (screen: Screen) => void
  onBack: () => void
}

const PROFILE_TABS = ['Posts', 'Over'] as const

export default function CreatorProfileScreen({ onNav, onBack }: Props) {
  const creator = CREATORS[0]
  const [following, setFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState<(typeof PROFILE_TABS)[number]>('Posts')

  const followToggle = trpc.users.followToggle.useMutation()
  const utils = trpc.useUtils()

  function handleFollow() {
    const next = !following
    setFollowing(next)
    followToggle.mutate(
      { targetId: `user_${creator.id}` },
      { onSuccess: () => void utils.users.me.invalidate() },
    )
  }

  const creatorPosts = POSTS.filter(p => p.type === 'image' || p.type === 'video')

  return (
    <div className="animate-fade-up min-h-full">
      {/* Cover */}
      <div
        className="h-36 relative"
        style={{ background: `linear-gradient(135deg, ${creator.avatarColor}88, ${creator.avatarColor})` }}
      >
        <button
          onClick={onBack}
          className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center"
        >
          <ArrowLeft size={17} className="text-white" />
        </button>
        <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center">
          <MoreHorizontal size={17} className="text-white" />
        </button>
      </div>

      {/* Avatar + info */}
      <div className="px-4 pb-4 -mt-9">
        <div className="flex items-end justify-between mb-3">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-semibold"
            style={{ background: creator.avatarColor, border: '3px solid #0c0c0e' }}
          >
            {creator.name[0]}
          </div>
          <div className="flex gap-2 mb-1">
            <button
              type="button"
              onClick={handleFollow}
              className={`px-5 py-2 rounded-full text-xs font-semibold transition-all active:scale-95 ${
                following
                  ? 'bg-surface border border-border text-muted'
                  : 'bg-purple text-white shadow-fab'
              }`}
            >
              {following ? 'Volgend' : 'Volgen'}
            </button>
            <button className="px-4 py-2 rounded-full text-xs font-semibold bg-surface border border-border text-text">
              Bericht
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mb-0.5">
          <h1 className="text-base font-semibold text-text">{creator.name}</h1>
          {creator.verified && <CheckCircle2 size={15} className="text-purple-lt" />}
        </div>
        <p className="text-xs text-muted mb-2">{creator.handle}</p>
        <p className="text-sm text-text/80 leading-snug mb-3">{creator.bio}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {creator.tags.map(tag => (
            <span key={tag} className="text-[11px] px-2.5 py-1 rounded-full bg-surface border border-border text-muted">
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex gap-6">
          {[
            { label: 'Posts', value: '48' },
            { label: 'Volgers', value: creator.followers },
            { label: 'Volgend', value: '212' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className="text-sm font-bold text-text">{s.value}</p>
              <p className="text-[11px] text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border">
        {PROFILE_TABS.map((tab, i) => {
          const icons = [Grid3X3, BookOpen]
          const Icon = icons[i]
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium relative transition-colors ${
                activeTab === tab ? 'text-text' : 'text-muted'
              }`}
            >
              <Icon size={13} />
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-purple-lt" />
              )}
            </button>
          )
        })}
      </div>

      {/* Posts grid */}
      {activeTab === 'Posts' && (
        <div className="grid grid-cols-3 gap-0.5 mt-0.5">
          {creatorPosts.map(post => (
            <button
              key={post.id}
              onClick={() => onNav('post-detail')}
              className="aspect-square relative overflow-hidden bg-surface2 active:opacity-80"
            >
              <img
                src={post.imageUrl ?? post.videoThumb}
                alt=""
                className="w-full h-full object-cover"
               
              />
            </button>
          ))}
        </div>
      )}

      {activeTab === 'Over' && (
        <div className="px-4 py-5 space-y-4">
          <div>
            <p className="text-xs text-muted uppercase tracking-widest mb-2">Over</p>
            <p className="text-sm text-text/80 leading-relaxed">{creator.bio}</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-widest mb-2">Lid sinds</p>
            <p className="text-sm text-text/80">Januari 2024</p>
          </div>
          <div>
            <p className="text-xs text-muted uppercase tracking-widest mb-2">Specialiteiten</p>
            <div className="flex flex-wrap gap-1.5">
              {creator.tags.map(tag => (
                <span key={tag} className="text-xs px-3 py-1 rounded-full bg-purple-dim/40 text-purple-lt">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
