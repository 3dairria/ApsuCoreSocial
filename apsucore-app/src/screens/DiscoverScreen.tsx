import { useState } from 'react'
import { TrendingUp, ChevronRight } from 'lucide-react'
import { CONTENT_TYPES, INTEREST_CATEGORIES, CREATORS, POSTS } from '../lib/data'
import type { Screen } from '../lib/types'
import CategoryFeed from '../components/ui/CategoryFeed'

interface Props {
  onNav: (screen: Screen) => void
}

function Avatar({ color, initial, size = 44 }: { color: string; initial: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}
    >
      {initial}
    </div>
  )
}

export default function DiscoverScreen({ onNav }: Props) {
  const [contentType, setContentType] = useState('all')
  const [interestCat, setInterestCat] = useState<string | null>(null)
  const [activeFeedCat, setActiveFeedCat] = useState<typeof INTEREST_CATEGORIES[0] | null>(null)

  const trendingPosts = POSTS.filter(p => p.type === 'image' || p.type === 'video').slice(0, 4)

  return (
    <>
      {activeFeedCat && (
        <CategoryFeed
          category={activeFeedCat}
          onClose={() => setActiveFeedCat(null)}
          onNav={onNav}
        />
      )}

      <div className="pb-6 animate-fade-up">

        {/* Laag 1 â€” Content Type Pills */}
        <div className="flex gap-2 px-4 pt-4 pb-1 overflow-x-auto hide-scrollbar">
          {CONTENT_TYPES.map(ct => (
            <button
              key={ct.id}
              onClick={() => setContentType(ct.id)}
              className={`flex-shrink-0 text-xs px-3.5 py-1.5 rounded-full font-medium transition-all ${
                contentType === ct.id
                  ? 'bg-purple text-white'
                  : 'bg-surface border border-border text-muted'
              }`}
            >
              {ct.label}
            </button>
          ))}
        </div>

        {/* Laag 2 â€” Interesse-categorieÃ«n */}
        <div className="flex gap-2 px-4 pt-2 pb-3 overflow-x-auto hide-scrollbar border-b border-border">
          <button
            onClick={() => setInterestCat(null)}
            className={`flex-shrink-0 text-xs px-3 py-1 rounded-full font-medium transition-all ${
              interestCat === null
                ? 'bg-surface2 border border-purple text-purple-lt'
                : 'text-muted2'
            }`}
          >
            Alles
          </button>
          {INTEREST_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setInterestCat(prev => prev === cat.id ? null : cat.id)}
              className={`flex-shrink-0 flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium transition-all ${
                interestCat === cat.id
                  ? 'bg-surface2 border border-purple text-purple-lt'
                  : 'text-muted2'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Active interest filter banner */}
        {interestCat && (() => {
          const cat = INTEREST_CATEGORIES.find(c => c.id === interestCat)!
          return (
            <div
              className="mx-4 mt-3 rounded-xl p-4 flex items-center gap-3 cursor-pointer active:opacity-80"
              style={{ background: cat.color + '22', border: `1px solid ${cat.color}44` }}
              onClick={() => setActiveFeedCat({ id: interestCat, label: cat.label, emoji: cat.emoji, color: cat.color })}
            >
              <span className="text-2xl">{cat.emoji}</span>
              <div>
                <p className="text-sm font-semibold text-text">{cat.label}</p>
                <p className="text-xs text-muted">Tik om posts te bekijken â†’</p>
              </div>
            </div>
          )
        })()}

        {/* Trending */}
        <section className="px-4 pt-5 pb-2">
          <div className="flex items-center gap-1.5 mb-3">
            <TrendingUp size={14} className="text-yellow" />
            <h2 className="text-xs font-semibold text-muted uppercase tracking-widest">Trending</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {trendingPosts.map(post => (
              <button
                key={post.id}
                onClick={() => onNav('post-detail')}
                className="relative aspect-square rounded-lg overflow-hidden bg-surface2 active:opacity-80"
              >
                <img
                  src={post.imageUrl ?? post.videoThumb}
                  alt=""
                  className="w-full h-full object-cover"
                 
                />
                {post.isLive && (
                  <span className="absolute top-2 left-2 flex items-center gap-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-live" />
                    LIVE
                  </span>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                  <p className="text-white text-[11px] font-medium leading-tight line-clamp-2">
                    {post.caption ?? post.videoTitle}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Aanbevolen Creators */}
        <section className="pt-4">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-xs font-semibold text-muted uppercase tracking-widest">Creators om te volgen</h2>
            <button onClick={() => onNav('search')} className="text-purple-lt text-xs flex items-center gap-0.5">
              Meer <ChevronRight size={12} />
            </button>
          </div>
          <div className="flex gap-3 px-4 overflow-x-auto hide-scrollbar pb-1">
            {CREATORS.map(creator => (
              <button
                key={creator.id}
                onClick={() => onNav('creator-profile')}
                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-surface border border-border flex-shrink-0 w-32 active:scale-95 transition-transform"
              >
                <Avatar color={creator.avatarColor} initial={creator.name[0]} size={48} />
                <div className="text-center">
                  <p className="text-xs font-semibold text-text truncate w-full">{creator.name}</p>
                  <p className="text-[10px] text-muted">{creator.followers} volgers</p>
                </div>
                <span className="text-[10px] px-3 py-1 rounded-full border border-purple text-purple-lt font-medium">
                  Volgen
                </span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
