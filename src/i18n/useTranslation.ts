import { useCallback } from 'react'
import { en } from './en.ts'
import { ja } from './ja.ts'

export type Locale = 'en' | 'ja'
export type TranslationKey = keyof typeof en

const dictionaries: Record<Locale, Record<TranslationKey, string>> = { en, ja }

export function useTranslation(locale: Locale) {
  const t = useCallback(
    (key: TranslationKey): string => dictionaries[locale][key] ?? key,
    [locale],
  )
  return { t, locale }
}
