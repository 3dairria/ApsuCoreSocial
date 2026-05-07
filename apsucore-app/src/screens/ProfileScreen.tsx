import { useState } from 'react'
import { Settings, Grid3X3, BookOpen, Heart } from 'lucide-react'
import { POSTS } from '../lib/data'
import { trpc } from '../lib/trpc'
import type { Screen } from '../lib/types'
import FollowersModal from '../components/ui/FollowersModal'

interface Props {
  onNav: (screen: Screen) => void
}

const PROFILE_TABS = ['Posts', 'Collecties', 'Geliked'] as const

function fmt(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`
  return String(n)
}

export default function ProfileScreen({ onNav }: Props) {
  const [activeTab, setActiveTab] = useState<(typeof PROFILE_TABS)[number]>('Posts')
  const [followModal, setFollowModal] = useState<'volgers' | 'volgend' | null>(null)

  const { data: me } = trpc.users.me.useQuery()

  const name = me?.name ?? 'Jouw Naam'
  const handle = me?.handle ?? 'jouwnaam'
  const bio = me?.bio ?? 'AI creator Â· Generatieve beelden & verhalen âœ¨'
  const avatarColor = me?.avatarColor ?? '#7C3AED'
  const followerCount = fmt(me?.followerCount ?? 1200)
  const followingCount = fmt(me?.followingCount ?? 318)
  const postCount = fmt(me?.postCount ?? 24)

  const myPosts = POSTS.filter(p => p.type === 'image' || p.type === 'video')

  return (
    <div className="animate-fade-up">
      {/* Cover */}
      <div
        className="h-32 relative"
        style={{ background: 'linear-gradient(135deg, #3b1f6e, #7C3AED, #D4A843)' }}
      >
        <button
          onClick={() => onNav('settings')}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center"
        >
          <Settings size={16} className="text-white" />
        </button>
      </div>

      {/* Avatar + info */}
      <div className="px-4 pb-4 -mt-8">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-semibold mb-3"
          style={{ background: avatarColor, border: '3px solid #0c0c0e' }}
        >
          {name[0]}
        </div>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-lg font-semibold text-text">{name}</h1>
            <p className="text-sm text-muted">@{handle}</p>
            {bio && (
              <p className="text-sm text-text/80 mt-1.5 leading-snug max-w-[220px]">{bio}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onNav('edit-profile')}
            className="px-4 py-2 rounded-full text-xs font-semibold bg-surface border border-border text-text"
          >
            Bewerken
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-4">
          {[
            { label: 'Posts', value: postCount, modal: null },
            { label: 'Volgers', value: followerCount, modal: 'volgers' as const },
            { label: 'Volgend', value: followingCount, modal: 'volgend' as const },
          ].map(stat => (
            <button
              type="button"
              key={stat.label}
              className="text-center"
              onClick={() => stat.modal && setFollowModal(stat.modal)}
            >
              <p className="text-base font-bold text-text">{stat.value}</p>
              <p className="text-xs text-muted">{stat.label}</p>
            </button>
          ))}
        </div>
      </div>

      {followModal && (
        <FollowersModal mode={followModal} onClose={() => setFollowModal(null)} />
      )}

      {/* Tabs */}
      <div className="flex border-b border-border">
        {PROFILE_TABS.map((tab, i) => {
          const icons = [Grid3X3, BookOpen, Heart]
          const Icon = icons[i]
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium relative transition-colors ${
                activeTab === tab ? 'text-text' : 'text-muted'
              }`}
            >
              <Icon size={14} />
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-purple-lt" />
              )}
            </button>
          )
        })}
      </div>

      {/* Grid */}
      {activeTab === 'Posts' && (
        <div className="grid grid-cols-3 gap-0.5 mt-0.5">
          {myPosts.map(post => (
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

      {activeTab !== 'Posts' && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <span className="text-4xl">{activeTab === 'Collecties' ? 'ðŸ“' : 'â¤ï¸'}</span>
          <p className="text-sm text-muted">{activeTab} zijn leeg</p>
        </div>
      )}
    </div>
  )
}
