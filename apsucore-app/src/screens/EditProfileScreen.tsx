import { useState, useEffect } from 'react'
import { ArrowLeft, Camera, CheckCircle2 } from 'lucide-react'
import { INTEREST_CATEGORIES } from '../lib/data'
import { useToast } from '../lib/toast'
import { trpc } from '../lib/trpc'

interface Props {
  onBack: () => void
}

export default function EditProfileScreen({ onBack }: Props) {
  const { showToast } = useToast()
  const { data: me } = trpc.users.me.useQuery()
  const updateProfile = trpc.users.updateProfile.useMutation()
  const utils = trpc.useUtils()

  const [name, setName] = useState('')
  const [handle, setHandle] = useState('')
  const [bio, setBio] = useState('')
  const [selectedCats, setSelectedCats] = useState<string[]>(['art', 'philosophy', 'technology'])

  // Populate fields once user data arrives
  useEffect(() => {
    if (me) {
      setName(me.name)
      setHandle(me.handle)
      setBio(me.bio)
    }
  }, [me])

  function toggleCat(id: string) {
    setSelectedCats(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id].slice(0, 5)
    )
  }

  async function handleSave() {
    if (!name.trim()) return
    try {
      await updateProfile.mutateAsync({ name: name.trim(), handle: handle.trim(), bio })
      await utils.users.me.invalidate()
      showToast('Profiel opgeslagen')
      onBack()
    } catch {
      showToast('Opslaan mislukt — probeer opnieuw')
    }
  }

  const saving = updateProfile.isPending

  return (
    <div className="animate-fade-up min-h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border sticky top-0 bg-bg z-10">
        <button type="button" onClick={onBack} className="text-muted">
          <ArrowLeft size={20} strokeWidth={1.75} />
        </button>
        <span className="text-sm font-semibold text-text">Profiel bewerken</span>
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving || !name.trim()}
          className={`text-sm font-semibold transition-opacity ${
            saving || !name.trim() ? 'text-muted' : 'text-purple-lt'
          }`}
        >
          {saving ? 'Opslaan…' : 'Opslaan'}
        </button>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center py-6 border-b border-border">
        <div className="relative">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-semibold"
            style={{ background: me?.avatarColor ?? 'linear-gradient(135deg, #7C3AED, #9D5FF5)' }}
          >
            {name[0] ?? 'J'}
          </div>
          <button
            type="button"
            className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-purple flex items-center justify-center border-2 border-bg"
          >
            <Camera size={13} className="text-white" />
          </button>
        </div>
        <button type="button" className="text-xs text-purple-lt mt-2">
          Foto wijzigen
        </button>
      </div>

      {/* Fields */}
      <div className="px-4 py-4 space-y-5">
        <div>
          <label className="text-xs text-muted uppercase tracking-widest block mb-1.5">Naam</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            maxLength={50}
            placeholder="Jouw naam"
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-purple transition-colors"
          />
        </div>

        <div>
          <label className="text-xs text-muted uppercase tracking-widest block mb-1.5">Gebruikersnaam</label>
          <div className="flex items-center bg-surface border border-border rounded-xl px-4 py-3 focus-within:border-purple transition-colors">
            <span className="text-muted text-sm mr-1">@</span>
            <input
              type="text"
              value={handle}
              onChange={e => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              maxLength={30}
              placeholder="gebruikersnaam"
              className="flex-1 bg-transparent text-sm text-text outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-muted uppercase tracking-widest block mb-1.5">Bio</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            maxLength={160}
            rows={3}
            className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-text outline-none focus:border-purple transition-colors resize-none leading-relaxed"
          />
          <p className="text-[11px] text-muted2 text-right mt-1">{bio.length}/160</p>
        </div>

        {/* Interesses */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs text-muted uppercase tracking-widest">Interesses</label>
            <span className="text-[11px] text-muted2">max. 5</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {INTEREST_CATEGORIES.map(cat => {
              const active = selectedCats.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCat(cat.id)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border font-medium transition-all active:scale-95 ${
                    active
                      ? 'bg-purple-dim/40 border-purple text-purple-lt'
                      : 'border-border text-muted bg-surface'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                  {active && <CheckCircle2 size={11} className="text-purple-lt" />}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
