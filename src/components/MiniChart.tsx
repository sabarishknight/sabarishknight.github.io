import type { ChartKind } from '../data/content'
import { rng } from '../lib/util'

// Small looping SVG charts. Labelled numbers are real (from content.ts); the rest is a motif.
const ink = 'var(--line)'

export default function MiniChart({ kind, className = '' }: { kind: ChartKind; className?: string }) {
  return (
    <svg viewBox="0 0 240 150" className={`mini w-full ${className}`} role="img" aria-label={labels[kind]}>
      <style>{css}</style>
      <path d="M20 10 V130 H232" stroke={ink} strokeWidth="2.5" fill="none" />
      {charts[kind]()}
    </svg>
  )
}

const labels: Record<ChartKind, string> = {
  ladder: 'Bar chart: PR-AUC rises from 0.350 baseline to 0.748',
  retina: 'Grid of 100 spatial nodes with the top-ranked ones lighting up',
  profit: 'Bar chart: profit rises from 2.0 to 4.7 million euros',
  faces: 'Grid of 56 face boxes turning green one by one',
  agents: 'Eight agent nodes passing a token around a loop',
  phone: 'Voice wave and a lead-score gauge',
  stars: 'Star rating falling as days late increase',
  quartile: 'Bar chart: bottom quartile uses 4.0 times the energy of the top quartile',
}

const css = `
.mini .grow{transform-origin:bottom;transform-box:fill-box;animation:grow 2.6s cubic-bezier(.3,1.4,.5,1) infinite alternate}
.mini .d1{animation-delay:.25s}.mini .d2{animation-delay:.5s}
@keyframes grow{0%,10%{transform:scaleY(.05)}60%,100%{transform:scaleY(1)}}
.mini .blink{animation:lit 3s infinite}
@keyframes lit{0%,30%{fill:var(--surface)}45%,85%{fill:var(--pink)}100%{fill:var(--surface)}}
.mini .ok{animation:ok 5.6s infinite}
@keyframes ok{0%,8%{stroke:var(--line);fill:transparent}14%,92%{stroke:var(--line);fill:var(--lime)}100%{fill:transparent}}
.mini .tok{animation:orbit 4s linear infinite;transform-origin:126px 70px}
@keyframes orbit{to{transform:rotate(360deg)}}
.mini .wave{animation:wave 1.2s ease-in-out infinite alternate;transform-origin:center;transform-box:fill-box}
@keyframes wave{from{transform:scaleY(.25)}to{transform:scaleY(1)}}
.mini .slide{animation:slide 3.4s ease-in-out infinite alternate}
@keyframes slide{from{transform:translateY(0)}to{transform:translateY(62px)}}
.mini .needle{transform-origin:180px 112px;animation:needle 3s cubic-bezier(.3,1.5,.5,1) infinite alternate}
@keyframes needle{from{transform:rotate(-80deg)}to{transform:rotate(55deg)}}
`

const T = (x: number, y: number, s: string, size = 12) => (
  <text x={x} y={y} fontSize={size} fontFamily="JetBrains Mono Variable, monospace" fontWeight="700" fill="currentColor">
    {s}
  </text>
)

