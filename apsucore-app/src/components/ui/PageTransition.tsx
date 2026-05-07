import { type ReactNode, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

interface Props {
  children: ReactNode
}

export default function PageTransition({ children }: Props) {
  const location = useLocation()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.opacity = '0'
    el.style.transform = 'translateY(8px)'
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.22s ease, transform 0.22s ease'
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    })
    return () => cancelAnimationFrame(raf)
  }, [location.pathname])

  return <div ref={ref}>{children}</div>
}
