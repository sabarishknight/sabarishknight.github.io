import { useState } from 'react'
import { motion } from 'framer-motion'
import { quiz } from '../data/content'
import { toast } from '../lib/util'

const bars = ['var(--cyan)', 'var(--sun)', 'var(--violet)']

export default function GuessGame() {
  const [i, setI] = useState(0)
  const [pick, setPick] = useState<number | null>(null)
  const [score, setScore] = useState({ right: 0, played: 0 })
  const q = quiz[i % quiz.length]
  const max = Math.max(...q.scale)

  const choose = (k: number) => {
    if (pick !== null) return
    setPick(k)
    const ok = k === q.answer
    const next = { right: score.right + (ok ? 1 : 0), played: score.played + 1 }
    setScore(next)
    if (next.played === quiz.length) toast(`Model evaluated: ${next.right}/${quiz.length} correct. ${next.right >= 5 ? 'Well calibrated!' : 'Room to fine-tune.'}`)
  }

  return (
    <section id="game" className="section" aria-labelledby="game-h">
      <div className="wrap">
        <div className="brut on-accent grid gap-8 bg-sun p-6 md:grid-cols-[1fr_1.3fr] md:p-10">
          <div>
            <h2 id="game-h" className="text-[clamp(2.4rem,6vw,4.6rem)]">
              Guess the metric
            </h2>
            <p className="mt-4 text-lg">Seven real numbers from my projects. Make a prediction, then see the ground truth.</p>
            <div className="mt-6 inline-grid grid-cols-2 gap-3 font-mono">
              <div className="brut-sm bg-white px-4 py-2">
                <p className="text-xs font-bold">accuracy</p>
                <p className="font-display text-3xl font-extrabold tabular-nums">
                  {score.right}/{score.played}
                </p>
              </div>
              <div className="brut-sm bg-white px-4 py-2">
                <p className="text-xs font-bold">question</p>
                <p className="font-display text-3xl font-extrabold tabular-nums">
                  {(i % quiz.length) + 1}/{quiz.length}
                </p>
              </div>
            </div>
          </div>
          <div className="brut bg-white p-5">
            <p className="font-mono text-sm font-bold">{q.project}</p>
            <p className="mt-1 font-display text-2xl font-bold leading-tight tracking-tight">{q.q}</p>
            <div className="mt-5 grid gap-3">
              {q.options.map((o, k) => {
                const reveal = pick !== null
                const right = k === q.answer
                return (
                  <button
                    key={o}
                    onClick={() => choose(k)}
                    disabled={reveal}
                    className={`brut-sm press relative overflow-hidden px-4 py-3 text-left font-mono text-lg font-bold ${reveal && !right ? 'opacity-60' : ''}`}
                    style={{ background: '#fff' }}
                  >
                    <motion.span
                      className="absolute inset-y-0 left-0"
                      style={{ background: reveal && right ? 'var(--lime)' : bars[k] }}
                      initial={false}
                      animate={{ width: reveal ? `${(q.scale[k] / max) * 100}%` : '0%' }}
                      transition={{ type: 'spring', stiffness: 90, damping: 16, delay: k * 0.08 }}
                    />
                    <span className="relative flex justify-between">
                      {o}
                      {reveal && <span>{right ? '✓ ground truth' : k === pick ? '✗' : ''}</span>}
                    </span>
                  </button>
                )
              })}
            </div>
            <div className="mt-5 flex items-center justify-between gap-3">
              <p className="font-mono text-sm" aria-live="polite">
                {pick === null ? 'pick one' : pick === q.answer ? 'correct, nice' : 'not quite'}
              </p>
              <button
                onClick={() => {
                  setPick(null)
                  setI(i + 1)
                  if ((i + 1) % quiz.length === 0) setScore({ right: 0, played: 0 })
                }}
                disabled={pick === null}
                className="brut-sm press bg-ink px-4 py-2 font-display text-lg font-bold text-white disabled:opacity-40"
                style={{ background: '#0a0a0a' }}
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
