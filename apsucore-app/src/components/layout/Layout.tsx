import type { ReactNode } from 'react'
import Header from './Header'
import BottomNav from './BottomNav'
import type { Screen } from '../../lib/types'

interface Props {
  children: ReactNode
  active: Screen
  onNav: (screen: Screen) => void
  showHeader?: boolean
  unreadChat?: number
  unreadActivity?: number
}

export default function Layout({
  children,
  active,
  onNav,
  showHeader = true,
  unreadChat,
  unreadActivity,
}: Props) {
  return (
    <div className="flex flex-col min-h-dvh bg-bg text-text">
      {showHeader && <Header onNav={onNav} />}
      <main className="flex-1 overflow-y-auto pb-20">{children}</main>
      <BottomNav
        active={active}
        onNav={onNav}
        unreadChat={unreadChat}
        unreadActivity={unreadActivity}
      />
    </div>
  )
}
