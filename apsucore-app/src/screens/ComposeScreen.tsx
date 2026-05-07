import { useState } from 'react'
import { Image, Music2, Video, Quote, BookOpen, X, Send } from 'lucide-react'
import { trpc } from '../lib/trpc'
import { getUser } from '../lib/auth'
import type { Screen } from '../lib/types'

interface Props {
  onNav: (screen: Screen) => void
}

type ComposeType = 'image' | 'music' | 'video' | 'quote' | 'blog'

const TYPE_OPTIONS: { type: ComposeType; icon: typeof Image; label: string; color: string }[] = [
  { type: 'image', icon: Image, label: 'Beeld', color: '#7C3AED' },
  { type: 'music', icon: Music2, label: 'Muziek', color: '#D4A843' },
  { type: 'video', icon: Video, label: 'Video', color: '#1e6e4e' },
  { type: 'quote', icon: Quote, label: 'Citaat', color: '#9D5FF5' },
  { type: 'blog', icon: BookOpen, label: 'Blog', color: '#4a60c0' },
]

const TITLE_PLACEHOLDER: Partial<Record<ComposeType, string>> = {
  blog: 'Titel van je blog…',
  music: 'Naam van het nummer…',
  video: 'Titel van de video…',
  quote: 'Bron van het citaat (optioneel)…',
}

const TEXT_PLACEHOLDER: Record<ComposeType, string> = {
  image: 'Voeg een beschrijving toe…',
  music: 'Voeg een beschrijving toe…',
  video: 'Voeg een beschrijving toe…',
  quote: 'Typ je citaat hier…',
  blog: 'Schrijf je blog post…',
}

export default function ComposeScreen({ onNav }: Props) {
  const user = getUser()
  const [selectedType, setSelectedType] = useState<ComposeType>('image')
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const [published, setPublished] = useState(false)

  const utils = trpc.useUtils()
  const createPost = trpc.posts.create.useMutation({
    onSuccess: async () => {
      await utils.posts.list.invalidate()
      setPublished(true)
      setTimeout(() => onNav('home'), 1000)
    },
  })

  const hasTitle = selectedType in TITLE_PLACEHOLDER
  const canPublish = selectedType === 'quote'
    ? text.trim().length > 0
    : selectedType === 'blog'
    ? title.trim().length > 0 && text.trim().length > 0
    : text.trim().length > 0

  async function handlePublish() {
    if (!canPublish || createPost.isPending) return
    const input: Parameters<typeof createPost.mutate>[0] = { type: selectedType }
    if (selectedType === 'quote') {
      input.quoteText = text.trim()
      if (title.trim()) input.quoteSource = title.trim()
    } else if (selectedType === 'blog') {
      input.blogTitle = title.trim()
      input.blogExcerpt = text.trim()
    } else if (selectedType === 'music') {
      input.caption = text.trim()
      if (title.trim()) input.trackTitle = title.trim()
    } else if (selectedType === 'video') {
      input.caption = text.trim()
      if (title.trim()) input.videoTitle = title.trim()
    } else {
      input.caption = text.trim()
    }
    createPost.mutate(input)
  }

  const initials = user?.name?.charAt(0).toUpperCase() ?? 'J'
  const avatarColor = user?.avatarColor ?? '#7C3AED'

  if (published) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 animate-fade-up">
        <span className="text-5xl">✅</span>
        <p className="text-base font-medium text-text">Gepubliceerd!</p>
      </div>
    )
  }

  return (
    <div className="animate-fade-up">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <button onClick={() => onNav('home')} className="text-muted">
          <X size={20} strokeWidth={1.75} />
        </button>
        <span className="text-sm font-semibold text-text">Nieuwe post</span>
        <button
          onClick={() => void handlePublish()}
          disabled={!canPublish || createPost.isPending}
          className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-1.5 rounded-full transition-all ${
            canPublish && !createPost.isPending
              ? 'bg-purple text-white active:scale-95'
              : 'bg-surface text-muted cursor-not-allowed'
          }`}
        >
          <Send size={14} />
          {createPost.isPending ? 'Bezig…' : 'Publiceer'}
        </button>
      </div>

      {/* Type selector */}
      <div className="flex gap-2 px-4 py-3 overflow-x-auto hide-scrollbar">
        {TYPE_OPTIONS.map(opt => {
          const Icon = opt.icon
          const active = selectedType === opt.type
          return (
            <button
              key={opt.type}
              onClick={() => { setSelectedType(opt.type); setTitle(''); setText('') }}
              className={`flex items-center gap-1.5 flex-shrink-0 text-xs px-3 py-2 rounded-full border font-medium transition-all ${
                active ? 'text-white border-transparent' : 'text-muted border-border bg-surface'
              }`}
              style={active ? { background: opt.color, borderColor: opt.color } : {}}
            >
              <Icon size={13} />
              {opt.label}
            </button>
          )
        })}
      </div>

      {/* Composer area */}
      <div className="px-4 pt-2">
        <div className="flex gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 mt-1"
            style={{ background: `linear-gradient(135deg, ${avatarColor}, ${avatarColor}cc)` }}
          >
            {initials}
          </div>
          <div className="flex-1 space-y-2">
            {hasTitle && (
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder={TITLE_PLACEHOLDER[selectedType]}
                maxLength={200}
                className="w-full bg-transparent text-sm font-medium text-text placeholder:text-muted outline-none border-b border-border/50 pb-2"
              />
            )}
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={TEXT_PLACEHOLDER[selectedType]}
              rows={6}
              maxLength={500}
              className="w-full bg-transparent text-sm text-text placeholder:text-muted outline-none resize-none leading-relaxed font-serif"
            />
          </div>
        </div>

        {/* Upload area (image/video/music) — UI only, no file upload in MVP */}
        {(selectedType === 'image' || selectedType === 'video' || selectedType === 'music') && (
          <button className="mt-4 w-full bg-surface border border-dashed border-border rounded-xl py-8 flex flex-col items-center gap-2 text-muted active:border-purple transition-colors">
            {selectedType === 'image' && <Image size={28} strokeWidth={1.5} />}
            {selectedType === 'video' && <Video size={28} strokeWidth={1.5} />}
            {selectedType === 'music' && <Music2 size={28} strokeWidth={1.5} />}
            <span className="text-xs">Bestand toevoegen (binnenkort)</span>
          </button>
        )}
      </div>

      {/* Error */}
      {createPost.isError && (
        <p className="mx-4 mt-3 text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {createPost.error.message}
        </p>
      )}

      {/* Char count */}
      <div className="px-4 pt-4 flex justify-end">
        <span className={`text-xs ${text.length > 450 ? 'text-yellow' : 'text-muted2'}`}>
          {text.length}/500
        </span>
      </div>
    </div>
  )
}
