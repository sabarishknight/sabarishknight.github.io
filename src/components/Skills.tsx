import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { coreSkills, projects, skillGroups, type Skill } from '../data/content'
import { SkillIcon } from '../lib/icons'
import { accentVar } from '../lib/util'

const all = [...coreSkills, ...skillGroups]
  .flatMap((g) => g.skills.map((s) => ({ ...s, accent: g.accent, group: g.group })))
  .filter((s, i, arr) => arr.findIndex((x) => x.name === s.name) === i)

/** projects whose tool list mentions this skill */
const usedIn = (s: Skill) => {
  const key = s.name.toLowerCase().split(/[ /(]/)[0]
  return projects.filter((p) => p.tools.some((t) => t.toLowerCase().includes(key))).map((p) => p.short)
}

export default function Skills() {
  const reduce = useReducedMotion()
  const [picked, setPicked] = useState<Skill | null>(null)
  const used = picked ? usedIn(picked) : []
  return (
    <section id="skills" className="section wrap" aria-labelledby="skills-h">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="skills-h" className="h-section">
          Skills playground
        </h2>
        <p className="max-w-[40ch] text-lg">Grab a logo, throw it, stack them. Click one to see which project used it.</p>
      </div>

      {!reduce && <Physics onPick={setPicked} />}

      <p className="brut-sm mt-5 bg-surface px-4 py-3 font-mono text-sm" aria-live="polite">
        <span className="text-pink">In [2]:</span> used_in("{picked?.name ?? '…'}")
        <br />
        <span className="opacity-80">Out[2]:</span>{' '}
        {picked ? (used.length ? used.join(' · ') : 'my finance roles and coursework') : 'pick a skill above or below'}
      </p>

      <h3 className="mt-16 text-[clamp(2rem,4.5vw,3.4rem)]">Core skills</h3>
      <p className="mt-3 max-w-[60ch] text-lg">What I use every week and am happy to be tested on in an interview.</p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
        {coreSkills.map((g, gi) => (
          <Group key={g.group} g={g} i={gi} picked={picked} onPick={setPicked} big />
        ))}
      </div>

      <h3 className="mt-16 text-[clamp(1.6rem,3.2vw,2.4rem)]">Also used in my projects</h3>
      <p className="mt-3 max-w-[64ch] text-[17px]">
        Tools I’ve worked with hands-on while building the projects below, often with AI coding assistants. I understand how each one works and why I used it, and I’m still building depth.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {skillGroups.map((g, gi) => (
          <Group key={g.group} g={g} i={gi} picked={picked} onPick={setPicked} />
        ))}
      </div>
    </section>
  )
}

function Group({ g, i, picked, onPick, big }: { g: (typeof skillGroups)[number]; i: number; picked: Skill | null; onPick: (s: Skill) => void; big?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ delay: (i % 5) * 0.07 }}
      className={`brut p-4 ${big ? '' : 'opacity-95'}`}
    >
      <h4 className={`on-accent -mx-4 -mt-4 mb-3 border-b-[3px] border-line px-4 py-2 ${big ? 'text-2xl' : 'text-lg'}`} style={{ background: accentVar[g.accent] }}>
        {g.group}
      </h4>
      <ul className={big ? 'grid gap-2' : 'flex flex-wrap gap-1.5'}>
        {g.skills.map((s) => (
          <li key={s.name}>
            <button
              onClick={() => onPick(s)}
              aria-pressed={picked?.name === s.name}
              className={`flex items-center gap-2 rounded-md border-2 border-line text-left hover:bg-lime hover:text-[#0a0a0a] aria-pressed:bg-pink aria-pressed:text-[#0a0a0a] ${big ? 'w-full px-2.5 py-1.5 text-[15px] font-semibold' : 'px-2 py-1 text-sm'}`}
            >
              <SkillIcon name={s.name} slug={s.icon} color={s.color} size={big ? 20 : 16} />
              {s.name}
            </button>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}

function Physics({ onPick }: { onPick: (s: Skill) => void }) {
  const box = useRef<HTMLDivElement>(null)
  const chips = useRef<(HTMLDivElement | null)[]>([])
  const api = useRef<{ shake: () => void; reset: () => void } | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cleanup = () => {}
    let cancelled = false
    const start = async () => {
      const M = (await import('matter-js')).default
      if (cancelled) return
      const el = box.current!
      const W = el.clientWidth
      const H = el.clientHeight
      const engine = M.Engine.create({ gravity: { x: 0, y: 1 } })
      const T = 60
      const walls = [
        M.Bodies.rectangle(W / 2, H + T / 2, W * 3, T, { isStatic: true }),
        M.Bodies.rectangle(-T / 2, H / 2, T, H * 4, { isStatic: true }),
        M.Bodies.rectangle(W + T / 2, H / 2, T, H * 4, { isStatic: true }),
        M.Bodies.rectangle(W / 2, -H * 1.5 - T / 2, W * 3, T, { isStatic: true }),
      ]
      const spawn = (i: number) => ({ x: 40 + ((i * 97) % Math.max(1, W - 80)), y: -40 - Math.floor(i / 6) * 50 })
      const bodies = chips.current.map((c, i) => {
        const { x, y } = spawn(i)
        return M.Bodies.rectangle(x, y, c!.offsetWidth, c!.offsetHeight, {
          chamfer: { radius: 10 },
          restitution: 0.45,
          friction: 0.2,
          angle: (Math.random() - 0.5) * 0.6,
        })
      })
      M.Composite.add(engine.world, [...walls, ...bodies])

      const mouse = M.Mouse.create(el)
      // let the page scroll with the wheel over the box
      const m = mouse as unknown as { mousewheel: EventListener; element: HTMLElement }
      m.element.removeEventListener('wheel', m.mousewheel)
      m.element.removeEventListener('mousewheel', m.mousewheel)
      m.element.removeEventListener('DOMMouseScroll', m.mousewheel)
      const mc = M.MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, damping: 0.1 } })
      M.Composite.add(engine.world, mc)

      // click (press + release without travel) picks a skill
      let down: { x: number; y: number; body: Matter.Body | null } | null = null
      M.Events.on(mc, 'mousedown', () => {
        const hit = M.Query.point(bodies, mouse.position)[0] ?? null
        down = { x: mouse.position.x, y: mouse.position.y, body: hit }
      })
      M.Events.on(mc, 'mouseup', () => {
        if (down?.body && Math.hypot(mouse.position.x - down.x, mouse.position.y - down.y) < 6) {
          onPick(all[bodies.indexOf(down.body)])
        }
        down = null
      })

      let raf = 0
      let visible = true
      const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
      io.observe(el)
      let last = performance.now()
      const loop = (t: number) => {
        const dt = Math.min(32, t - last)
        last = t
        if (visible) {
          M.Engine.update(engine, dt)
          bodies.forEach((b, i) => {
            const c = chips.current[i]!
            c.style.transform = `translate(${b.position.x - c.offsetWidth / 2}px, ${b.position.y - c.offsetHeight / 2}px) rotate(${b.angle}rad)`
          })
        }
        raf = requestAnimationFrame(loop)
      }
      raf = requestAnimationFrame(loop)

      api.current = {
        shake: () =>
          bodies.forEach((b) => M.Body.setVelocity(b, { x: (Math.random() - 0.5) * 16, y: -7 - Math.random() * 7 })),
        reset: () =>
          bodies.forEach((b, i) => {
            M.Body.setPosition(b, spawn(i))
            M.Body.setVelocity(b, { x: 0, y: 0 })
            M.Body.setAngle(b, (Math.random() - 0.5) * 0.6)
          }),
      }
      setReady(true)
      cleanup = () => {
        cancelAnimationFrame(raf)
        io.disconnect()
        M.Engine.clear(engine)
      }
    }
    // start once the box is near the viewport
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect()
          start()
        }
      },
      { rootMargin: '200px' },
    )
    io.observe(box.current!)
    return () => {
      cancelled = true
      io.disconnect()
      cleanup()
    }
  }, [onPick])

  return (
    <div className="mt-8">
      <div className="mb-3 flex gap-3">
        <button onClick={() => api.current?.shake()} disabled={!ready} className="brut-sm press bg-sun px-4 py-2 font-display text-lg font-bold text-[#0a0a0a]">
          Shake
        </button>
        <button onClick={() => api.current?.reset()} disabled={!ready} className="brut-sm press bg-surface px-4 py-2 font-display text-lg font-bold">
          Reset
        </button>
      </div>
      <div
        ref={box}
        className="brut relative h-[440px] touch-none overflow-hidden bg-paper md:h-[520px]"
        style={{ backgroundImage: 'radial-gradient(var(--grid) 2px, transparent 2px)', backgroundSize: '22px 22px' }}
        aria-label="Physics playground of skill logos. Mouse or touch to drag; the list below has the same skills as buttons."
        role="img"
      >
        {all.map((s, i) => (
          <div
            key={s.name}
            ref={(n) => {
              chips.current[i] = n
            }}
            className="brut-sm absolute left-0 top-0 flex cursor-grab select-none items-center gap-1.5 whitespace-nowrap rounded-[10px] px-2.5 py-1.5 text-sm font-semibold will-change-transform active:cursor-grabbing"
            style={{ background: accentVar[s.accent], color: '#0a0a0a', borderColor: '#0a0a0a', transform: 'translate(-999px,-999px)' }}
            aria-hidden="true"
          >
            <SkillIcon name={s.name} slug={s.icon} color={s.color} size={18} />
            {s.name}
          </div>
        ))}
      </div>
    </div>
  )
}
