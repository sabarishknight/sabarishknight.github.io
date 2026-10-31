import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'
import ThemeToggle from './ThemeToggle'

const links = [
  ['Journey', '#journey'],
  ['Work', '#featured'],
  ['Skills', '#skills'],
  ['Projects', '#projects'],
  ['Game', '#game'],
  ['Research', '#research'],
  ['Contact', '#contact'],
]

export const openPalette = () => window.dispatchEvent(new Event('palette'))

export default function Nav() {
  const { scrollYProgress } = useScroll()
  const draw = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const [epoch, setEpoch] = useState(1)
  useEffect(() => {
    const on = () => setEpoch((e) => e + 1)
    window.addEventListener('epoch', on)
    return () => window.removeEventListener('epoch', on)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-line bg-paper">
      <nav className="wrap flex h-16 items-center gap-3" aria-label="Main">
        <a href="#top" className="brut-sm press grid h-10 w-10 shrink-0 place-items-center bg-lime font-display text-lg font-extrabold text-[#0a0a0a]" aria-label="Sabarish G, back to top">
          SG
        </a>
        {/* training-loss curve that draws as you scroll */}
        <div className="hidden items-center gap-2 sm:flex" aria-hidden="true" title="scroll = training">
          <svg width="74" height="30" viewBox="0 0 74 30">
            <path d="M2 28 H72 M2 2 V28" stroke="currentColor" strokeWidth="1.5" opacity=".4" fill="none" />
            <motion.path
              d="M4 4 C 12 20, 20 22, 30 24 S 55 26, 72 26"
              fill="none"
              stroke="var(--pink)"
              strokeWidth="3"
              strokeLinecap="round"
              style={{ pathLength: draw }}
            />
          </svg>
          <span className="font-mono text-xs leading-tight">
            epoch {epoch}
            <br />
            <span className="opacity-70">loss ↓</span>
          </span>
        </div>
        <ul className="ml-auto hidden items-center gap-1 lg:flex">
          {links.map(([l, h]) => (
            <li key={h}>
              <a href={h} className="rounded-md px-3 py-2 font-mono text-sm font-medium hover:bg-lime hover:text-[#0a0a0a]">
                {l}
              </a>
            </li>
          ))}
        </ul>
        <div className="ml-auto flex items-center gap-2 lg:ml-2">
          <button onClick={openPalette} className="brut-sm press bg-surface px-3 py-1.5 font-mono text-sm" aria-label="Open command palette">
            <span className="lg:hidden">Menu</span>
            <span className="hidden lg:inline">⌘K</span>
          </button>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
