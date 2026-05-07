import { X } from 'lucide-react'
import { POSTS } from '../../lib/data'
import PostCard from '../post/PostCard'
import type { Screen } from '../../lib/types'

interface Category {
  id: string
  label: string
  emoji: string
  color: string
}

interface Props {
  category: Category
  onClose: () => void
  onNav: (screen: Screen) => void
}

const TYPE_MAP: Record<string, string[]> = {
  cat1: ['image'],
  cat2: ['music'],
  cat3: ['video'],
  cat4: ['blog'],
  cat5: ['quote'],
  cat6: ['quote'],
}

export default function CategoryFeed({ category, onClose, onNav }: Props) {
  const types = TYPE_MAP[category.id] ?? ['image']
  const posts = POSTS.filter(p => types.includes(p.type))

  return (
    <>
      {/* Backdrop */}
      <div className="sheet-backdrop" onClick={onClose} />

      {/* Panel — tall bottom sheet */}
      <div
        className="sheet-panel"
        style={{ height: '90dvh', display: 'flex', flexDirection: 'column' }}
      >
        {/* Handle + header */}
        <div className="flex-shrink-0">
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-9 h-1 rounded-full bg-border" />
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <span className="text-xl">{category.emoji}</span>
              <span className="text-base font-semibold text-text">{category.label}</span>
              <span className="text-xs text-muted">{posts.length} posts</span>
            </div>
            <button onClick={onClose} className="text-muted">
              <X size={20} strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Scrollable posts */}
        <div className="flex-1 overflow-y-auto">
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard key={post.id} post={post} onOpen={(id) => { onClose(); onNav('post-detail', { postId: id }) }} />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <span className="text-4xl">{category.emoji}</span>
              <p className="text-sm text-muted">Nog geen {category.label} posts</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
