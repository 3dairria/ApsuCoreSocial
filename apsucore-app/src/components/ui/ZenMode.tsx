import { useState } from 'react'
import { X, Minus, Plus, Moon } from 'lucide-react'
import type { Post } from '../../lib/types'

interface Props {
  post: Post
  onClose: () => void
}

const FONT_SIZES = ['text-sm', 'text-base', 'text-lg', 'text-xl']
const FONT_LABELS = ['Klein', 'Normaal', 'Groot', 'XL']

export default function ZenMode({ post, onClose }: Props) {
  const [fontIdx, setFontIdx] = useState(1)

  function smaller() { setFontIdx(i => Math.max(0, i - 1)) }
  function larger() { setFontIdx(i => Math.min(FONT_SIZES.length - 1, i + 1)) }

  const title = post.blogTitle ?? post.quoteText ?? ''
  const body = post.blogExcerpt ?? post.quoteSource ?? ''
  const tag = post.blogTag ?? post.quoteTag

  return (
    <div className="fixed inset-0 z-50 bg-[#08070d] flex flex-col animate-fade-in">
      {/* Controls */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 flex-shrink-0">
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center text-muted"
        >
          <X size={18} strokeWidth={1.75} />
        </button>

        <div className="flex items-center gap-2">
          <Moon size={14} className="text-muted" />
          <span className="text-xs text-muted">Zen</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={smaller}
            disabled={fontIdx === 0}
            className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-muted disabled:opacity-30"
          >
            <Minus size={14} />
          </button>
          <span className="text-xs text-muted2 w-12 text-center">{FONT_LABELS[fontIdx]}</span>
          <button
            onClick={larger}
            disabled={fontIdx === FONT_SIZES.length - 1}
            className="w-8 h-8 rounded-full bg-white/8 flex items-center justify-center text-muted disabled:opacity-30"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pt-8 pb-16">
        {tag && (
          <span className="inline-block text-[11px] px-3 py-1 rounded-full bg-purple-dim/40 text-purple-lt font-medium mb-5">
            {tag}
          </span>
        )}

        <h1
          className={`font-serif font-semibold text-white leading-snug mb-6 transition-all duration-200 ${
            post.type === 'quote' ? 'text-2xl italic' : 'text-xl'
          } ${fontIdx >= 2 ? 'text-2xl' : ''} ${fontIdx === 3 ? 'text-3xl' : ''}`}
        >
          {post.type === 'quote' && (
            <span className="text-purple-lt/60 text-4xl font-serif mr-1">"</span>
          )}
          {title}
          {post.type === 'quote' && (
            <span className="text-purple-lt/60 text-4xl font-serif">"</span>
          )}
        </h1>

        {body && (
          <p className={`font-serif text-white/60 leading-relaxed ${FONT_SIZES[fontIdx]}`}>
            {body}
          </p>
        )}

        {/* Simulated blog body for blog type */}
        {post.type === 'blog' && (
          <div className={`font-serif text-white/70 leading-relaxed mt-6 space-y-4 ${FONT_SIZES[fontIdx]}`}>
            <p>
              De discussie over AI en creativiteit mist het wezenlijke punt. Niet vervanging maar reflectie —
              dat is waar het werkelijk om draait. Een spiegel die terugkijkt met de ogen van onze gedeelde
              verbeelding.
            </p>
            <p>
              Wanneer een model beelden genereert, muziek componeert of tekst schrijft, put het uit een
              kolossale bron van menselijke expressie. Het is in die zin nooit volledig autonoom. Het is
              een echo — verfijnd, gespiegeld, soms verbazingwekkend.
            </p>
            <p>
              De kunstenaar die met AI werkt is geen verdwijnende beroepsgroep. Die is curator, richter,
              en meesterbrein achter een steeds krachtiger instrument.
            </p>
          </div>
        )}

        {/* Author */}
        <div className="flex items-center gap-2 mt-10 pt-6 border-t border-white/10">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold"
            style={{ background: post.avatarColor }}
          >
            {post.author[0]}
          </div>
          <div>
            <p className="text-xs font-medium text-white/70">{post.author}</p>
            <p className="text-[11px] text-white/40">{post.handle}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
