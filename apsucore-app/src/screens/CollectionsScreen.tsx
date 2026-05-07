import { useState } from 'react'
import { ArrowLeft, Plus, Lock, Globe, MoreHorizontal } from 'lucide-react'
import { POSTS } from '../lib/data'
import type { Screen } from '../lib/types'

interface Props {
  onBack: () => void
  onNav: (screen: Screen) => void
}

const BOARDS = [
  { id: 'b1', name: 'Favorieten', count: 12, private: false, color: '#7C3AED', thumb: 'https://picsum.photos/seed/apsu1/200/200' },
  { id: 'b2', name: 'Inspiratie', count: 8, private: false, color: '#D4A843', thumb: 'https://picsum.photos/seed/apsu6/200/200' },
  { id: 'b3', name: 'Muziek mood', count: 5, private: true, color: '#1e6e4e', thumb: '' },
  { id: 'b4', name: 'Video experiments', count: 3, private: false, color: '#4a60c0', thumb: 'https://picsum.photos/seed/apsu4/200/200' },
  { id: 'b5', name: 'Citaten om te bewaren', count: 19, private: true, color: '#c04a8a', thumb: '' },
]

export default function CollectionsScreen({ onBack, onNav }: Props) {
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null)
  const board = BOARDS.find(b => b.id === selectedBoard)

  // Board detail view
  if (board) {
    const boardPosts = POSTS.filter(p => p.type === 'image' || p.type === 'video')
    return (
      <div className="animate-fade-up min-h-full">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-bg z-10">
          <button onClick={() => setSelectedBoard(null)} className="text-muted">
            <ArrowLeft size={20} strokeWidth={1.75} />
          </button>
          <span className="text-sm font-semibold text-text">{board.name}</span>
          <button className="text-muted">
            <MoreHorizontal size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="px-4 py-3 flex items-center gap-2 border-b border-border">
          {board.private
            ? <Lock size={13} className="text-muted" />
            : <Globe size={13} className="text-muted" />}
          <span className="text-xs text-muted">{board.count} items Â· {board.private ? 'PrivÃ©' : 'Openbaar'}</span>
        </div>

        <div className="grid grid-cols-3 gap-0.5 mt-0.5">
          {boardPosts.map(post => (
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
      </div>
    )
  }

  // Board list view
  return (
    <div className="animate-fade-up min-h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button onClick={onBack} className="text-muted">
          <ArrowLeft size={20} strokeWidth={1.75} />
        </button>
        <span className="text-sm font-semibold text-text">Collecties</span>
        <button className="text-purple-lt">
          <Plus size={20} strokeWidth={2} />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4">
        {BOARDS.map(board => (
          <button
            key={board.id}
            onClick={() => setSelectedBoard(board.id)}
            className="rounded-xl overflow-hidden bg-surface border border-border active:scale-95 transition-transform text-left"
          >
            {/* Thumb */}
            <div
              className="aspect-square w-full relative"
              style={{ background: board.thumb ? undefined : board.color + '44' }}
            >
              {board.thumb
                ? <img src={board.thumb} alt="" className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-3xl opacity-40">ðŸ“</div>
              }
              {board.private && (
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
                  <Lock size={11} className="text-white" />
                </div>
              )}
            </div>
            {/* Info */}
            <div className="px-3 py-2.5">
              <p className="text-xs font-semibold text-text truncate">{board.name}</p>
              <p className="text-[11px] text-muted">{board.count} items</p>
            </div>
          </button>
        ))}

        {/* New board */}
        <button className="rounded-xl border border-dashed border-border aspect-square flex flex-col items-center justify-center gap-2 text-muted active:border-purple transition-colors">
          <Plus size={24} strokeWidth={1.5} />
          <span className="text-xs">Nieuw board</span>
        </button>
      </div>
    </div>
  )
}
