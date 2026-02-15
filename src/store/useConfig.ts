import { useState, useCallback } from 'react'
import type { Locale } from '../i18n/useTranslation.ts'

export type FontFamily = 'JetBrains Mono' | 'Geist' | 'Inter' | 'Noto Serif JP'
export type ThemeMode = 'dynamic' | 'amber' | 'phosphor' | 'midnight'

export interface ClockConfig {
  locale: Locale
  is24h: boolean
  showSeconds: boolean
  blinkColon: boolean
  showDate: boolean
  font: FontFamily
  theme: ThemeMode
  fontSize: number // vw units, 1-30
}

export const DEFAULTS: ClockConfig = {
  locale: 'en',
  is24h: true,
  showSeconds: true,
  blinkColon: true,
  showDate: true,
  font: 'JetBrains Mono',
  theme: 'dynamic',
  fontSize: 16,
}

const LS_KEY = 'wall-clock-config'

function loadFromLocalStorage(): Partial<ClockConfig> {
  try {
    const raw = localStorage.getItem(LS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveToLocalStorage(config: ClockConfig) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(config))
  } catch { /* quota exceeded — silent */ }
}

export function useConfig(initialOverrides: Partial<ClockConfig> = {}) {
  const [config, setConfigState] = useState<ClockConfig>(() => {
    const stored = loadFromLocalStorage()
    // Priority: URL params (initialOverrides) > LocalStorage > Defaults
    return { ...DEFAULTS, ...stored, ...initialOverrides }
  })

  const setConfig = useCallback((patch: Partial<ClockConfig>) => {
    setConfigState(prev => {
      const next = { ...prev, ...patch }
      saveToLocalStorage(next)
      return next
    })
  }, [])

  const resetConfig = useCallback(() => {
    setConfigState(DEFAULTS)
    saveToLocalStorage(DEFAULTS)
  }, [])

  return { config, setConfig, resetConfig }
}
