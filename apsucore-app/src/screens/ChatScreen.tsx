import { Search, Edit3 } from 'lucide-react'
import { CHAT_ITEMS } from '../lib/data'
import type { Screen } from '../lib/types'

interface Props {
  onNav: (screen: Screen) => void
}

export default function ChatScreen({ onNav }: Props) {
  return (
    <div className="animate-fade-up">
      {/* Header row */}
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-lg font-semibold text-text">Berichten</h1>
        <button className="text-muted">
          <Edit3 size={18} strokeWidth={1.75} />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 mb-3">
        <div className="flex items-center gap-2 bg-surface border border-border rounded-xl px-3 h-10">
          <Search size={14} className="text-muted flex-shrink-0" />
          <input
            type="text"
            placeholder="Zoek gesprekken…"
            className="flex-1 bg-transparent text-sm text-text placeholder:text-muted outline-none"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="divide-y divide-border/60">
        {CHAT_ITEMS.map(chat => (
          <button
            key={chat.id}
            onClick={() => onNav('chat-detail')}
            className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-surface transition-colors"
          >
            <div className="relative flex-shrink-0">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold"
                style={{ background: chat.avatarColor }}
              >
                {chat.name[0]}
              </div>
              {/* Online indicator */}
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-bg" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="flex items-baseline justify-between">
                <span className={`text-sm ${chat.unread ? 'font-semibold text-text' : 'font-medium text-text/80'}`}>
                  {chat.name}
                </span>
                <span className="text-[11px] text-muted ml-2 flex-shrink-0">{chat.time}</span>
              </div>
              <p className={`text-xs mt-0.5 truncate ${chat.unread ? 'text-text/70' : 'text-muted'}`}>
                {chat.lastMsg}
              </p>
            </div>
            {chat.unread && (
              <div className="w-5 h-5 rounded-full bg-purple flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] text-white font-bold">{chat.unread}</span>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
