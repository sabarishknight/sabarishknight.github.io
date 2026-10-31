import { lazy, Suspense } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Journey from './components/Journey'
import Featured from './components/Featured'
import Marquee from './components/Marquee'
import Projects from './components/Projects'
import AnomalyHunt from './components/AnomalyHunt'
import Research from './components/Research'
import Footer from './components/Footer'
import CommandPalette from './components/CommandPalette'
import Konami from './components/Konami'
import Toasts from './components/Toasts'
import DataBackdrop from './components/DataBackdrop'
import { toolBand } from './data/content'
import { SkillIcon } from './lib/icons'

const Skills = lazy(() => import('./components/Skills'))

const logos = toolBand.map((t) => (
  <span key={t.name} className="flex items-center gap-3">
    <span className="grid h-12 w-12 place-items-center rounded-lg bg-white">
      <SkillIcon name={t.name} slug={t.icon} size={32} />
    </span>
    {t.name}
  </span>
))

export default function App() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] brut px-4 py-2 font-mono">
        Skip to content
      </a>
      <DataBackdrop />
      <Nav />
      <main id="main">
        <Hero />
        <Marquee items={logos} />
        <Journey />
        <Featured />
        <Suspense fallback={<div className="section wrap h-[60vh]" id="skills" />}>
          <Skills />
        </Suspense>
        <Projects />
        <AnomalyHunt />
        <Research />
        <div className="max-md:hidden">
          <Marquee items={['first author', 'arXiv:2610.22437', 'no gradients', 'no target batches', 'one image at a time', '5 unseen datasets']} reverse tone="pink" />
        </div>
      </main>
      <Footer />
      <CommandPalette />
      <Konami />
      <Toasts />
    </>
  )
}