const charts: Record<ChartKind, () => JSX.Element> = {
  ladder: () => (
    <g>
      <rect className="grow" x="44" y={130 - 0.35 * 140} width="58" height={0.35 * 140} fill="var(--surface)" stroke={ink} strokeWidth="2.5" />
      <rect className="grow d1" x="136" y={130 - 0.748 * 140} width="58" height={0.748 * 140} fill="var(--lime)" stroke={ink} strokeWidth="2.5" />
      {T(48, 75, '0.350')}
      {T(140, 20, '0.748')}
      {T(40, 146, 'baseline', 11)}
      {T(132, 146, 'LightGBM', 11)}
    </g>
  ),
  retina: () => {
    const r = rng(3)
    const cells = []
    for (let i = 0; i < 10; i++)
      for (let j = 0; j < 10; j++) {
        const hot = r() > 0.85
        cells.push(
          <rect
            key={i * 10 + j}
            className={hot ? 'blink' : ''}
            style={hot ? { animationDelay: `${r() * 2}s` } : undefined}
            x={72 + j * 11}
            y={17 + i * 11}
            width="9"
            height="9"
            fill="var(--surface)"
            stroke={ink}
            strokeWidth="1.2"
          />,
        )
      }
    return (
      <g>
        <circle cx="126" cy="70" r="64" fill="var(--cyan)" opacity=".35" stroke={ink} strokeWidth="2.5" />
        {cells}
      </g>
    )
  },
  profit: () => (
    <g>
      <rect className="grow" x="44" y={130 - 2.0 * 24} width="58" height={2.0 * 24} fill="var(--surface)" stroke={ink} strokeWidth="2.5" />
      <rect className="grow d1" x="136" y={130 - 4.7 * 24} width="58" height={4.7 * 24} fill="var(--sun)" stroke={ink} strokeWidth="2.5" />
      {T(50, 76, '€2.0M')}
      {T(142, 12, '€4.7M')}
      {T(38, 146, 'approve-all', 10)}
      {T(140, 146, 'policy', 11)}
    </g>
  ),
  faces: () => {
    const boxes = []
    for (let i = 0; i < 56; i++) {
      const c = i % 14
      const rw = Math.floor(i / 14)
      boxes.push(
        <rect key={i} className="ok" style={{ animationDelay: `${i * 0.06}s` }} x={30 + c * 14.5} y={24 + rw * 25} width="11" height="18" rx="5" fill="transparent" stroke={ink} strokeWidth="2" />,
      )
    }
    return (
      <g>
        {boxes}
        {T(30, 140, '56 faces · ~40 s')}
      </g>
    )
  },
  agents: () => {
    const nodes = Array.from({ length: 8 }, (_, i) => {
      const a = (i / 8) * Math.PI * 2 - Math.PI / 2
      return [126 + Math.cos(a) * 48, 70 + Math.sin(a) * 48]
    })
    return (
      <g>
        <circle cx="126" cy="70" r="48" fill="none" stroke={ink} strokeWidth="2" strokeDasharray="5 5" />
        {nodes.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="10" fill={i === 5 ? 'var(--pink)' : 'var(--violet)'} stroke={ink} strokeWidth="2.5" />
        ))}
        <g className="tok">
          <circle cx="126" cy="22" r="5" fill="var(--sun)" stroke={ink} strokeWidth="2" />
        </g>
        {T(98, 74, 'design', 11)}
      </g>
    )
  },
  phone: () => (
    <g>
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} className="wave" style={{ animationDelay: `${(i % 5) * 0.15}s` }} x={30 + i * 8} y={40} width="5" height={30 + ((i * 37) % 50)} fill="var(--pink)" stroke={ink} strokeWidth="1.5" />
      ))}
      <path d="M140 112 A40 40 0 0 1 220 112" fill="none" stroke={ink} strokeWidth="10" />
      <path d="M140 112 A40 40 0 0 1 220 112" fill="none" stroke="var(--lime)" strokeWidth="6" strokeDasharray="40 200" />
      <line className="needle" x1="180" y1="112" x2="180" y2="78" stroke={ink} strokeWidth="4" strokeLinecap="round" />
      {T(160, 140, 'hot?', 11)}
    </g>
  ),
  stars: () => (
    <g>
      <g className="slide">
        {[0, 1, 2, 3, 4].map((i) => (
          <path key={i} transform={`translate(${40 + i * 30} 22) scale(1.1)`} d="M10 0 L13 7 L20 7.5 L14.5 12 L16.5 19 L10 15 L3.5 19 L5.5 12 L0 7.5 L7 7 Z" fill={i < 4 ? 'var(--sun)' : 'var(--surface)'} stroke={ink} strokeWidth="1.8" />
        ))}
      </g>
      {T(194, 30, '−1.98★', 12)}
      {T(194, 120, 'late', 12)}
    </g>
  ),
  quartile: () => (
    <g>
      <rect className="grow" x="44" y={130 - 28} width="58" height="28" fill="var(--lime)" stroke={ink} strokeWidth="2.5" />
      <rect className="grow d1" x="136" y={130 - 112} width="58" height="112" fill="var(--pink)" stroke={ink} strokeWidth="2.5" />
      <path d="M118 30 L108 62 H120 L110 92" fill="none" stroke={ink} strokeWidth="4" strokeLinejoin="round" />
      {T(54, 96, '1.0×')}
      {T(146, 12, '4.0×')}
      {T(44, 146, 'top Q', 11)}
      {T(130, 146, 'bottom Q', 11)}
    </g>
  ),
}
