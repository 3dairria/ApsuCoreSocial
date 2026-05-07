import { useState } from 'react'
import { Heart, MessageCircle, UserPlus, AtSign } from 'lucide-react'
import { trpc } from '../lib/trpc'
import { NOTIFICATIONS } from '../lib/data'

const ACTIVITY_TABS = ['Alles', 'Likes', 'Reacties', 'Volgers'] as const
type Tab = (typeof ACTIVITY_TABS)[number]
type NotifType = 'like' | 'comment' | 'follow' | 'mention'

function NotifIcon({ type }: { type: NotifType }) {
  const map: Record<NotifType, { icon: typeof Heart; bg: string; color: string }> = {
    like:    { icon: Heart,         bg: 'bg-red-500/20',    color: 'text-red-400' },
    comment: { icon: MessageCircle, bg: 'bg-blue-500/20',   color: 'text-blue-400' },
    follow:  { icon: UserPlus,      bg: 'bg-purple/20',     color: 'text-purple-lt' },
    mention: { icon: AtSign,        bg: 'bg-yellow/20',     color: 'text-yellow' },
  }
  const { icon: Icon, bg, color } = map[type]
  return (
    <div className={`w-7 h-7 rounded-full ${bg} flex items-center justify-center flex-shrink-0`}>
      <Icon size={14} className={color} />
    </div>
  )
}

function timeAgo(date: string | Date) {
  const diff = (Date.now() - new Date(date).getTime()) / 60000
  if (diff < 60) return `${Math.floor(diff)}m`
  if (diff < 1440) return `${Math.floor(diff / 60)}u`
  return `${Math.floor(diff / 1440)}d`
}

function notifText(type: NotifType) {
  if (type === 'like') return 'heeft je post geliked'
  if (type === 'comment') return 'heeft gereageerd op je post'
  if (type === 'follow') return 'volgt je nu'
  return 'heeft je vermeld'
}

export default function ActivityScreen() {
  const [activeTab, setActiveTab] = useState<Tab>('Alles')
  const { data: apiNotifs, isLoading } = trpc.notifications.list.useQuery()
  const markAllRead = trpc.notifications.markAllRead.useMutation()
  const utils = trpc.useUtils()

  function handleMarkRead() {
    markAllRead.mutate(undefined, {
      onSuccess: () => void utils.notifications.list.invalidate(),
    })
  }

  // Merge API + local fallback
  const apiItems = apiNotifs?.map(n => ({
    id: n.id,
    type: n.type as NotifType,
    actor: n.actor.name,
    avatarColor: n.actor.avatarColor,
    text: notifText(n.type as NotifType),
    time: timeAgo(n.createdAt),
    unread: !n.read,
    postThumb: n.postImageUrl ?? undefined,
  }))

  const localItems = NOTIFICATIONS.map(n => ({
    id: n.id,
    type: n.type as NotifType,
    actor: n.actor,
    avatarColor: n.avatarColor,
    text: n.text,
    time: n.time,
    unread: !!n.unread,
    postThumb: n.postThumb,
  }))

  const allItems = apiItems && apiItems.length > 0 ? apiItems : localItems

  const filtered = allItems.filter(n => {
    if (activeTab === 'Alles') return true
    if (activeTab === 'Likes') return n.type === 'like'
    if (activeTab === 'Reacties') return n.type === 'comment' || n.type === 'mention'
    if (activeTab === 'Volgers') return n.type === 'follow'
    return true
  })

  const unreadCount = allItems.filter(n => n.unread).length

  return (
    <div className="animate-fade-up">
      {/* Tabs + mark all read */}
      <div className="flex items-center gap-2 px-4 py-3 overflow-x-auto hide-scrollbar">
        <div className="flex gap-2 flex-1">
          {ACTIVITY_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 text-xs px-3.5 py-1.5 rounded-full font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-purple text-white'
                  : 'bg-surface border border-border text-muted'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkRead}
            className="flex-shrink-0 text-[11px] text-purple-lt"
          >
            Alles gelezen
          </button>
        )}
      </div>

      {/* Skeleton */}
      {isLoading && (
        <div className="divide-y divide-border/60">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5">
              <div className="skeleton w-10 h-10 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <div className="skeleton h-3.5 w-48 rounded" />
                <div className="skeleton h-3 w-16 rounded" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Notification list */}
      {!isLoading && (
        <div className="divide-y divide-border/60">
          {filtered.map(notif => (
            <div
              key={notif.id}
              className={`flex items-center gap-3 px-4 py-3.5 ${notif.unread ? 'bg-purple-dim/10' : ''}`}
            >
              <div className="relative flex-shrink-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
                  style={{ background: notif.avatarColor }}
                >
                  {notif.actor[0]}
                </div>
                <div className="absolute -bottom-1 -right-1">
                  <NotifIcon type={notif.type} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm text-text leading-snug">
                  <span className="font-semibold">{notif.actor}</span>{' '}
                  <span className="text-muted">{notif.text}</span>
                </p>
                <p className="text-[11px] text-muted2 mt-0.5">{notif.time}</p>
              </div>

              {notif.postThumb ? (
                <img src={notif.postThumb} alt="" className="w-11 h-11 rounded-md object-cover flex-shrink-0" />
              ) : notif.type === 'follow' ? (
                <button type="button" className="text-[11px] px-3 py-1.5 rounded-full border border-purple text-purple-lt font-medium flex-shrink-0">
                  Volg terug
                </button>
              ) : null}

              {notif.unread && (
                <div className="w-2 h-2 rounded-full bg-purple-lt flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center pt-20 gap-3">
          <span className="text-4xl">🔔</span>
          <p className="text-sm text-muted">Geen {activeTab.toLowerCase()} activiteit</p>
        </div>
      )}
    </div>
  )
}
