import type { ThemeMode } from '../store/useConfig.ts'
import type { Locale } from '../i18n/useTranslation.ts'

/**
 * Dynamic theme: 24-hour HSL cycle
 * Maps hour (0-23) to a slowly shifting hue.
 */
export function getDynamicHsl(date: Date): { h: number; s: number; l: number } {
  const hour = date.getHours() + date.getMinutes() / 60
  const h = (hour / 24) * 360
  const isNight = hour >= 22 || hour < 6

  return {
    h,
    s: isNight ? 30 : 60,
    l: isNight ? 8 : 12,
  }
}

/**
 * Theme color palettes — each preset defines its own character.
 *
 *   Dynamic   : 24h cycle, circadian-adapted
 *   Amber     : Retro instrumentation / warm CRT
 *   Phosphor  : Green phosphor monitor (P1 / P39)
 *   Midnight  : High-contrast monochrome
 */

interface ThemePalette {
  text: string
  bg: string
}

const FIXED_PALETTES: Record<Exclude<ThemeMode, 'dynamic'>, ThemePalette> = {
  amber:    { text: '#ffb000', bg: '#0d0800' },
  phosphor: { text: '#33ff66', bg: '#020d04' },
  midnight: { text: '#e8e8e8', bg: '#050505' },
}

export function getThemeColor(theme: ThemeMode, date: Date): string {
  if (theme === 'dynamic') {
    const { h, s } = getDynamicHsl(date)
    const hour = date.getHours() + date.getMinutes() / 60
    const isNight = hour >= 22 || hour < 6
    const lightness = isNight ? 65 : 80
    return `hsl(${h}, ${s}%, ${lightness}%)`
  }
  return FIXED_PALETTES[theme].text
}

export function getBackgroundStyle(theme: ThemeMode, date: Date): string {
  if (theme === 'dynamic') {
    const { h, s, l } = getDynamicHsl(date)
    return `hsl(${h}, ${s}%, ${l}%)`
  }
  return FIXED_PALETTES[theme].bg
}

/**
 * Format time string
 */
export function formatTime(
  date: Date,
  is24h: boolean,
): { hours: string; minutes: string; seconds: string; period: string } {
  let h = date.getHours()
  let period = ''

  if (!is24h) {
    period = h >= 12 ? 'PM' : 'AM'
    h = h % 12 || 12
  }

  return {
    hours: String(h).padStart(2, '0'),
    minutes: String(date.getMinutes()).padStart(2, '0'),
    seconds: String(date.getSeconds()).padStart(2, '0'),
    period,
  }
}

/**
 * Format date string respecting locale
 */
export function formatDate(date: Date, locale: Locale): string {
  return date.toLocaleDateString(locale === 'ja' ? 'ja-JP' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}
