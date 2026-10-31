import { siWhatsapp, siPython, siPostgresql, siGooglebigquery, siDuckdb, siApacheparquet, siDbt, siGit, siPandas, siNumpy, siJupyter, siScikitlearn, siPytorch, siOpencv, siOnnx, siLangchain, siAnthropic, siClaude, siFastapi, siTableau, siLooker, siStreamlit, siJira, siPytest, siFlask, siGooglecloud, siTerraform, siGooglesheets, siUv, siCoursera, siGoogle, siAtlassian, siGithub, siLinkedin, siGmail, siArxiv } from 'simple-icons'

type SI = { path: string; hex: string; title: string }
// named imports keep the bundle to the logos actually used; add new ones here
// Power BI and Excel were dropped from simple-icons; paths taken from simple-icons@8
const siPowerbi: SI = { title: 'Power BI', hex: 'F2C811', path: 'M10 12a1 1 0 0 1 1 1v11H4a1 1 0 0 1-1-1V13a1 1 0 0 1 1-1h6Zm-2-.5V7a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v17h-4.5V13a1.5 1.5 0 0 0-1.5-1.5H8Zm5-6V1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v22a1 1 0 0 1-1 1h-3.5V7A1.5 1.5 0 0 0 15 5.5h-2Z' }
const siMicrosoftexcel: SI = { title: 'Microsoft Excel', hex: '217346', path: 'M23 1.5q.41 0 .7.3.3.29.3.7v19q0 .41-.3.7-.29.3-.7.3H7q-.41 0-.7-.3-.3-.29-.3-.7V18H1q-.41 0-.7-.3-.3-.29-.3-.7V7q0-.41.3-.7Q.58 6 1 6h5V2.5q0-.41.3-.7.29-.3.7-.3zM6 13.28l1.42 2.66h2.14l-2.38-3.87 2.34-3.8H7.46l-1.3 2.4-.05.08-.04.09-.64-1.28-.66-1.29H2.59l2.27 3.82-2.48 3.85h2.16zM14.25 21v-3H7.5v3zm0-4.5v-3.75H12v3.75zm0-5.25V7.5H12v3.75zm0-5.25V3H7.5v3zm8.25 15v-3h-6.75v3zm0-4.5v-3.75h-6.75v3.75zm0-5.25V7.5h-6.75v3.75zm0-5.25V3h-6.75v3Z' }
const lookup: Record<string, SI> = { siWhatsapp, siPowerbi, siMicrosoftexcel, siPython, siPostgresql, siGooglebigquery, siDuckdb, siApacheparquet, siDbt, siGit, siPandas, siNumpy, siJupyter, siScikitlearn, siPytorch, siOpencv, siOnnx, siLangchain, siAnthropic, siClaude, siFastapi, siTableau, siLooker, siStreamlit, siJira, siPytest, siFlask, siGooglecloud, siTerraform, siGooglesheets, siUv, siCoursera, siGoogle, siAtlassian, siGithub, siLinkedin, siGmail, siArxiv }

export function getIcon(slug?: string): SI | undefined {
  if (!slug) return undefined
  return lookup['si' + slug[0].toUpperCase() + slug.slice(1)]
}

/** Brand logo from simple-icons, or a coloured monogram tile when the brand has no icon. */
export function SkillIcon({ name, slug, color, size = 22 }: { name: string; slug?: string; color?: string; size?: number }) {
  const icon = getIcon(slug)
  if (icon) {
    // very dark brand colours vanish in dark mode, so those follow the ink colour
    const hex = '#' + icon.hex
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(icon.hex.slice(i, i + 2), 16))
    const dark = 0.2126 * r + 0.7152 * g + 0.0722 * b < 60
    return (
      <svg role="img" aria-hidden="true" viewBox="0 0 24 24" width={size} height={size} style={{ flex: 'none' }}>
        <path d={icon.path} fill={dark ? 'currentColor' : hex} />
      </svg>
    )
  }
  const letters = name.replace(/[^A-Za-z0-9 ]/g, '').split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
  return (
    <span
      aria-hidden="true"
      className="grid place-items-center rounded-[6px] border-2 border-[#0a0a0a] font-mono text-[10px] font-bold text-[#0a0a0a]"
      style={{ width: size, height: size, background: color ?? 'var(--sun)', flex: 'none' }}
    >
      {letters}
    </span>
  )
}
