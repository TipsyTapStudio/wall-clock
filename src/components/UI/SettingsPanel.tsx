import { useState, useCallback } from 'react'
import type { ClockConfig, FontFamily, ThemeMode } from '../../store/useConfig.ts'
import { useTranslation } from '../../i18n/useTranslation.ts'
import type { TranslationKey } from '../../i18n/useTranslation.ts'

interface Props {
  config: ClockConfig
  setConfig: (patch: Partial<ClockConfig>) => void
  resetConfig: () => void
  copyShareUrl: (config: ClockConfig) => Promise<boolean>
  visible: boolean
}

const FONTS: { value: FontFamily; label: string }[] = [
  { value: 'JetBrains Mono', label: 'JetBrains Mono' },
  { value: 'Geist', label: 'Geist' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Noto Serif JP', label: 'Noto Serif JP' },
]

const THEMES: { value: ThemeMode; key: TranslationKey; swatch: string }[] = [
  { value: 'dynamic',  key: 'dynamic',  swatch: 'linear-gradient(135deg, #6366f1, #f59e0b, #ec4899)' },
  { value: 'amber',    key: 'amber',    swatch: '#ffb000' },
  { value: 'phosphor', key: 'phosphor', swatch: '#33ff66' },
  { value: 'midnight', key: 'midnight', swatch: '#e8e8e8' },
]

export function SettingsPanel({ config, setConfig, resetConfig, copyShareUrl, visible }: Props) {
  const { t } = useTranslation(config.locale)
  const [copied, setCopied] = useState(false)

  const handleShare = useCallback(async () => {
    const ok = await copyShareUrl(config)
    if (ok) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [config, copyShareUrl])

  return (
    <div
      className="fixed bottom-8 right-8 z-50 transition-all duration-500 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(8px)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div
        className="rounded-lg border backdrop-blur-xl"
        style={{
          background: 'rgba(255, 255, 255, 0.04)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
          minWidth: 280,
          padding: '24px 32px',
          fontFamily: "'Inter', 'Geist', sans-serif",
        }}
      >
        {/* Header */}
        <div
          className="text-xs font-medium tracking-widest uppercase mb-4"
          style={{ color: 'rgba(255, 255, 255, 0.3)' }}
        >
          {t('settings')}
        </div>

        {/* Language */}
        <Row label={t('language')}>
          <SegmentedControl
            options={[
              { value: 'en', label: 'EN' },
              { value: 'ja', label: 'JP' },
            ]}
            value={config.locale}
            onChange={(v) => setConfig({ locale: v as 'en' | 'ja' })}
          />
        </Row>

        {/* Theme */}
        <Row label={t('theme')}>
          <div className="flex gap-1.5">
            {THEMES.map(th => (
              <button
                key={th.value}
                title={t(th.key)}
                onClick={() => setConfig({ theme: th.value })}
                className="ghost-swatch"
                style={{
                  background: th.swatch,
                  boxShadow: config.theme === th.value
                    ? '0 0 0 1.5px rgba(255,255,255,0.5)'
                    : 'none',
                }}
              />
            ))}
          </div>
        </Row>

        {/* Font */}
        <Row label={t('font')}>
          <select
            value={config.font}
            onChange={(e) => setConfig({ font: e.target.value as FontFamily })}
            className="ghost-select"
          >
            {FONTS.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </Row>

        {/* Font Size */}
        <Row label={t('fontSize')}>
          <div className="flex items-center gap-2 flex-1">
            <input
              type="range"
              min={4}
              max={28}
              step={1}
              value={config.fontSize}
              onChange={(e) => setConfig({ fontSize: Number(e.target.value) })}
              className="ghost-range flex-1"
            />
            <span className="ghost-value">{config.fontSize}</span>
          </div>
        </Row>

        {/* Divider */}
        <Divider />

        {/* Toggles */}
        <Row label={t('format24h')}>
          <Toggle checked={config.is24h} onChange={(v) => setConfig({ is24h: v })} />
        </Row>
        <Row label={t('showSeconds')}>
          <Toggle checked={config.showSeconds} onChange={(v) => setConfig({ showSeconds: v })} />
        </Row>
        <Row label={t('blinkColon' as TranslationKey)}>
          <Toggle checked={config.blinkColon} onChange={(v) => setConfig({ blinkColon: v })} />
        </Row>
        <Row label={t('showDate')}>
          <Toggle checked={config.showDate} onChange={(v) => setConfig({ showDate: v })} />
        </Row>

        {/* Divider */}
        <Divider />

        {/* Action buttons */}
        <div className="flex flex-col gap-2">
          <button onClick={handleShare} className="ghost-button w-full">
            {copied ? t('copied') : t('shareConfig')}
          </button>
          <button onClick={resetConfig} className="ghost-button ghost-button--subtle w-full">
            {t('resetDefaults')}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Sub-components ── */

function Divider() {
  return <div className="my-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 mb-2.5" style={{ minHeight: 28 }}>
      <span className="ghost-label">{label}</span>
      {children}
    </div>
  )
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="ghost-toggle"
      style={{
        backgroundColor: checked ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.05)',
      }}
    >
      <span
        className="ghost-toggle-knob"
        style={{ transform: checked ? 'translateX(14px)' : 'translateX(0)' }}
      />
    </button>
  )
}

function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="ghost-segmented">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className="ghost-segmented-btn"
          style={{
            background: value === opt.value ? 'rgba(255,255,255,0.12)' : 'transparent',
            color: value === opt.value ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
          }}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
