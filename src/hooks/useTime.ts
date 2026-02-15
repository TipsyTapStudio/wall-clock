import { useState, useEffect, useRef } from 'react'

export function useTime(showSeconds: boolean) {
  const [now, setNow] = useState(() => new Date())
  const rafRef = useRef<number>(0)

  useEffect(() => {
    if (showSeconds) {
      // Update every second via requestAnimationFrame for smooth sync
      let lastSecond = -1
      const tick = () => {
        const d = new Date()
        if (d.getSeconds() !== lastSecond) {
          lastSecond = d.getSeconds()
          setNow(d)
        }
        rafRef.current = requestAnimationFrame(tick)
      }
      rafRef.current = requestAnimationFrame(tick)
      return () => cancelAnimationFrame(rafRef.current)
    } else {
      // Update once per minute — Zero-Waste Engine
      const tick = () => setNow(new Date())
      tick()
      const id = setInterval(tick, 60_000)
      return () => clearInterval(id)
    }
  }, [showSeconds])

  return now
}
