import { motion } from 'framer-motion'
import { hideRepos, projects, site } from '../data/content'
import { fetchedAt, repos, RepoCard } from './ProjectBits'

const palette = ['var(--pink)', 'var(--cyan)', 'var(--lime)', 'var(--sun)', 'var(--violet)', 'var(--surface)']

export default function GitHubStats() {
  const own = repos.filter((r) => !r.fork && !hideRepos.includes(r.name))
  const known = new Set(projects.map((p) => p.repo?.toLowerCase()))
  const more = own.filter((r) => !known.has(r.name.toLowerCase()))
  const langs = Object.entries(
    own.reduce<Record<string, number>>((a, r) => {
      if (r.language) a[r.language] = (a[r.language] ?? 0) + 1
      return a
    }, {}),
  ).sort((a, b) => b[1] - a[1])
  const total = langs.reduce((s, [, n]) => s + n, 0)

  return (
    <section id="github" className="section wrap" aria-labelledby="gh-h">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="gh-h" className="h-section">
          On GitHub
        </h2>
        <p className="font-mono text-sm">
          {fetchedAt
            ? `snapshot ${new Date(fetchedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · refreshed weekly`
            : 'live snapshot unavailable at build time'}
        </p>
      </div>

      {own.length > 0 ? (
        <>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              [own.length, 'public repos'],
              [own.reduce((s, r) => s + r.stars, 0), 'stars'],
              [langs.length, 'languages'],
            ].map(([v, l]) => (
              <div key={l} className="brut p-4">
                <p className="font-display text-5xl font-extrabold leading-none">{v}</p>
                <p className="mt-1 font-mono text-sm font-bold">{l}</p>
              </div>
            ))}
          </div>
          <div className="brut mt-6 p-4">
            <p className="font-mono text-sm font-bold">primary language by repo</p>
            <div className="mt-3 flex h-10 overflow-hidden border-[3px] border-line" role="img" aria-label={langs.map(([l, n]) => `${l} ${n}`).join(', ')}>
              {langs.map(([l, n], i) => (
                <motion.div
                  key={l}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(n / total) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, type: 'spring', stiffness: 80, damping: 18 }}
                  className="h-full border-r-[3px] border-line last:border-r-0"
                  style={{ background: palette[i % palette.length] }}
                />
              ))}
            </div>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 font-mono text-sm">
              {langs.map(([l, n], i) => (
                <li key={l} className="flex items-center gap-1.5">
                  <span className="h-3 w-3 border-2 border-line" style={{ background: palette[i % palette.length] }} />
                  {l} {Math.round((n / total) * 100)}%
                </li>
              ))}
            </ul>
          </div>
          {more.length > 0 && (
            <>
              <h3 className="mt-12 text-3xl">More on GitHub</h3>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {more.map((r) => (
                  <li key={r.name} className="min-w-0">
                    <RepoCard name={r.name} fallback="No description yet." />
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      ) : (
        <p className="brut mt-8 p-5 text-lg">
          See every repo on{' '}
          <a className="font-bold underline" href={site.github} target="_blank" rel="noopener noreferrer">
            github.com/{site.githubUser}
          </a>
          .
        </p>
      )}
    </section>
  )
}
