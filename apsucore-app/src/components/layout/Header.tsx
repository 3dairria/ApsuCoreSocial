import { Search, Settings } from 'lucide-react'
import type { Screen } from '../../lib/types'

interface Props {
  onNav: (screen: Screen) => void
}

export default function Header({ onNav }: Props) {
  return (
    <header className="flex items-center justify-between px-4 pt-3 pb-2 bg-bg sticky top-0 z-20">
      <button onClick={() => onNav('profile')} className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #9D5FF5)' }}
        >
          J
        </div>
      </button>

      <button className="flex items-center gap-1" onClick={() => onNav('home')}>
        <span
          className="font-serif text-xl font-semibold"
          style={{
            background: 'linear-gradient(135deg, #9D5FF5, #D4A843)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          ApsuCore
        </span>
      </button>

      <div className="flex items-center gap-3">
        <button onClick={() => onNav('search')} className="text-muted hover:text-text transition-colors">
          <Search size={20} strokeWidth={1.75} />
        </button>
        <button onClick={() => onNav('settings')} className="text-muted hover:text-text transition-colors">
          <Settings size={20} strokeWidth={1.75} />
        </button>
      </div>
    </header>
  )
}
