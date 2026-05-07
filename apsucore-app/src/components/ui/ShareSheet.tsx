import { Link2, MessageCircle, AtSign, ExternalLink, X } from 'lucide-react'
import { useToast } from '../../lib/toast'

interface Props {
  onClose: () => void
  postAuthor?: string
}

const SHARE_OPTIONS = [
  { id: 'copy', icon: Link2, label: 'Link kopiëren', color: '#7C3AED' },
  { id: 'dm', icon: MessageCircle, label: 'Stuur via DM', color: '#9D5FF5' },
  { id: 'twitter', icon: AtSign, label: 'Deel op X', color: '#1d9bf0' },
  { id: 'external', icon: ExternalLink, label: 'Meer opties', color: '#4a60c0' },
]

export default function ShareSheet({ onClose, postAuthor }: Props) {
  const { showToast } = useToast()

  function handleShare(id: string) {
    if (id === 'copy') {
      showToast('Link gekopieerd naar klembord')
    } else if (id === 'dm') {
      showToast(`Stuur naar een vriend via DM`)
    } else {
      showToast('Openen in externe app…')
    }
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="sheet-backdrop"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="sheet-panel pb-8">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full bg-border" />
        </div>

        <div className="px-4 pt-3 pb-1">
          <p className="text-xs text-muted text-center mb-4">
            Deel {postAuthor ? `post van ${postAuthor}` : 'deze post'}
          </p>

          <div className="grid grid-cols-4 gap-3 mb-5">
            {SHARE_OPTIONS.map(opt => {
              const Icon = opt.icon
              return (
                <button
                  key={opt.id}
                  onClick={() => handleShare(opt.id)}
                  className="flex flex-col items-center gap-2 active:scale-90 transition-transform"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: opt.color + '22' }}
                  >
                    <Icon size={22} style={{ color: opt.color }} strokeWidth={1.75} />
                  </div>
                  <span className="text-[10px] text-muted text-center leading-tight">{opt.label}</span>
                </button>
              )
            })}
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-surface2 text-sm font-medium text-muted active:opacity-70 transition-opacity"
          >
            Annuleren
          </button>
        </div>
      </div>
    </>
  )
}
