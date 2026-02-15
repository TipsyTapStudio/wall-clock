import type { ClockConfig, FontFamily, ThemeMode } from '../store/useConfig.ts'
import type { Locale } from '../i18n/useTranslation.ts'
import { DEFAULTS } from '../store/useConfig.ts'

// Short keys for compact URL serialization
const KEY_MAP = {
  locale: 'l',
  is24h: 'h',
  showSeconds: 's',
  blinkColon: 'b',
  showDate: 'd',
  font: 'f',
  theme: 't',
  fontSize: 'z',
} as const

const FONT_SHORT: Record<FontFamily, string> = {
  'JetBrains Mono': 'jb',
  'Geist': 'ge',
  'Inter': 'in',
  'Noto Serif JP': 'ns',
}

const FONT_LONG: Record<string, FontFamily> = Object.fromEntries(
  Object.entries(FONT_SHORT).map(([k, v]) => [v, k as FontFamily]),
)

const VALID_LOCALES = new Set<string>(['en', 'ja'])
const VALID_THEMES = new Set<string>(['dynamic', 'amber', 'phosphor', 'midnight'])

export function serializeConfig(config: ClockConfig): string {
  const params = new URLSearchParams()

  if (config.locale !== DEFAULTS.locale) params.set(KEY_MAP.locale, config.locale)
  if (config.is24h !== DEFAULTS.is24h) params.set(KEY_MAP.is24h, config.is24h ? '1' : '0')
  if (config.showSeconds !== DEFAULTS.showSeconds) params.set(KEY_MAP.showSeconds, config.showSeconds ? '1' : '0')
  if (config.blinkColon !== DEFAULTS.blinkColon) params.set(KEY_MAP.blinkColon, config.blinkColon ? '1' : '0')
  if (config.showDate !== DEFAULTS.showDate) params.set(KEY_MAP.showDate, config.showDate ? '1' : '0')
  if (config.font !== DEFAULTS.font) params.set(KEY_MAP.font, FONT_SHORT[config.font])
  if (config.theme !== DEFAULTS.theme) params.set(KEY_MAP.theme, config.theme)
  if (config.fontSize !== DEFAULTS.fontSize) params.set(KEY_MAP.fontSize, String(config.fontSize))

  return params.toString()
}

export function deserializeConfig(search: string): Partial<ClockConfig> {
  const params = new URLSearchParams(search)
  const result: Partial<ClockConfig> = {}

  const l = params.get(KEY_MAP.locale)
  if (l && VALID_LOCALES.has(l)) result.locale = l as Locale

  const h = params.get(KEY_MAP.is24h)
  if (h === '0' || h === '1') result.is24h = h === '1'

  const s = params.get(KEY_MAP.showSeconds)
  if (s === '0' || s === '1') result.showSeconds = s === '1'

  const b = params.get(KEY_MAP.blinkColon)
  if (b === '0' || b === '1') result.blinkColon = b === '1'

  const d = params.get(KEY_MAP.showDate)
  if (d === '0' || d === '1') result.showDate = d === '1'

  const f = params.get(KEY_MAP.font)
  if (f && f in FONT_LONG) result.font = FONT_LONG[f]

  const t = params.get(KEY_MAP.theme)
  if (t && VALID_THEMES.has(t)) result.theme = t as ThemeMode

  const z = params.get(KEY_MAP.fontSize)
  if (z) {
    const n = Number(z)
    if (n >= 1 && n <= 30) result.fontSize = n
  }

  return result
}
