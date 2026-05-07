import { useState } from 'react'
import { ChevronRight, CheckCircle2 } from 'lucide-react'

const CATEGORIES = [
  { id: 'beeld', label: 'Beeld', emoji: '🖼️' },
  { id: 'muziek', label: 'Muziek', emoji: '🎵' },
  { id: 'video', label: 'Video', emoji: '🎬' },
  { id: 'blog', label: 'Blog', emoji: '✍️' },
  { id: 'idee', label: 'Idee', emoji: '💡' },
  { id: 'citaat', label: 'Citaat', emoji: '💬' },
]

const STEPS = [
  {
    id: 'welcome',
    emoji: '✨',
    title: 'Welkom bij ApsuCore',
    body: 'Het platform voor AI-creaties. Ontdek, deel en verbind met creators wereldwijd.',
  },
  {
    id: 'categories',
    emoji: '🎨',
    title: 'Wat spreekt jou aan?',
    body: 'Kies de categorieën die je interesseren.',
  },
  {
    id: 'ready',
    emoji: '🚀',
    title: 'Je bent er klaar voor!',
    body: 'Jouw gepersonaliseerde feed staat klaar. Begin met ontdekken.',
  },
]

interface Props {
  onFinish: () => void
}

export default function Onboarding({ onFinish }: Props) {
  const [step, setStep] = useState(0)
  const [selected, setSelected] = useState<string[]>([])

  const current = STEPS[step]
  const isLast = step === STEPS.length - 1
  const isCatStep = current.id === 'categories'

  function toggleCat(id: string) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  function handleNext() {
    if (isLast) {
      localStorage.setItem('apsucore_onboarded', '1')
      onFinish()
    } else {
      setStep(s => s + 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Sheet */}
      <div className="relative w-full max-w-[430px] bg-surface rounded-t-3xl px-6 pt-6 pb-10 animate-slide-up">
        {/* Progress dots */}
        <div className="flex justify-center gap-1.5 mb-8">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-purple-lt' : 'w-2 bg-border'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">{current.emoji}</div>
          <h2 className="font-serif text-2xl font-semibold text-text mb-3">{current.title}</h2>
          <p className="text-sm text-muted leading-relaxed">{current.body}</p>
        </div>

        {/* Category selector */}
        {isCatStep && (
          <div className="grid grid-cols-3 gap-2 mb-8">
            {CATEGORIES.map(cat => {
              const active = selected.includes(cat.id)
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCat(cat.id)}
                  className={`relative flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-all active:scale-95 ${
                    active ? 'border-purple bg-purple-dim/30' : 'border-border bg-surface2'
                  }`}
                >
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="text-xs font-medium text-text">{cat.label}</span>
                  {active && (
                    <div className="absolute top-1.5 right-1.5">
                      <CheckCircle2 size={14} className="text-purple-lt" />
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        )}

        {/* Next button */}
        <button
          onClick={handleNext}
          disabled={isCatStep && selected.length === 0}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl text-sm font-semibold transition-all active:scale-95 ${
            isCatStep && selected.length === 0
              ? 'bg-surface2 text-muted cursor-not-allowed'
              : 'bg-purple text-white shadow-fab-lg'
          }`}
        >
          {isLast ? 'Begin met ontdekken' : 'Volgende'}
          <ChevronRight size={16} />
        </button>

        {/* Skip */}
        {!isLast && (
          <button onClick={handleNext} className="w-full text-center text-xs text-muted2 mt-4 py-1">
            Overslaan
          </button>
        )}
      </div>
    </div>
  )
}
