import { useState } from 'react'
import {
  ArrowLeft, Bell, Lock, Eye, Moon, Globe, Type,
  HelpCircle, LogOut, Trash2, ChevronRight, User
} from 'lucide-react'
import { clearAuth } from '../lib/auth'

interface Props {
  onBack: () => void
  onLogout?: () => void
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={`toggle-track ${on ? 'on' : ''}`}
      role="switch"
      aria-checked={on}
    >
      <div className="toggle-thumb" />
    </button>
  )
}

interface SettingRowProps {
  icon: typeof Bell
  iconColor: string
  label: string
  sublabel?: string
  toggle?: boolean
  toggleOn?: boolean
  onToggle?: () => void
  onPress?: () => void
  danger?: boolean
}

function SettingRow({ icon: Icon, iconColor, label, sublabel, toggle, toggleOn, onToggle, onPress, danger }: SettingRowProps) {
  return (
    <button
      onClick={onPress ?? onToggle}
      className="w-full flex items-center gap-3 px-4 py-3.5 active:bg-surface/50 transition-colors"
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: iconColor + '22' }}
      >
        <Icon size={16} style={{ color: iconColor }} strokeWidth={1.75} />
      </div>
      <div className="flex-1 text-left min-w-0">
        <p className={`text-sm font-medium ${danger ? 'text-red-400' : 'text-text'}`}>{label}</p>
        {sublabel && <p className="text-[11px] text-muted mt-0.5">{sublabel}</p>}
      </div>
      {toggle ? (
        <Toggle on={!!toggleOn} onToggle={() => onToggle?.()} />
      ) : (
        <ChevronRight size={15} className="text-muted2 flex-shrink-0" />
      )}
    </button>
  )
}

function SectionHeader({ label }: { label: string }) {
  return (
    <p className="text-[11px] font-semibold text-muted uppercase tracking-widest px-4 pt-5 pb-1">
      {label}
    </p>
  )
}

export default function SettingsScreen({ onBack, onLogout }: Props) {
  const [notifs, setNotifs] = useState(true)
  const [pushNotifs, setPushNotifs] = useState(true)
  const [privateAccount, setPrivateAccount] = useState(false)
  const [darkMode] = useState(true)
  const [zenMode, setZenMode] = useState(false)
  const [showLikes, setShowLikes] = useState(true)

  return (
    <div className="animate-fade-up min-h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
        <button onClick={onBack} className="text-muted">
          <ArrowLeft size={20} strokeWidth={1.75} />
        </button>
        <span className="text-sm font-semibold text-text flex-1">Instellingen</span>
      </div>

      {/* Profile banner */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-semibold"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #9D5FF5)' }}
        >
          J
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-text">Jouw Naam</p>
          <p className="text-xs text-muted">@jouwnaam · Profiel bewerken</p>
        </div>
        <ChevronRight size={16} className="text-muted2" />
      </div>

      {/* Account */}
      <SectionHeader label="Account" />
      <div className="divide-y divide-border/40">
        <SettingRow icon={User} iconColor="#7C3AED" label="Profiel bewerken" />
        <SettingRow icon={Lock} iconColor="#9D5FF5" label="Wachtwoord wijzigen" />
        <SettingRow
          icon={Eye}
          iconColor="#4a60c0"
          label="Privé account"
          sublabel="Alleen volgers zien je posts"
          toggle
          toggleOn={privateAccount}
          onToggle={() => setPrivateAccount(p => !p)}
        />
      </div>

      {/* Meldingen */}
      <SectionHeader label="Meldingen" />
      <div className="divide-y divide-border/40">
        <SettingRow
          icon={Bell}
          iconColor="#D4A843"
          label="Meldingen inschakelen"
          toggle
          toggleOn={notifs}
          onToggle={() => setNotifs(n => !n)}
        />
        <SettingRow
          icon={Bell}
          iconColor="#D4A843"
          label="Push-meldingen"
          sublabel="Ontvang meldingen buiten de app"
          toggle
          toggleOn={pushNotifs}
          onToggle={() => setPushNotifs(p => !p)}
        />
      </div>

      {/* Weergave */}
      <SectionHeader label="Weergave" />
      <div className="divide-y divide-border/40">
        <SettingRow
          icon={Moon}
          iconColor="#9D5FF5"
          label="Donkere modus"
          toggle
          toggleOn={darkMode}
          onToggle={() => {}}
        />
        <SettingRow
          icon={Eye}
          iconColor="#1e6e4e"
          label="Zen modus"
          sublabel="Verberg afleidende elementen"
          toggle
          toggleOn={zenMode}
          onToggle={() => setZenMode(z => !z)}
        />
        <SettingRow
          icon={Eye}
          iconColor="#c04a8a"
          label="Likes weergeven"
          sublabel="Toon like-aantallen op posts"
          toggle
          toggleOn={showLikes}
          onToggle={() => setShowLikes(l => !l)}
        />
        <SettingRow icon={Type} iconColor="#4a60c0" label="Tekstgrootte" sublabel="Normaal" />
        <SettingRow icon={Globe} iconColor="#7C3AED" label="Taal" sublabel="Nederlands" />
      </div>

      {/* Overig */}
      <SectionHeader label="Overig" />
      <div className="divide-y divide-border/40">
        <SettingRow icon={HelpCircle} iconColor="#7a7890" label="Help & ondersteuning" />
        <SettingRow icon={LogOut} iconColor="#7a7890" label="Uitloggen" danger onPress={() => { clearAuth(); onLogout?.() }} />
        <SettingRow icon={Trash2} iconColor="#ef4444" label="Account verwijderen" danger />
      </div>

      <p className="text-center text-[11px] text-muted2 py-8">ApsuCore v0.1.0 · Gemaakt met ✨</p>
    </div>
  )
}
