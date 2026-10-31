import type { Project } from '../data/content'

export const accentVar: Record<Project['accent'], string> = {
  lime: 'var(--lime)',
  pink: 'var(--pink)',
  cyan: 'var(--cyan)',
  sun: 'var(--sun)',
  violet: 'var(--violet)',
}

/** tiny global toast bus; the <Toasts/> component listens */
export function toast(text: string) {
  window.dispatchEvent(new CustomEvent('toast', { detail: text }))
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** seeded PRNG so "random" illustrations look the same on every visit */
export function rng(seed: number) {
  return () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
}
