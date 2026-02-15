import { useState, useEffect, useCallback, useRef } from 'react'
import { Background } from './components/Background/Background.tsx'
import { Clock } from './components/Clock/Clock.tsx'
import { SettingsPanel } from './components/UI/SettingsPanel.tsx'
import { useConfig } from './store/useConfig.ts'
import { useTime } from './hooks/useTime.ts'
import { usePixelShifter } from './hooks/usePixelShifter.ts'
import { useUrlSync } from './hooks/useUrlSync.ts'

const HIDE_DELAY = 3000

function App() {
  const { urlOverrides, copyShareUrl } = useUrlSync()
  const { config, setConfig, resetConfig } = useConfig(urlOverrides)

  const now = useTime(config.showSeconds)
  const pixelShift = usePixelShifter()

  // ── Ghost UI visibility ──
  const [uiVisible, setUiVisible] = useState(false)
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(null)

  const showUI = useCallback(() => {
    setUiVisible(true)
    if (hideTimer.current) clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setUiVisible(false), HIDE_DELAY)
  }, [])

  useEffect(() => {
    const handler = () => showUI()
    window.addEventListener('mousemove', handler)
    window.addEventListener('click', handler)
    window.addEventListener('touchstart', handler)
    return () => {
      window.removeEventListener('mousemove', handler)
      window.removeEventListener('click', handler)
      window.removeEventListener('touchstart', handler)
      if (hideTimer.current) clearTimeout(hideTimer.current)
    }
  }, [showUI])

  // ── Safe Area auto-fit: measure content, scale down if wider than frame ──
  const frameRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [fitScale, setFitScale] = useState(1)

  useEffect(() => {
    const frame = frameRef.current
    const content = contentRef.current
    if (!frame || !content) return

    const compute = () => {
      const fw = frame.clientWidth
      const cw = content.scrollWidth
      setFitScale(cw > fw ? fw / cw : 1)
    }

    compute()
    const observer = new ResizeObserver(compute)
    observer.observe(frame)
    observer.observe(content)
    return () => observer.disconnect()
  }, [config.fontSize, config.font, config.showSeconds, config.is24h])

  return (
    <div
      className="relative w-screen h-screen overflow-hidden"
      style={{ cursor: uiVisible ? 'default' : 'none' }}
    >
      {/* ── Layer 1: Background (full bleed) ── */}
      <Background theme={config.theme} now={now} />

      {/* ── Layer 2: Content — Pixel Shifter applied here only ── */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate(${pixelShift.x}px, ${pixelShift.y}px)`,
          willChange: 'transform',
        }}
      >
        {/* Safe Area Frame: 90% width, always centered */}
        <div
          ref={frameRef}
          style={{
            width: '90%',
            maxHeight: '80vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Content: measured at intrinsic width, scaled to fit frame */}
          <div
            ref={contentRef}
            style={{
              width: 'max-content',
              transform: `scale(${fitScale})`,
              transformOrigin: 'center center',
            }}
          >
            <Clock config={config} now={now} />
          </div>
        </div>
      </div>

      {/* ── Layer 3: UI (Ghost) — unaffected by Pixel Shifter ── */}
      <SettingsPanel
        config={config}
        setConfig={setConfig}
        resetConfig={resetConfig}
        copyShareUrl={copyShareUrl}
        visible={uiVisible}
      />
    </div>
  )
}

export default App
