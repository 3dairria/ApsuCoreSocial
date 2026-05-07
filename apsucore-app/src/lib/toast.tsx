import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { CheckCircle2, X } from 'lucide-react'

interface Toast {
  id: string
  message: string
  undoLabel?: string
  onUndo?: () => void
}

interface ToastCtx {
  showToast: (message: string, opts?: { undoLabel?: string; onUndo?: () => void }) => void
}

const ToastContext = createContext<ToastCtx>({ showToast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, opts?: { undoLabel?: string; onUndo?: () => void }) => {
    const id = crypto.randomUUID()
    setToasts(prev => [...prev.slice(-2), { id, message, ...opts }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 3200)
  }, [])

  function dismiss(id: string) {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-[390px] px-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className="flex items-center gap-3 bg-surface2 border border-border rounded-xl px-4 py-3 shadow-card animate-fade-up pointer-events-auto"
          >
            <CheckCircle2 size={16} className="text-purple-lt flex-shrink-0" />
            <span className="flex-1 text-sm text-text">{toast.message}</span>
            {toast.onUndo && (
              <button
                onClick={() => { toast.onUndo?.(); dismiss(toast.id) }}
                className="text-xs font-semibold text-purple-lt flex-shrink-0"
              >
                {toast.undoLabel ?? 'Ongedaan'}
              </button>
            )}
            <button onClick={() => dismiss(toast.id)} className="text-muted2 flex-shrink-0">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
