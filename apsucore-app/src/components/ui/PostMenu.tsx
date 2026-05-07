import { Bookmark, EyeOff, VolumeX, Flag, Trash2, User, X } from 'lucide-react'
import { useToast } from '../../lib/toast'

interface Props {
  author: string
  onClose: () => void
  onDismiss?: () => void
}

export default function PostMenu({ author, onClose, onDismiss }: Props) {
  const { showToast } = useToast()

  function act(msg: string, undo?: () => void) {
    showToast(msg, undo ? { undoLabel: 'Ongedaan', onUndo: undo } : undefined)
    onClose()
  }

  const options = [
    {
      icon: Bookmark,
      label: 'Opslaan in collectie',
      color: 'text-text',
      action: () => act('Opgeslagen in collectie'),
    },
    {
      icon: User,
      label: `Profiel van ${author}`,
      color: 'text-text',
      action: () => onClose(),
    },
    {
      icon: EyeOff,
      label: 'Minder van dit zien',
      color: 'text-text',
      action: () => act('Voorkeur bijgewerkt'),
    },
    {
      icon: VolumeX,
      label: `${author} dempen`,
      color: 'text-red-400',
      action: () => act(`${author} gedempt`, () => showToast(`${author} niet meer gedempt`)),
    },
    {
      icon: Flag,
      label: 'Melden',
      color: 'text-red-400',
      action: () => act('Post gemeld — bedankt'),
    },
    {
      icon: Trash2,
      label: 'Verwijder uit feed',
      color: 'text-red-400',
      action: () => { onDismiss?.(); act('Post verwijderd uit je feed') },
    },
  ]

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose} />
      <div className="sheet-panel pb-8">
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-9 h-1 rounded-full bg-border" />
        </div>

        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="text-sm font-semibold text-text">Post opties</span>
          <button type="button" onClick={onClose} className="text-muted">
            <X size={18} strokeWidth={1.75} />
          </button>
        </div>

        <div className="divide-y divide-border/50">
          {options.map(opt => {
            const Icon = opt.icon
            return (
              <button
                type="button"
                key={opt.label}
                onClick={opt.action}
                className="w-full flex items-center gap-3 px-5 py-4 active:bg-surface/60 transition-colors"
              >
                <Icon size={18} strokeWidth={1.75} className={opt.color} />
                <span className={`text-sm font-medium ${opt.color}`}>{opt.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
