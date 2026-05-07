import { Home, Compass, PlusSquare, MessageCircle, Bell } from 'lucide-react'
import type { Screen } from '../../lib/types'

interface Props {
  active: Screen
  onNav: (screen: Screen) => void
  unreadChat?: number
  unreadActivity?: number
}

const tabs: { id: Screen; icon: typeof Home; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'discover', icon: Compass, label: 'Ontdekken' },
  { id: 'compose', icon: PlusSquare, label: 'Maak' },
  { id: 'chat', icon: MessageCircle, label: 'Chat' },
  { id: 'activity', icon: Bell, label: 'Activiteit' },
]

export default function BottomNav({ active, onNav, unreadChat = 0, unreadActivity = 0 }: Props) {
  function getBadge(id: Screen) {
    if (id === 'chat') return unreadChat
    if (id === 'activity') return unreadActivity
    return 0
  }

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-surface border-t border-border z-30 safe-bottom">
      <div className="flex items-center justify-around h-14">
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = active === id
          const isCompose = id === 'compose'
          const badge = getBadge(id)

          if (isCompose) {
            return (
              <button
                key={id}
                onClick={() => onNav(id)}
                className="flex items-center justify-center w-11 h-11 rounded-xl bg-purple shadow-fab active:scale-95 transition-transform"
                aria-label={label}
              >
                <Icon size={22} color="white" strokeWidth={2} />
              </button>
            )
          }

          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              className="relative flex flex-col items-center justify-center gap-0.5 flex-1 h-full"
              aria-label={label}
            >
              <Icon
                size={22}
                strokeWidth={isActive ? 2.5 : 1.75}
                className={isActive ? 'text-purple-lt' : 'text-muted'}
              />
              {isActive && (
                <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-purple-lt" />
              )}
              {badge > 0 && (
                <span className="absolute top-1.5 right-[calc(50%-14px)] min-w-[16px] h-4 px-1 rounded-full bg-purple text-white text-[10px] font-semibold flex items-center justify-center">
                  {badge > 9 ? '9+' : badge}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
