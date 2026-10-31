import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export default function Toasts() {
  const [items, setItems] = useState<{ id: number; text: string }[]>([])
  useEffect(() => {
    const on = (e: Event) => {
      const id = Date.now() + Math.random()
      setItems((x) => [...x, { id, text: (e as CustomEvent<string>).detail }])
      setTimeout(() => setItems((x) => x.filter((t) => t.id !== id)), 4200)
    }
    window.addEventListener('toast', on)
    return () => window.removeEventListener('toast', on)
  }, [])
  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[90] grid gap-2" aria-live="polite" role="status">
      <AnimatePresence>
        {items.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 30, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, x: -40 }}
            className="brut on-accent max-w-[min(92vw,380px)] bg-sun px-4 py-3 font-mono text-sm font-bold"
          >
            ★ {t.text}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
