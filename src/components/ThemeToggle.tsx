import { useEffect, useState } from 'react'

export function setTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', dark ? '#0d0d10' : '#fff7e8')
  try {
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  } catch {}
  window.dispatchEvent(new Event('themechange'))
}

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  useEffect(() => {
    const on = () => setDark(document.documentElement.classList.contains('dark'))
    window.addEventListener('themechange', on)
    return () => window.removeEventListener('themechange', on)
  }, [])
  return (
    <button
      role="switch"
      aria-checked={dark}
      aria-label="Dark mode"
      onClick={() => setTheme(!dark)}
      className="brut-sm press relative h-10 w-[68px] bg-surface"
    >
      {/* tiny axes: the dot is a data point sliding along x */}
      <svg viewBox="0 0 68 40" className="absolute inset-0" aria-hidden="true">
        <path d="M10 8 V31 H58" stroke="currentColor" strokeWidth="2" fill="none" opacity=".55" />
        <path d="M14 31 v-3 M24 31 v-3 M34 31 v-3 M44 31 v-3 M54 31 v-3" stroke="currentColor" strokeWidth="1.5" opacity=".55" />
        <circle
          cx={dark ? 48 : 20}
          cy={dark ? 14 : 22}
          r="7"
          fill={dark ? 'var(--violet)' : 'var(--sun)'}
          stroke="var(--line)"
          strokeWidth="2.5"
          style={{ transition: 'cx .35s cubic-bezier(.3,1.6,.5,1), cy .35s, fill .3s' }}
        />
      </svg>
    </button>
  )
}
