import { useState } from 'react'
import { X, CheckCircle2 } from 'lucide-react'
import { CREATORS } from '../../lib/data'

interface Props {
  mode: 'volgers' | 'volgend'
  onClose: () => void
}

export default function FollowersModal({ mode, onClose }: Props) {
  const [following, setFollowing] = useState<Record<string, boolean>>({})

  const people = [...CREATORS, {
    id: 'extra1', name: 'Mira Blau', handle: '@mirablau', avatar: '', avatarColor: '#4a60c0',
    bio: '', followers: '3.4K', verified: false, tags: [],
  }, {
    id: 'extra2', name: 'Orion Zwart', handle: '@orionzwart', avatar: '', avatarColor: '#c04a8a',
    bio: '', followers: '890', verified: false, tags: [],
  }]

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet-panel" style={{ height: '75dvh', display: 'flex', flexDirection: 'column' }}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-9 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
          <span className="text-sm font-semibold text-text">
            {mode === 'volgers' ? 'Volgers' : 'Volgend'} · {people.length}
          </span>
          <button type="button" onClick={onClose} className="text-muted">
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/60">
          {people.map(person => {
            const isFollowing = following[person.id] ?? false
            return (
              <div key={person.id} className="flex items-center gap-3 px-4 py-3.5">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
                  style={{ background: person.avatarColor }}
                >
                  {person.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-text truncate">{person.name}</span>
                    {person.verified && <CheckCircle2 size={13} className="text-purple-lt flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted">{person.handle} · {person.followers} volgers</p>
                </div>
                <button
                  type="button"
                  onClick={() => setFollowing(prev => ({ ...prev, [person.id]: !isFollowing }))}
                  className={`flex-shrink-0 text-xs px-3.5 py-1.5 rounded-full font-medium transition-all active:scale-95 ${
                    isFollowing
                      ? 'bg-surface border border-border text-muted'
                      : 'bg-purple text-white'
                  }`}
                >
                  {isFollowing ? 'Volgend' : 'Volgen'}
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
