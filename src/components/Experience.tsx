import { motion } from 'framer-motion'
import { experience } from '../data/content'
import { accentVar } from '../lib/util'

export default function Experience() {
  return (
    <section id="experience" className="section wrap" aria-labelledby="exp-h">
      <h2 id="exp-h" className="h-section">
        Experience
      </h2>
      <div className="mt-10 grid gap-8">
        {experience.map((e, i) => (
          <motion.article
            key={e.company}
            initial={{ opacity: 0, y: 30, rotate: i % 2 ? 1 : -1 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="brut grid overflow-hidden md:grid-cols-[minmax(240px,0.6fr)_1.4fr]"
          >
            <div className="on-accent border-b-[3px] border-line p-6 md:border-b-0 md:border-r-[3px]" style={{ background: accentVar[e.accent] }}>
              <h3 className="text-[clamp(2.4rem,5vw,3.8rem)]">{e.company}</h3>
              <p className="mt-2 font-semibold">{e.about}</p>
              <p className="mt-4 font-display text-xl font-bold">{e.role}</p>
              <p className="font-mono text-sm">
                {e.dates} · {e.location}
              </p>
              {e.extra && <p className="mt-1 font-mono text-xs">{e.extra}</p>}
              {e.stats.length > 0 && (
                <div className="mt-5 flex gap-3">
                  {e.stats.map((s) => (
                    <div key={s.label} className="brut-sm bg-white px-3 py-2">
                      <p className="font-display text-3xl font-extrabold leading-none">{s.value}</p>
                      <p className="font-mono text-xs font-bold">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6">
              <ul className="grid gap-3 text-[17px]">
                {e.bullets.map((b) => (
                  <li key={b} className="flex gap-3">
                    <span className="mt-2 h-3 w-3 flex-none border-2 border-line bg-pink" aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
              <ul className="mt-5 flex flex-wrap gap-1.5">
                {e.tags.map((t) => (
                  <li key={t} className="border-2 border-line px-2 py-0.5 font-mono text-xs">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  )
}
