import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { toast } from '../lib/util'

const CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

const card = [
  ['model', 'sabarish-g (v2027.05, final-year MS)'],
  ['architecture', 'finance roots → analytics → ML research'],
  ['training data', 'BBA Finance, 2 yrs Wego + Jetapult, MS Business Analytics'],
  ['intended use', 'turning messy business data into decisions'],
  ['strengths', 'domain-first framing, data audits, honest baselines, shipping fast with AI tools'],
  ['known biases', 'picks the simpler model when it wins; asks the business question first'],
  ['evaluation', '39M flights · 789K loans · 5 unseen retina datasets'],
  ['deployment', 'available from December 2026'],
]

export default function Konami() {
  const [open, setOpen] = useState(false)
  const cv = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let i = 0
    const fire = () => {
      setOpen(true)
      document.documentElement.classList.add('neon')
      setTimeout(() => document.documentElement.classList.remove('neon'), 7000)
      toast('Secret unlocked: neon terminal mode')
      confetti()
    }
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key
      i = k === CODE[i] ? i + 1 : k === CODE[0] ? 1 : 0
      if (i === CODE.length) {
        i = 0
        fire()
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('konami', fire)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('konami', fire)
    }
  }, [])

  // confetti made of scatter points
  const confetti = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const c = cv.current!
    const ctx = c.getContext('2d')!
    c.width = innerWidth
    c.height = innerHeight
    const cols = ['#B8FF3C', '#FF3E9A', '#22D3EE', '#FFD60A', '#A78BFA']
    const ps = Array.from({ length: 220 }, () => ({
      x: innerWidth / 2,
      y: innerHeight * 0.6,
      vx: (Math.random() - 0.5) * 22,
      vy: -Math.random() * 22 - 6,
      r: 3 + Math.random() * 6,
      c: cols[Math.floor(Math.random() * 5)],
    }))
    let f = 0
    const tick = () => {
      ctx.clearRect(0, 0, c.width, c.height)
      for (const p of ps) {
        p.vy += 0.5
        p.x += p.vx
        p.y += p.vy
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.c
        ctx.fill()
        ctx.lineWidth = 2
        ctx.strokeStyle = '#0a0a0a'
        ctx.stroke()
      }
      if (++f < 160) requestAnimationFrame(tick)
      else ctx.clearRect(0, 0, c.width, c.height)
    }
    tick()
  }

  return (
    <>
      <canvas ref={cv} className="pointer-events-none fixed inset-0 z-[96]" aria-hidden="true" />
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-[97] grid place-items-center bg-black/60 p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="mc-h"
              initial={{ scale: 0.7, rotate: -4 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              className="brut w-full max-w-lg bg-surface p-6 font-mono"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.key === 'Escape' && setOpen(false)}
            >
              <h2 id="mc-h" className="font-display text-4xl">
                Model card
              </h2>
              <dl className="mt-4 grid gap-2 text-sm">
                {card.map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-2">
                    <dt className="font-bold text-pink">{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
              <button autoFocus onClick={() => setOpen(false)} className="brut-sm press mt-6 bg-lime px-4 py-2 font-bold text-[#0a0a0a]">
                close()
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
