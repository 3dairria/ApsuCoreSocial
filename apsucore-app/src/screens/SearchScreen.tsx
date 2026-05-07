import { useState } from 'react'
import { Search, X, CheckCircle2 } from 'lucide-react'
import { CREATORS, CATEGORIES } from '../lib/data'
import { trpc } from '../lib/trpc'
import type { Screen } from '../lib/types'

interface Props {
  onNav: (screen: Screen) => void
}

const POPULAR_CHIPS = ['AI Beeld', 'Ambient muziek', 'Korte film', 'Filosofie', 'Poëzie', 'Generatief']

function Avatar({ color, initial, size = 40 }: { color: string; initial: string; size?: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
      style={{ width: size, height: size, background: color, fontSize: size * 0.38 }}
    >
      {initial}
    </div>
  )
}

function fmt(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n)
}

export default function SearchScreen({ onNav }: Props) {
  const [query, setQuery] = useState('')
  const debouncedQuery = query.trim()

  const { data: apiResults, isLoading } = trpc.users.search.useQuery(
    { q: debouncedQuery },
    { enabled: debouncedQuery.length >= 2 },
  )

  // Fall back to local creators when API has no results
  const localFiltered = debouncedQuery.length > 0
    ? CREATORS.filter(c =>
        c.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        c.handle.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        c.tags.some(t => t.toLowerCase().includes(debouncedQuery.toLowerCase()))
      )
    : []

  const results = (apiResults && apiResults.length > 0) ? apiResults : null
  const showEmpty = debouncedQuery.length >= 2 && !isLoading && (results?.length ?? 0) === 0 && localFiltered.length === 0

  return (
    <div className="animate-fade-up">
      {/* Search bar */}
      <div className="sticky top-0 bg-bg px-4 py-3 z-10">
        <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 h-11">
          <Search size={16} className="text-muted flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Zoek creators, tags, posts…"
            className="flex-1 bg-transparent text-sm text-text placeholder:text-muted outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')}>
              <X size={15} className="text-muted" />
            </button>
          )}
        </div>
      </div>

      {/* Before typing: popular chips + categories */}
      {!query && (
        <>
          <section className="px-4 pb-4">
            <h2 className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">Populaire zoekopdrachten</h2>
            <div className="flex flex-wrap gap-2">
              {POPULAR_CHIPS.map(chip => (
                <button
                  key={chip}
                  onClick={() => setQuery(chip)}
                  className="text-xs px-3 py-1.5 rounded-full bg-surface border border-border text-muted hover:text-text hover:border-purple transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </section>

          <section className="px-4">
            <h2 className="text-xs font-semibold text-muted uppercase tracking-widest mb-3">Blader per categorie</h2>
            <div className="grid grid-cols-2 gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  className="flex items-center gap-2.5 p-3 rounded-lg bg-surface border border-border active:scale-95 transition-transform"
                >
                  <span className="text-xl">{cat.emoji}</span>
                  <span className="text-sm font-medium text-text">{cat.label}</span>
                </button>
              ))}
            </div>
          </section>
        </>
      )}

      {/* Loading skeleton */}
      {isLoading && debouncedQuery.length >= 2 && (
        <div className="divide-y divide-border/60">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3">
              <div className="skeleton w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <div className="skeleton h-3.5 w-28 rounded" />
                <div className="skeleton h-3 w-20 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* API results */}
      {results && results.length > 0 && (
        <div className="divide-y divide-border/60">
          {results.map(user => (
            <button
              key={user.id}
              onClick={() => onNav('creator-profile')}
              className="w-full flex items-center gap-3 px-4 py-3 active:bg-surface transition-colors"
            >
              <Avatar color={user.avatarColor} initial={user.name[0]} />
              <div className="flex-1 text-left min-w-0">
                <span className="text-sm font-medium text-text">{user.name}</span>
                <p className="text-xs text-muted">@{user.handle} · {fmt(user.followerCount)} volgers</p>
              </div>
              <span className="text-[11px] px-3 py-1 rounded-full border border-purple/50 text-purple-lt flex-shrink-0">
                Volgen
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Local fallback results */}
      {!results && localFiltered.length > 0 && (
        <div className="divide-y divide-border/60">
          {localFiltered.map(creator => (
            <button
              key={creator.id}
              onClick={() => onNav('creator-profile')}
              className="w-full flex items-center gap-3 px-4 py-3 active:bg-surface transition-colors"
            >
              <Avatar color={creator.avatarColor} initial={creator.name[0]} />
              <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-medium text-text">{creator.name}</span>
                  {creator.verified && <CheckCircle2 size={13} className="text-purple-lt" />}
                </div>
                <p className="text-xs text-muted">{creator.handle} · {creator.followers} volgers</p>
              </div>
              <span className="text-[11px] px-3 py-1 rounded-full border border-purple/50 text-purple-lt flex-shrink-0">
                Volgen
              </span>
            </button>
          ))}
        </div>
      )}

      {showEmpty && (
        <div className="flex flex-col items-center justify-center pt-20 gap-3 px-8 text-center">
          <span className="text-4xl">🔍</span>
          <p className="text-sm font-medium text-text">Geen resultaten voor "{query}"</p>
          <p className="text-xs text-muted">Probeer een andere naam of tag</p>
        </div>
      )}
    </div>
  )
}
