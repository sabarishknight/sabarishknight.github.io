import { useState } from 'react'
import { motion } from 'framer-motion'
import { site } from '../data/content'

const vibes = ['Loved it', 'Fun but busy', 'More research please', 'Let’s talk about a role', 'Found a bug']
const faces = ['meh', 'ok', 'good', 'great', 'wow']

export default function Feedback() {
  const [vibe, setVibe] = useState<string | null>(null)
  const [rating, setRating] = useState(0)
  const [name, setName] = useState('')
  const [msg, setMsg] = useState('')

  const body = [`Rating: ${rating ? `${rating}/5 (${faces[rating - 1]})` : 'not given'}`, `Vibe: ${vibe ?? 'not given'}`, '', msg, name ? `— ${name}` : ''].join('\n')
  const subject = `Portfolio feedback${vibe ? `: ${vibe}` : ''}`
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  const issue = `https://github.com/${site.githubUser}/${site.githubUser}.github.io/issues/new?title=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  return (
    <section id="feedback" className="section wrap" aria-labelledby="fb-h">
      <div className="brut on-accent grid gap-8 bg-violet p-6 md:grid-cols-[1fr_1.3fr] md:p-10">
        <div>
          <h2 id="fb-h" className="text-[clamp(2.4rem,6vw,4.6rem)]">
            Rate this model
          </h2>
          <p className="mt-4 text-lg">You’ve seen the outputs. Leave a label so I can retrain: what worked, what didn’t, what you’d want to see.</p>
          <p className="mt-4 font-mono text-sm">Nothing is stored on this site. Send opens your email app (or a GitHub issue) with your note filled in.</p>
        </div>
        <form
          className="brut grid gap-5 bg-white p-5"
          onSubmit={(e) => {
            e.preventDefault()
            window.location.href = mailto
          }}
        >
          <fieldset>
            <legend className="font-display text-xl font-bold">How was it?</legend>
            <div className="mt-2 flex gap-2" role="radiogroup" aria-label="Rating from 1 to 5">
              {faces.map((f, i) => (
                <motion.button
                  key={f}
                  type="button"
                  role="radio"
                  aria-checked={rating === i + 1}
                  aria-label={`${i + 1} of 5: ${f}`}
                  onClick={() => setRating(i + 1)}
                  whileTap={{ scale: 0.85 }}
                  className="brut-sm grid h-12 flex-1 place-items-center font-mono text-xs font-bold"
                  style={{ background: rating > i ? ['var(--cyan)', 'var(--lime)', 'var(--sun)', 'var(--pink)', '#ff7a00'][i] : '#fff' }}
                >
                  <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
                    <rect x="3" y={23 - (i + 1) * 4} width="20" height={(i + 1) * 4} fill="#0a0a0a" />
                  </svg>
                </motion.button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="font-display text-xl font-bold">Pick a label</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {vibes.map((v) => (
                <button
                  key={v}
                  type="button"
                  aria-pressed={vibe === v}
                  onClick={() => setVibe(vibe === v ? null : v)}
                  className="brut-sm press px-3 py-1.5 text-sm font-semibold aria-pressed:bg-lime"
                  style={vibe === v ? undefined : { background: '#fff' }}
                >
                  {v}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="grid gap-1.5">
            <span className="font-display text-xl font-bold">Your note</span>
            <textarea
              name="message"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              rows={4}
              placeholder="The physics playground ate my afternoon…"
              className="brut-sm resize-y bg-white px-3 py-2 text-[16px] text-[#0a0a0a] placeholder:text-[#555]"
            />
          </label>
          <label className="grid gap-1.5">
            <span className="font-display text-xl font-bold">
              Name <span className="font-mono text-sm font-medium">(optional)</span>
            </span>
            <input name="name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="brut-sm bg-white px-3 py-2 text-[16px] text-[#0a0a0a]" />
          </label>
          <div className="flex flex-wrap gap-3">
            <button type="submit" className="brut-sm press bg-pink px-5 py-3 font-display text-lg font-bold disabled:opacity-50">
              Send by email →
            </button>
            <a href={issue} target="_blank" rel="noopener noreferrer" className="brut-sm press bg-white px-5 py-3 font-display text-lg font-bold">
              Post as GitHub issue
            </a>
          </div>
        </form>
      </div>
    </section>
  )
}
