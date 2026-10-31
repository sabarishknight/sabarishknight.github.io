// Runs before dev/build. Snapshots public GitHub repo data into src/data/github.json.
// If the network or API fails, keeps the previous snapshot (or an empty one) so the build never breaks.
import { readFile, writeFile } from 'node:fs/promises'

const USER = 'sabarishknight'
const OUT = new URL('../src/data/github.json', import.meta.url)
const headers = { 'User-Agent': `${USER}-portfolio`, Accept: 'application/vnd.github+json' }
if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`

try {
  const res = await fetch(`https://api.github.com/users/${USER}/repos?per_page=100&sort=pushed`, {
    headers,
    signal: AbortSignal.timeout(10000),
  })
  if (!res.ok) throw new Error(`GitHub API ${res.status}`)
  const repos = (await res.json()).map((r) => ({
    name: r.name,
    description: r.description,
    url: r.html_url,
    stars: r.stargazers_count,
    forks: r.forks_count,
    language: r.language,
    topics: r.topics ?? [],
    pushedAt: r.pushed_at,
    fork: r.fork,
  }))
  await writeFile(OUT, JSON.stringify({ fetchedAt: new Date().toISOString(), repos }, null, 2) + '\n')
  console.log(`[fetch-github] saved ${repos.length} repos`)
} catch (err) {
  let keep = false
  try {
    keep = JSON.parse(await readFile(OUT, 'utf8')).repos?.length > 0
  } catch {}
  if (!keep) await writeFile(OUT, JSON.stringify({ fetchedAt: null, repos: [] }, null, 2) + '\n')
  console.warn(`[fetch-github] ${err.message}; using ${keep ? 'previous snapshot' : 'content.ts fallback'}`)
}
