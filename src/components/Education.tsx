import { motion } from 'framer-motion'
import { education } from '../data/content'

export default function Education() {
  return (
    <section id="education" className="section wrap" aria-labelledby="edu-h">
      <h2 id="edu-h" className="h-section">
        Education
      </h2>
      <div className="mt-10 grid gap-6 md:grid-cols-[1.4fr_1fr]">
        {education.map((e, i) => (
          <motion.article
            key={e.degree}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`brut p-6 ${i === 0 ? 'on-accent bg-cyan' : ''}`}
          >
            <p className="font-mono text-sm font-bold">
              {e.years}
              {e.note && ` · ${e.note}`}
            </p>
            <h3 className="mt-2 text-[clamp(2rem,4vw,3rem)]">{e.degree}</h3>
            <p className="mt-1 text-lg font-semibold">{e.school}</p>
            {e.coursework.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {e.coursework.map((c) => (
                  <li key={c} className="brut-sm bg-white px-2.5 py-1 font-mono text-sm">
                    {c}
                  </li>
                ))}
              </ul>
            )}
          </motion.article>
        ))}
      </div>
    </section>
  )
}
