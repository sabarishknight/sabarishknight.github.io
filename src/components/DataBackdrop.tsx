import { useEffect, useRef } from 'react'
import { rng } from '../lib/util'

/**
 * Faint live "dashboard" behind the page below the hero: a time series that scrolls with you
 * (plus its moving average) and a histogram that fills into a bell curve as you read down.
 */
export default function DataBackdrop() {
  const cv = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const c = cv.current!
    const ctx = c.getContext('2d')!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const r = rng(42)
    // one long random walk, sampled every 14px of scroll
    const walk: number[] = [0]
    for (let i = 1; i < 2400; i++) walk.push(walk[i - 1] * 0.97 + (r() - 0.5) * 0.9 + Math.sin(i / 40) * 0.08)
    // normal samples for the histogram
    const samples = Array.from({ length: 900 }, () => {
      let u = 0
      for (let k = 0; k < 6; k++) u += r()
      return (u - 3) / 1.0 // ≈ N(0, 0.5²·2)
    })

    let ink = '#000'
    let pink = '#f39'
    let cyan = '#2de'
    const colors = () => {
      const s = getComputedStyle(document.documentElement)
      ink = s.getPropertyValue('--ink').trim()
      pink = s.getPropertyValue('--pink').trim()
      cyan = s.getPropertyValue('--cyan').trim()
    }
    colors()
    const mo = new MutationObserver(colors)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    let w = 0
    let h = 0
    const resize = () => {
      const dpr = Math.min(2, devicePixelRatio || 1)
      w = innerWidth
      h = innerHeight
      c.width = w * dpr
      c.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    addEventListener('resize', resize)

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      const y = scrollY
      const max = Math.max(1, document.documentElement.scrollHeight - h)
      const fade = Math.min(1, Math.max(0, (y - h * 0.6) / (h * 0.5))) // invisible over the hero
      if (fade <= 0) return
      ctx.globalAlpha = 0.16 * fade

      // time series: scrolling moves the window along the walk
      const step = 14
      const start = Math.floor(y / step)
      const n = Math.ceil(w / step) + 2
      const off = -(y % step)
      const baseY = h * 0.42
      const amp = h * 0.05
      const at = (i: number) => baseY - walk[(start + i) % walk.length] * amp + (reduce ? 0 : Math.sin(t / 900 + i / 3) * 2)
      ctx.lineWidth = 2.5
      ctx.strokeStyle = ink
      ctx.beginPath()
      for (let i = 0; i < n; i++) ctx[i ? 'lineTo' : 'moveTo'](off + i * step, at(i))
      ctx.stroke()
      // 12-point moving average
      ctx.strokeStyle = pink
      ctx.lineWidth = 4
      ctx.beginPath()
      for (let i = 0; i < n; i++) {
        let s = 0
        for (let k = 0; k < 12; k++) s += at(i - k)
        ctx[i ? 'lineTo' : 'moveTo'](off + i * step, s / 12)
      }
      ctx.stroke()

      // histogram fills toward a bell curve with reading progress
      const bins = 36
      const counts = new Array(bins).fill(0)
      const take = Math.floor(samples.length * Math.min(1, y / max))
      for (let i = 0; i < take; i++) {
        const b = Math.floor(((samples[i] + 2.4) / 4.8) * bins)
        if (b >= 0 && b < bins) counts[b]++
      }
      const bw = w / bins
      const top = Math.max(1, ...counts)
      ctx.fillStyle = cyan
      ctx.strokeStyle = ink
      ctx.lineWidth = 2
      for (let b = 0; b < bins; b++) {
        const bh = (counts[b] / top) * h * 0.22 * Math.min(1, take / 120)
        ctx.fillRect(b * bw + 2, h - bh, bw - 4, bh)
        ctx.strokeRect(b * bw + 2, h - bh, bw - 4, bh)
      }
      ctx.globalAlpha = 1
    }

    let raf = 0
    const loop = (t: number) => {
      if (!document.hidden) draw(t)
      raf = requestAnimationFrame(loop)
    }
    const onScroll = () => draw(0)
    if (reduce) {
      addEventListener('scroll', onScroll, { passive: true })
      draw(0)
    } else raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      mo.disconnect()
      removeEventListener('resize', resize)
      removeEventListener('scroll', onScroll)
    }
  }, [])

  return <canvas ref={cv} className="pointer-events-none fixed inset-0 -z-10 h-full w-full" aria-hidden="true" />
}
