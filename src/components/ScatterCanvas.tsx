import { useEffect, useRef, type RefObject } from 'react'
import { rng } from '../lib/util'

type Pt = { x: number; y: number; ox: number; oy: number; ph: number; c: number; user?: boolean; life?: number }

const COLORS = ['--pink', '--cyan', '--lime', '--sun', '--violet']

/**
 * Live scatter plot behind the hero. Points drift; an OLS line refits every frame.
 * Click adds a point that joins the fit; the cursor leaves a fading scatter trail (fine pointers only).
 */
export default function ScatterCanvas({ host }: { host: RefObject<HTMLElement> }) {
  const cv = useRef<HTMLCanvasElement>(null)
  const readout = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const canvas = cv.current!
    const el = host.current!
    const ctx = canvas.getContext('2d')!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = window.matchMedia('(pointer: fine)').matches
    const r = rng(7)
    const pts: Pt[] = Array.from({ length: 70 }, () => {
      const x = r()
      const y = 0.18 + 0.6 * x + (r() - 0.5) * 0.32
      return { x, y, ox: x, oy: y, ph: r() * Math.PI * 2, c: Math.floor(r() * 5) }
    })
    const trail: Pt[] = []
    let colors: string[] = []
    let ink = '#000'
    const readColors = () => {
      const s = getComputedStyle(document.documentElement)
      colors = COLORS.map((v) => s.getPropertyValue(v).trim())
      ink = s.getPropertyValue('--ink').trim()
    }
    readColors()
    window.addEventListener('themechange', readColors)
    const neonObs = new MutationObserver(readColors)
    neonObs.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    let w = 0
    let h = 0
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      w = el.clientWidth
      h = el.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (reduce) draw(0)
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    const toLocal = (e: PointerEvent) => {
      const b = el.getBoundingClientRect()
      return { x: (e.clientX - b.left) / w, y: 1 - (e.clientY - b.top) / h }
    }
    const onClick = (e: PointerEvent) => {
      if ((e.target as HTMLElement).closest('a,button,input,label,[data-no-add]')) return
      const p = toLocal(e)
      pts.push({ ...p, ox: p.x, oy: p.y, ph: 0, c: Math.floor(Math.random() * 5), user: true })
      if (reduce) draw(0)
    }
    let last = 0
    const onMove = (e: PointerEvent) => {
      const now = performance.now()
      if (now - last < 28) return
      last = now
      const p = toLocal(e)
      trail.push({ ...p, ox: 0, oy: 0, ph: 0, c: trail.length % 5, life: 1 })
      if (trail.length > 40) trail.shift()
    }
    el.addEventListener('pointerup', onClick)
    if (fine && !reduce) el.addEventListener('pointermove', onMove)

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      const X = (x: number) => x * w
      const Y = (y: number) => (1 - y) * h
      // OLS fit
      let sx = 0, sy = 0, sxx = 0, sxy = 0, syy = 0
      const n = pts.length
      for (const p of pts) {
        if (!reduce && !p.user) {
          p.x = p.ox + Math.sin(t / 2400 + p.ph) * 0.012
          p.y = p.oy + Math.cos(t / 2000 + p.ph) * 0.02
        }
        sx += p.x; sy += p.y; sxx += p.x * p.x; sxy += p.x * p.y; syy += p.y * p.y
      }
      const b = (n * sxy - sx * sy) / (n * sxx - sx * sx)
      const a = (sy - b * sx) / n
      const rr = (n * sxy - sx * sy) / Math.sqrt((n * sxx - sx * sx) * (n * syy - sy * sy))
      // residual sticks, then points
      ctx.globalAlpha = 0.22
      ctx.strokeStyle = ink
      ctx.lineWidth = 1
      for (const p of pts) {
        ctx.beginPath()
        ctx.moveTo(X(p.x), Y(p.y))
        ctx.lineTo(X(p.x), Y(a + b * p.x))
        ctx.stroke()
      }
      ctx.globalAlpha = 1
      for (const p of pts) {
        ctx.beginPath()
        ctx.arc(X(p.x), Y(p.y), p.user ? 9 : 7, 0, Math.PI * 2)
        ctx.fillStyle = colors[p.c]
        ctx.fill()
        ctx.lineWidth = p.user ? 3 : 2
        ctx.strokeStyle = ink
        ctx.stroke()
      }
      for (const p of trail) {
        p.life! -= 0.02
        if (p.life! <= 0) continue
        ctx.globalAlpha = p.life!
        ctx.beginPath()
        ctx.arc(X(p.x), Y(p.y), 4 + 4 * p.life!, 0, Math.PI * 2)
        ctx.fillStyle = colors[p.c]
        ctx.fill()
      }
      ctx.globalAlpha = 1
      // fit line
      ctx.beginPath()
      ctx.moveTo(X(0), Y(a))
      ctx.lineTo(X(1), Y(a + b))
      ctx.strokeStyle = ink
      ctx.lineWidth = 4
      ctx.setLineDash([14, 10])
      ctx.stroke()
      ctx.setLineDash([])
      if (readout.current)
        readout.current.textContent = `n=${n}  ŷ = ${a.toFixed(2)} + ${b.toFixed(2)}x  R²=${(rr * rr).toFixed(2)}`
    }

    let raf = 0
    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(el)
    const loop = (t: number) => {
      if (visible) draw(t)
      raf = requestAnimationFrame(loop)
    }
    if (!reduce) raf = requestAnimationFrame(loop)
    else draw(0)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      neonObs.disconnect()
      window.removeEventListener('themechange', readColors)
      el.removeEventListener('pointerup', onClick)
      el.removeEventListener('pointermove', onMove)
    }
  }, [host])

  return (
    <>
      <canvas ref={cv} className="absolute inset-0 h-full w-full opacity-[0.55] dark:opacity-40" aria-hidden="true" />
      <p
        ref={readout}
        className="brut-sm absolute right-4 top-4 z-10 hidden bg-surface px-2 py-1 font-mono text-xs md:block"
        aria-hidden="true"
        data-no-add
      />
    </>
  )
}
