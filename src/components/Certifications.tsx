import { motion } from 'framer-motion'
import { certifications } from '../data/content'
import { SkillIcon } from '../lib/icons'

const bgs = ['var(--lime)', 'var(--pink)', 'var(--sun)', 'var(--cyan)', 'var(--violet)', 'var(--lime)']
const tilt = [-3, 2, -1.5, 3, -2, 1.5]

export default function Certifications() {
  return (
    <section id="certifications" className="section wrap" aria-labelledby="cert-h">
      <h2 id="cert-h" className="h-section">
        Certifications
      </h2>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((c, i) => {
          const body = (
            <>
              <span className="brut-sm grid h-12 w-12 place-items-center bg-white">
                <SkillIcon name={c.issuer} slug={c.icon} size={28} />
              </span>
              <span className="mt-4 block font-display text-[1.45rem] font-bold leading-tight tracking-tight">{c.name}</span>
              <span className="mt-2 block font-mono text-sm font-semibold">
                {c.issuer}
                {c.year && ` · ${c.year}`}
              </span>
            </>
          )
          return (
            <motion.li
              key={c.name}
              initial={{ opacity: 0, y: 40, rotate: 0 }}
              whileInView={{ opacity: 1, y: 0, rotate: tilt[i] }}
              whileHover={{ rotate: 0, scale: 1.03 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ type: 'spring', stiffness: 200, damping: 14 }}
              className="brut on-accent p-5"
              style={{ background: bgs[i % bgs.length] }}
            >
              {c.url ? (
                <a href={c.url} target="_blank" rel="noopener noreferrer" className="block">
                  {body}
                </a>
              ) : (
                body
              )}
            </motion.li>
          )
        })}
      </ul>
    </section>
  )
}
