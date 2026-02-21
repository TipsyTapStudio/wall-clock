import { useEffect, useCallback, useState } from 'react'
import type { ClockConfig } from '../store/useConfig.ts'
import { serializeConfig, deserializeConfig } from '../utils/serialization.ts'

/**
 * Reads config overrides from URL on mount.
 * Provides a function to write current config back to URL (for sharing).
 */
export function useUrlSync(): {
  urlOverrides: Partial<ClockConfig>
  copyShareUrl: (config: ClockConfig) => Promise<boolean>
} {
  const [urlOverrides] = useState(() =>
    deserializeConfig(window.location.search),
  )

  // Clean URL after reading params (don't pollute address bar during use)
  useEffect(() => {
    if (window.location.search) {
      window.history.replaceState(null, '', window.location.pathname)
    }
  }, [])

  const copyShareUrl = useCallback(async (config: ClockConfig): Promise<boolean> => {
    const qs = serializeConfig(config)
    const url = `${window.location.origin}${window.location.pathname}${qs ? '?' + qs : ''}`
    try {
      await navigator.clipboard.writeText(url)
      return true
    } catch {
      return false
    }
  }, [])

  return { urlOverrides, copyShareUrl }
}
