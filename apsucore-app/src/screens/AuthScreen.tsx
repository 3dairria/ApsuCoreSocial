import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { trpc } from '../lib/trpc'
import { saveAuth } from '../lib/auth'

interface Props {
  onAuth: () => void
}

type Tab = 'login' | 'register'

export default function AuthScreen({ onAuth }: Props) {
  const [tab, setTab] = useState<Tab>('login')
  const [handle, setHandle] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [error, setError] = useState('')

  const login = trpc.auth.login.useMutation()
  const register = trpc.auth.register.useMutation()
  const loading = login.isPending || register.isPending

  async function handleSubmit() {
    setError('')
    try {
      let result
      if (tab === 'login') {
        result = await login.mutateAsync({ handle: handle.trim().toLowerCase(), password })
      } else {
        if (!name.trim()) { setError('Vul je naam in'); return }
        result = await register.mutateAsync({
          handle: handle.trim().toLowerCase(),
          name: name.trim(),
          email: `${handle.trim()}@demo.apsucore`,
          password,
        })
      }
      saveAuth(result.token, {
        userId: result.userId,
        name: result.name,
        handle: result.handle,
        avatarColor: result.avatarColor,
      })
      onAuth()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Er ging iets mis')
    }
  }

  return (
    <div className="min-h-dvh bg-bg flex flex-col items-center justify-center px-6">
      {/* Logo */}
      <div className="mb-10 text-center">
        <div className="text-3xl font-bold mb-1">
          <span className="text-purple-lt">Apsu</span><span className="text-yellow">Core</span>
        </div>
        <div className="w-16 h-0.5 mx-auto bg-gradient-to-r from-purple to-yellow rounded-full" />
        <p className="text-xs text-muted mt-2">Maak. Deel. Verbind.</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-surface border border-border rounded-2xl p-6">
        {/* Tabs */}
        <div className="flex mb-6 bg-bg rounded-xl p-1">
          {(['login', 'register'] as Tab[]).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => { setTab(t); setError('') }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                tab === t ? 'bg-surface text-text' : 'text-muted'
              }`}
            >
              {t === 'login' ? 'Inloggen' : 'Registreren'}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {/* Name field (register only) */}
          {tab === 'register' && (
            <div>
              <label className="text-xs text-muted uppercase tracking-widest block mb-1.5">Naam</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Jouw naam"
                maxLength={60}
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-sm text-text placeholder:text-muted2 outline-none focus:border-purple transition-colors"
              />
            </div>
          )}

          {/* Handle */}
          <div>
            <label className="text-xs text-muted uppercase tracking-widest block mb-1.5">Gebruikersnaam</label>
            <div className="flex items-center bg-bg border border-border rounded-xl px-4 py-3 focus-within:border-purple transition-colors">
              <span className="text-muted2 text-sm mr-1">@</span>
              <input
                type="text"
                value={handle}
                onChange={e => setHandle(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                placeholder="gebruikersnaam"
                maxLength={30}
                className="flex-1 bg-transparent text-sm text-text placeholder:text-muted2 outline-none"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-muted uppercase tracking-widest block mb-1.5">Wachtwoord</label>
            <div className="flex items-center bg-bg border border-border rounded-xl px-4 py-3 focus-within:border-purple transition-colors">
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && void handleSubmit()}
                placeholder={tab === 'register' ? 'Minimaal 8 tekens' : '••••••••'}
                className="flex-1 bg-transparent text-sm text-text placeholder:text-muted2 outline-none"
              />
              <button type="button" onClick={() => setShowPw(s => !s)} className="text-muted ml-2">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="button"
            onClick={() => void handleSubmit()}
            disabled={loading || !handle.trim() || !password}
            className="w-full py-3 rounded-xl bg-purple text-white text-sm font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-fab mt-2"
          >
            {loading ? 'Even wachten…' : tab === 'login' ? 'Inloggen' : 'Account aanmaken'}
          </button>
        </div>

        {/* Demo hint */}
        {tab === 'login' && (
          <p className="text-center text-[11px] text-muted2 mt-4">
            Demo: <span className="text-muted">@jouwnaam</span> / <span className="text-muted">demo1234</span>
          </p>
        )}
      </div>
    </div>
  )
}
