import { useState, useRef, useEffect } from 'react'
import { ArrowLeft, Send, MoreHorizontal } from 'lucide-react'
import { CHAT_ITEMS } from '../lib/data'
import type { Screen } from '../lib/types'

interface Props {
  onBack: () => void
  onNav: (screen: Screen) => void
}

interface Message {
  id: string
  text: string
  mine: boolean
  time: string
}

const INITIAL_MESSAGES: Message[] = [
  { id: 'm1', text: 'Hey! Ik zag je nieuwe werk. Wauw, dat beeld is magisch! 🔮', mine: false, time: '10:32' },
  { id: 'm2', text: 'Dankjewel! Ik was er lang mee bezig.', mine: true, time: '10:34' },
  { id: 'm3', text: 'Welk model heb je gebruikt? De kleuren zijn zo intens.', mine: false, time: '10:35' },
  { id: 'm4', text: 'Flux 1.1 Pro, met wat extra Lightroom nabewerking.', mine: true, time: '10:36' },
  { id: 'm5', text: 'Prachtig resultaat. Zou je ooit willen samenwerken?', mine: false, time: '10:38' },
]

function now() {
  return new Date().toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })
}

export default function ChatDetailScreen({ onBack, onNav }: Props) {
  const chat = CHAT_ITEMS[0]
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function sendMessage() {
    const text = input.trim()
    if (!text) return
    const newMsg: Message = { id: `m${Date.now()}`, text, mine: true, time: now() }
    setMessages(prev => [...prev, newMsg])
    setInput('')

    // Simulate typing + reply
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [
        ...prev,
        { id: `m${Date.now()}r`, text: 'Dat klinkt interessant! 😊', mine: false, time: now() },
      ])
    }, 1800)
  }

  return (
    <div className="flex flex-col h-dvh animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-bg flex-shrink-0">
        <button onClick={onBack} className="text-muted">
          <ArrowLeft size={20} strokeWidth={1.75} />
        </button>
        <button onClick={() => onNav('creator-profile')} className="flex items-center gap-2.5 flex-1">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold"
            style={{ background: chat.avatarColor }}
          >
            {chat.name[0]}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-text leading-tight">{chat.name}</p>
            <p className="text-[11px] text-green-400">Online</p>
          </div>
        </button>
        <button className="text-muted">
          <MoreHorizontal size={20} strokeWidth={1.75} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.mine ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] ${msg.mine ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div
                className={`px-3.5 py-2.5 rounded-2xl text-sm leading-snug ${
                  msg.mine
                    ? 'bg-purple text-white rounded-br-sm'
                    : 'bg-surface border border-border text-text rounded-bl-sm'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-muted2 px-1">{msg.time}</span>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex justify-start">
            <div className="bg-surface border border-border rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-muted animate-live"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="flex items-center gap-3 px-4 py-3 border-t border-border bg-bg flex-shrink-0 safe-bottom">
        <div className="flex-1 flex items-center bg-surface border border-border rounded-full px-4 h-10 gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="Typ een bericht…"
            className="flex-1 bg-transparent text-sm text-text placeholder:text-muted outline-none"
          />
        </div>
        <button
          onClick={sendMessage}
          disabled={!input.trim()}
          className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90 ${
            input.trim() ? 'bg-purple shadow-fab' : 'bg-surface border border-border'
          }`}
        >
          <Send size={16} className={input.trim() ? 'text-white ml-0.5' : 'text-muted'} />
        </button>
      </div>
    </div>
  )
}
