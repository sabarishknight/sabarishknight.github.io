import { siPython, siPostgresql, siGooglebigquery, siDuckdb, siApacheparquet, siDbt, siGit, siPandas, siNumpy, siJupyter, siScikitlearn, siPytorch, siOpencv, siOnnx, siLangchain, siAnthropic, siClaude, siFastapi, siTableau, siLooker, siStreamlit, siJira, siPytest, siFlask, siGooglecloud, siTerraform, siGooglesheets, siUv, siCoursera, siGoogle, siAtlassian, siGithub, siLinkedin, siGmail, siArxiv } from 'simple-icons'

type SI = { path: string; hex: string; title: string }
// named imports keep the bundle to the logos actually used; add new ones here
const lookup: Record<string, SI> = { siPython, siPostgresql, siGooglebigquery, siDuckdb, siApacheparquet, siDbt, siGit, siPandas, siNumpy, siJupyter, siScikitlearn, siPytorch, siOpencv, siOnnx, siLangchain, siAnthropic, siClaude, siFastapi, siTableau, siLooker, siStreamlit, siJira, siPytest, siFlask, siGooglecloud, siTerraform, siGooglesheets, siUv, siCoursera, siGoogle, siAtlassian, siGithub, siLinkedin, siGmail, siArxiv }

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
    const dark = parseInt(icon.hex, 16) < 0x333333 || ['000000', '181717', '191919', '1C3C3C', '013243', '150458'].includes(icon.hex)
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
