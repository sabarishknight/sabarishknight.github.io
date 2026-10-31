import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { counters } from '../data/content'

const bgs = ['var(--lime)', 'var(--pink)', 'var(--cyan)', 'var(--sun)']

function Count({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return setV(to)
    let raf = 0
    const t0 = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1400)
      setV(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to])
  return (
    <span ref={ref} className="tabular-nums">
      {v}
      {suffix}
    </span>
  )
}

export default function Counters() {
  return (
    <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
      {counters.map((c, i) => (
        <li key={c.label} className="brut on-accent p-4 md:p-5" style={{ background: bgs[i] }}>
          <p className="font-display text-[clamp(2.6rem,6vw,4.4rem)] font-extrabold leading-none tracking-tight">
            <Count to={c.value} suffix={c.suffix} />
          </p>
          <p className="mt-2 font-mono text-sm font-semibold">{c.label}</p>
        </li>
      ))}
    </ul>
  )
}
