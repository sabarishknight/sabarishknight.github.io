import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { site } from '../data/content'
import { setTheme } from './ThemeToggle'
import { runEpoch } from './Footer'

type Cmd = { name: string; hint: string; run: () => void }
const go = (id: string) => () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
const open = (url: string) => () => window.open(url, '_blank', 'noopener')

const commands: Cmd[] = [
  { name: 'projects', hint: 'jump to all projects', run: go('projects') },
  { name: 'featured', hint: 'top 4 case studies', run: go('featured') },
  { name: 'research', hint: 'CF-NODE paper', run: go('research') },
  { name: 'skills', hint: 'physics playground', run: go('skills') },
  { name: 'game', hint: 'guess the metric', run: go('game') },
  { name: 'journey', hint: 'timeline', run: go('journey') },
  { name: 'experience', hint: 'Wego, Jetapult', run: go('experience') },
  { name: 'feedback', hint: 'rate this site', run: go('feedback') },
  { name: 'resume', hint: 'download PDF', run: open(site.resume) },
  { name: 'email', hint: site.email, run: () => (window.location.href = `mailto:${site.email}`) },
  { name: 'github', hint: 'open GitHub', run: open(site.github) },
  { name: 'linkedin', hint: 'open LinkedIn', run: open(site.linkedin) },
  { name: 'arxiv', hint: 'open the paper', run: open(site.arxiv) },
  { name: 'theme', hint: 'toggle dark mode', run: () => setTheme(!document.documentElement.classList.contains('dark')) },
  { name: 'konami', hint: 'you know what this does', run: () => window.dispatchEvent(new Event('konami')) },
  { name: 'epoch', hint: 'loop back to the top', run: runEpoch },
]

export default function CommandPalette() {
  const [isOpen, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const lastFocus = useRef<HTMLElement | null>(null)
  const list = useMemo(() => commands.filter((c) => c.name.includes(q.trim().toLowerCase()) || c.hint.toLowerCase().includes(q.trim().toLowerCase())), [q])

  useEffect(() => {
    const show = () => {
      lastFocus.current = document.activeElement as HTMLElement
      setOpen(true)
      setQ('')
      setSel(0)
    }
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement).closest('input,textarea,select,[contenteditable]')
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) {
        e.preventDefault()
        show()
      }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('palette', show)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('palette', show)
    }
  }, [])
  useEffect(() => {
    if (isOpen) setTimeout(() => input.current?.focus(), 10)
    else lastFocus.current?.focus?.()
  }, [isOpen])

  const exec = (c?: Cmd) => {
    if (!c) return
    setOpen(false)
    setTimeout(c.run, 60)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-[95] grid place-items-start bg-black/50 px-4 pt-[14vh]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            initial={{ y: -20, scale: 0.96 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="brut mx-auto w-full max-w-xl overflow-hidden bg-surface font-mono"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setOpen(false)
              if (e.key === 'ArrowDown') (e.preventDefault(), setSel((s) => Math.min(list.length - 1, s + 1)))
              if (e.key === 'ArrowUp') (e.preventDefault(), setSel((s) => Math.max(0, s - 1)))
              if (e.key === 'Enter') exec(list[sel])
              if (e.key === 'Tab') e.preventDefault()
            }}
          >
            <div className="flex items-center gap-2 border-b-[3px] border-line bg-ink px-4 py-3 text-paper">
              <span className="text-lime">sabarish@portfolio:~$</span>
              <input
                ref={input}
                value={q}
                onChange={(e) => (setQ(e.target.value), setSel(0))}
                placeholder="type a command, e.g. research…"
                aria-label="Command"
                spellCheck={false}
                autoComplete="off"
                aria-controls="cmd-list"
                aria-activedescendant={list[sel] ? `cmd-${list[sel].name}` : undefined}
                className="flex-1 bg-transparent text-paper outline-none placeholder:text-paper/60"
              />
            </div>
            <ul id="cmd-list" role="listbox" className="max-h-[50vh] overflow-y-auto py-1">
              {list.map((c, i) => (
                <li
                  key={c.name}
                  id={`cmd-${c.name}`}
                  role="option"
                  aria-selected={i === sel}
                  onMouseEnter={() => setSel(i)}
                  onClick={() => exec(c)}
                  className={`flex cursor-pointer justify-between gap-4 px-4 py-2 ${i === sel ? 'bg-lime text-[#0a0a0a]' : ''}`}
                >
                  <span className="font-bold">{c.name}</span>
                  <span className="truncate opacity-80">{c.hint}</span>
                </li>
              ))}
              {list.length === 0 && <li className="px-4 py-3">command not found: {q}</li>}
            </ul>
            <p className="border-t-2 border-line px-4 py-2 text-xs opacity-80">↑↓ to move · enter to run · esc to close</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
