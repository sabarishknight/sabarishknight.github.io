import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from '../lib/util'

type Pt = { id: number; x: number; y: number; bad: boolean; hit?: 'tp' | 'fp'; at?: number }

// phones get a narrower, taller chart so points stay tappable
const NARROW = typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches
const W = NARROW ? 480 : 1000
const H = NARROW ? 620 : 360
const MID = H / 2
const SIGMA = NARROW ? 40 : 26
const ROUND = 30 // seconds
const SCAN = W * 0.76 // keyboard flags the point nearest this x
const GAP = 34 // viewBox px between points, so density is the same at every speed
const REACH = 46 // a click flags the nearest point within this distance

const LEVELS = [
  { name: 'Chill', speed: 70, ramp: 1, sub: 0, bg: 'var(--cyan)' },
  { name: 'Normal', speed: 110, ramp: 2, sub: 0.03, bg: 'var(--lime)' },
  { name: 'Fast', speed: 160, ramp: 4, sub: 0.05, bg: 'var(--pink)' },
  { name: 'Insane', speed: 230, ramp: 6, sub: 0.06, bg: '#ff7a00' },
]

/** Arcade game: a live KPI streams by; click the anomalies before they leave the chart. */
export default function AnomalyHunt() {
  const [mode, setMode] = useState<'idle' | 'play' | 'over'>('idle')
  const [level, setLevel] = useState(0)
  const [, setFrame] = useState(0)
  const pts = useRef<Pt[]>([])
  const score = useRef({ tp: 0, fp: 0, fn: 0 })
  const left = useRef(ROUND)
  const clock = useRef(0)
  const best = useRef<Record<string, number>>(readBest())
  const svg = useRef<SVGSVGElement>(null)
  const L = LEVELS[level]

  useEffect(() => {
    if (mode !== 'play') return
    let raf = 0
    let last = performance.now()
    let travelled = GAP
    let id = 0
    let t = 0
    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      t += dt
      clock.current = t
      left.current = Math.max(0, ROUND - t)
      const speed = (L.speed + t * L.ramp) * (W / 1000)
      travelled += speed * dt
      if (travelled >= GAP * (W / 1000)) {
        travelled = 0
        const bad = Math.random() < 0.13
        const base = MID + Math.sin(t * 1.1) * 36 + (Math.random() - 0.5) * SIGMA * 1.5
        // harder levels make anomalies subtler over the round: 4.5σ → ~3σ
        const jump = (4.5 - Math.min(1.5, t * L.sub)) * SIGMA * (Math.random() < 0.5 ? -1 : 1)
        pts.current.push({ id: id++, x: W + 10, y: bad ? Math.min(H - 16, Math.max(16, base + jump)) : base, bad })
      }
      for (const p of pts.current) p.x -= speed * dt
      pts.current = pts.current.filter((p) => {
        if (p.x > -12) return true
        if (p.bad && !p.hit) score.current.fn++
        return false
      })
      setFrame((f) => f + 1)
      if (left.current <= 0) return end()
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [mode, L])

  const start = () => {
    pts.current = []
    score.current = { tp: 0, fp: 0, fn: 0 }
    left.current = ROUND
    setMode('play')
  }
  const end = () => {
    // anomalies still on screen and unflagged count as misses
    score.current.fn += pts.current.filter((p) => p.bad && !p.hit).length
    const f = f1(score.current)
    if (f > (best.current[L.name] ?? 0)) {
      best.current = { ...best.current, [L.name]: f }
      try {
        localStorage.setItem('anomaly-best', JSON.stringify(best.current))
      } catch {}
      if (f > 0) toast(`New best on ${L.name}: F1 ${f.toFixed(2)}`)
    }
    setMode('over')
  }
  const flag = (p: Pt) => {
    if (p.hit) return
    p.hit = p.bad ? 'tp' : 'fp'
    p.at = clock.current
    score.current[p.hit]++
  }
  // click anywhere: flag the nearest unflagged point, preferring anomalies when two are close
  const onPointer = (e: React.PointerEvent<SVGSVGElement>) => {
    if (mode !== 'play') return
    const m = svg.current!.getScreenCTM()
    if (!m) return
    const pt = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse())
    const near = pts.current
      .filter((p) => !p.hit)
      .map((p) => ({ p, d: Math.hypot(p.x - pt.x, p.y - pt.y) - (p.bad ? 12 : 0) }))
      .filter((c) => c.d < REACH)
      .sort((a, b) => a.d - b.d)[0]
    if (near) flag(near.p)
  }
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key !== ' ' && e.key !== 'Enter') return
    e.preventDefault()
    if (mode !== 'play') return start()
    const near = pts.current.filter((p) => !p.hit && Math.abs(p.x - SCAN) < 50).sort((a, b) => Math.abs(a.x - SCAN) - Math.abs(b.x - SCAN))[0]
    if (near) flag(near)
  }

  const s = score.current
  const precision = s.tp + s.fp ? s.tp / (s.tp + s.fp) : 0
  const recall = s.tp + s.fn ? s.tp / (s.tp + s.fn) : 0
  const bandOpacity = mode === 'play' ? Math.max(0, (left.current - 12) / 18) * 0.5 : 0.5
  const path = pts.current.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ')
  const bestHere = best.current[L.name]

  return (
    <section id="game" className="section" aria-labelledby="game-h">
      <div className="wrap">
        <div className="brut on-accent overflow-hidden bg-sun">
          {/* arcade header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-[3px] border-[#0a0a0a] bg-[#0a0a0a] px-5 py-4 text-white md:px-8">
            <h2 id="game-h" className="text-[clamp(2rem,5vw,3.6rem)] text-lime">
              Play Anomaly Hunt
            </h2>
            <div className="flex flex-wrap gap-2 font-mono text-sm font-bold">
              <Hud label="TIME" value={`${Math.ceil(left.current)}s`} />
              <Hud label="CAUGHT" value={String(s.tp)} />
              <Hud label="OOPS" value={String(s.fp)} />
              <Hud label={`BEST · ${L.name.toUpperCase()}`} value={bestHere ? bestHere.toFixed(2) : '–'} />
            </div>
          </div>

          <div className="grid gap-6 p-5 md:p-8 lg:grid-cols-[0.75fr_1.6fr]">
            <div>
              <p className="text-lg">
                A live KPI streams past. Tap the <strong>spikes and dips</strong> that jump out of the blue band before they leave the screen. Tap normal points and you lose precision; miss a spike and you lose recall.
              </p>
              <fieldset className="mt-5" disabled={mode === 'play'}>
                <legend className="font-display text-xl font-bold">Speed</legend>
                <div className="mt-2 grid grid-cols-2 gap-2" role="radiogroup" aria-label="Speed">
                  {LEVELS.map((lv, i) => (
                    <button
                      key={lv.name}
                      type="button"
                      role="radio"
                      aria-checked={level === i}
                      onClick={() => setLevel(i)}
                      className="brut-sm press px-3 py-2.5 text-left font-display text-lg font-bold disabled:opacity-60"
                      style={{ background: level === i ? lv.bg : '#fff' }}
                    >
                      {lv.name}
                      <span className="block font-mono text-xs font-medium">{'▸'.repeat(i + 1)}</span>
                    </button>
                  ))}
                </div>
              </fieldset>
              <p className="mt-4 font-mono text-xs">Tip: you don’t need to hit the dot exactly; tapping near it works. Keyboard: Space flags the point on the pink line.</p>
            </div>

            <div
              className="brut relative overflow-hidden bg-white outline-none"
              tabIndex={0}
              onKeyDown={onKey}
              aria-label="Anomaly Hunt game. Press Space to start, then Space to flag the point on the pink scanner line."
            >
              <div className="flex items-center justify-between border-b-[3px] border-[#0a0a0a] px-4 py-2 font-mono text-xs font-bold">
                <span>orders_per_minute · {L.name.toLowerCase()} mode</span>
                <span className="flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${mode === 'play' ? 'animate-pulse bg-[#e11d48]' : 'bg-[#999]'}`} />
                  {mode === 'play' ? 'LIVE' : 'paused'}
                </span>
              </div>
              <svg
                ref={svg}
                viewBox={`0 0 ${W} ${H}`}
                className="block w-full touch-manipulation select-none"
                style={{ cursor: mode === 'play' ? 'crosshair' : 'default' }}
                onPointerDown={onPointer}
                role="presentation"
              >
                <rect x="0" y={MID - 2 * SIGMA - 36} width={W} height={4 * SIGMA + 72} fill="#22d3ee" opacity={bandOpacity} />
                <line x1="0" x2={W} y1={MID} y2={MID} stroke="#0a0a0a" strokeDasharray="6 8" opacity=".35" />
                <line x1={SCAN} x2={SCAN} y1="0" y2={H} stroke="#ff3e9a" strokeWidth="3" opacity=".45" />
                <path d={path} fill="none" stroke="#0a0a0a" strokeWidth="3" strokeLinejoin="round" />
                {pts.current.map((p) => {
                  const age = p.at !== undefined ? clock.current - p.at : 99
                  return (
                    <g key={p.id}>
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={p.hit ? 15 : p.bad && mode === 'over' ? 13 : 8}
                        fill={p.hit === 'tp' ? '#b8ff3c' : p.hit === 'fp' ? '#ff3e9a' : mode === 'over' && p.bad ? '#ffd60a' : '#0a0a0a'}
                        stroke="#0a0a0a"
                        strokeWidth="3"
                      />
                      {age < 0.8 && (
                        <text x={p.x} y={p.y - 24 - age * 30} textAnchor="middle" fontSize="22" fontWeight="800" fontFamily="Bricolage Grotesque Variable, sans-serif" fill={p.hit === 'tp' ? '#0a7a2a' : '#e11d48'} opacity={1 - age}>
                          {p.hit === 'tp' ? '+1' : 'false alarm'}
                        </text>
                      )}
                    </g>
                  )
                })}
              </svg>

              {mode !== 'play' && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-x-0 bottom-0 top-[38px] grid place-items-center bg-white/85 p-4">
                  {mode === 'idle' ? (
                    <motion.button
                      onClick={start}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ repeat: Infinity, duration: 1.6 }}
                      className="brut-sm bg-[#0a0a0a] px-8 py-5 font-display text-3xl font-extrabold text-lime"
                    >
                      ▶ PLAY
                      <span className="block font-mono text-xs font-medium text-white">
                        {L.name} · {ROUND}s round
                      </span>
                    </motion.button>
                  ) : (
                    <div className="w-full max-w-md text-center">
                      <p className="font-mono text-xs font-bold">GAME OVER · {L.name.toUpperCase()}</p>
                      <p className="font-display text-3xl font-extrabold tracking-tight">F1 = {f1(s).toFixed(2)}</p>
                      <div className="mx-auto mt-3 grid max-w-xs grid-cols-2 gap-1.5 font-mono text-sm font-bold" aria-label="Confusion matrix">
                        <Cell bg="#b8ff3c" k="caught (TP)" v={s.tp} />
                        <Cell bg="#ff3e9a" k="false alarm (FP)" v={s.fp} />
                        <Cell bg="#ffd60a" k="missed (FN)" v={s.fn} />
                        <Cell bg="#e5e5e5" k="precision · recall" v={`${pct(precision)} · ${pct(recall)}`} />
                      </div>
                      <p className="mt-3 text-sm">{verdict(precision, recall)}</p>
                      <div className="mt-4 flex flex-wrap justify-center gap-2">
                        <button onClick={start} className="brut-sm press bg-[#0a0a0a] px-5 py-3 font-display text-xl font-extrabold text-lime">
                          ↻ Play again
                        </button>
                        {level < LEVELS.length - 1 && (
                          <button
                            onClick={() => {
                              setLevel(level + 1)
                              setMode('idle')
                            }}
                            className="brut-sm press px-5 py-3 font-display text-xl font-extrabold"
                            style={{ background: LEVELS[level + 1].bg }}
                          >
                            Faster: {LEVELS[level + 1].name} →
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const f1 = (s: { tp: number; fp: number; fn: number }) => (s.tp ? (2 * s.tp) / (2 * s.tp + s.fp + s.fn) : 0)
const pct = (x: number) => `${Math.round(x * 100)}%`

function verdict(p: number, r: number) {
  if (p > 0.8 && r > 0.8) return 'Production-ready detector. Ship it, then try a faster speed.'
  if (p < 0.5 && r > 0.6) return 'Trigger-happy: you’d page the on-call team all night.'
  if (r < 0.5 && p > 0.6) return 'Careful but slow: real incidents slipped through.'
  return 'Decent baseline. Tune your threshold and try again.'
}

function readBest(): Record<string, number> {
  try {
    const v = JSON.parse(localStorage.getItem('anomaly-best') ?? '{}')
    return typeof v === 'object' && v ? v : {}
  } catch {
    return {}
  }
}

function Hud({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-2 border-lime px-2.5 py-1 text-center">
      <p className="text-[10px] text-lime">{label}</p>
      <p className="font-display text-xl font-extrabold tabular-nums">{value}</p>
    </div>
  )
}

function Cell({ bg, k, v }: { bg: string; k: string; v: number | string }) {
  return (
    <div className="border-[3px] border-[#0a0a0a] px-2 py-1.5" style={{ background: bg }}>
      <p className="text-[11px]">{k}</p>
      <p className="text-lg">{v}</p>
    </div>
  )
}
