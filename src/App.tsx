import { lazy, Suspense } from 'react'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Featured from './components/Featured'
import Marquee from './components/Marquee'
import Projects from './components/Projects'
import GuessGame from './components/GuessGame'
import Research from './components/Research'
import Journey from './components/Journey'
import Experience from './components/Experience'
import Education from './components/Education'
import Certifications from './components/Certifications'
import GitHubStats from './components/GitHubStats'
import Feedback from './components/Feedback'
import Footer from './components/Footer'
import CommandPalette from './components/CommandPalette'
import Konami from './components/Konami'
import Toasts from './components/Toasts'
import { marquee } from './data/content'

const Skills = lazy(() => import('./components/Skills'))

export default function App() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] brut px-4 py-2 font-mono">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Marquee items={marquee} />
        <Featured />
        <Suspense fallback={<div className="section wrap h-[60vh]" id="skills" />}>
          <Skills />
        </Suspense>
        <Projects />
        <GuessGame />
        <Research />
        <Marquee items={['first author', 'arXiv:2610.22437', 'no gradients', 'no target batches', 'one image at a time', '5 unseen datasets']} reverse tone="pink" />
        <Journey />
        <Experience />
        <Education />
        <Certifications />
        <GitHubStats />
        <Feedback />
      </main>
      <Footer />
      <CommandPalette />
      <Konami />
      <Toasts />
    </>
  )
}
