import { useRef } from 'react'
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity, useReducedMotion } from 'framer-motion'

const wrap = (min: number, max: number, v: number) => ((((v - min) % (max - min)) + (max - min)) % (max - min)) + min

/** Endless band that speeds up, reverses and skews with your scroll velocity. */
export default function Marquee({ items, reverse, tone = 'ink' }: { items: string[]; reverse?: boolean; tone?: 'ink' | 'pink' }) {
  const reduce = useReducedMotion()
  const base = useMotionValue(0)
  const { scrollY } = useScroll()
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 })
  const factor = useTransform(vel, [-2000, 0, 2000], [-5, 0, 5], { clamp: false })
  const skew = useTransform(vel, [-2500, 0, 2500], [8, 0, -8])
  const dir = useRef(reverse ? -1 : 1)
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    const f = factor.get()
    if (f < 0) dir.current = reverse ? 1 : -1
    else if (f > 0) dir.current = reverse ? -1 : 1
    base.set(base.get() - dir.current * 2.2 * (delta / 1000) * (1 + Math.abs(f)))
  })

  const row = [...items, ...items]
  const bg = tone === 'pink' ? 'bg-pink text-[#0a0a0a]' : 'bg-ink text-paper'
  return (
    <div className={`overflow-hidden border-y-[3px] border-line py-4 ${bg}`} aria-hidden="true">
      <motion.div className="flex w-max whitespace-nowrap" style={{ x, skewX: reduce ? 0 : skew }}>
        {[0, 1].map((k) => (
          <div key={k} className="flex">
            {row.map((t, i) => (
              <span key={i} className="flex items-center font-display text-[clamp(1.6rem,4vw,3rem)] font-extrabold tracking-tight">
                <span className="px-6">{t}</span>
                <svg width="26" height="26" viewBox="0 0 26 26"><circle cx="13" cy="13" r="9" fill={['var(--lime)', 'var(--cyan)', 'var(--sun)'][i % 3]} stroke="currentColor" strokeWidth="3" /></svg>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
