import { useState, useEffect } from 'react'

const SHIFT_RANGE = 2   // ±2px
const INTERVAL_MS = 10 * 60 * 1000 // 10 minutes

function randomOffset(): number {
  return Math.round((Math.random() * 2 - 1) * SHIFT_RANGE)
}

/**
 * Pixel Shifter 2.0
 * Every 10 minutes, produces a small random translate offset
 * to statistically prevent OLED/LCD burn-in.
 */
export function usePixelShifter() {
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const shift = () => setOffset({ x: randomOffset(), y: randomOffset() })
    const id = setInterval(shift, INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return offset
}
