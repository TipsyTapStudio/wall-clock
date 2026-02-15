import { useMemo } from 'react'
import type { ClockConfig } from '../../store/useConfig.ts'
import { formatTime, formatDate, getThemeColor } from '../../utils/timeUtils.ts'

interface Props {
  config: ClockConfig
  now: Date
}

export function Clock({ config, now }: Props) {
  const { hours, minutes, seconds, period } = formatTime(now, config.is24h)
  const color = useMemo(() => getThemeColor(config.theme, now), [config.theme, now])
  const colonVisible = config.blinkColon ? now.getSeconds() % 2 === 0 : true

  return (
    <div className="flex flex-col items-center justify-center select-none gap-2">
      {/* Time */}
      <div
        className="flex items-baseline justify-center"
        style={{
          fontFamily: `'${config.font}', monospace`,
          fontSize: `${config.fontSize}vw`,
          color,
          lineHeight: 1,
          fontWeight: 700,
          fontVariantNumeric: 'tabular-nums',
          transition: 'color 3s ease',
        }}
      >
        <span>{hours}</span>
        <span
          className="transition-opacity duration-300"
          style={{ opacity: colonVisible ? 1 : 0 }}
        >
          :
        </span>
        <span>{minutes}</span>

        {config.showSeconds && (
          <>
            <span
              className="transition-opacity duration-300"
              style={{ opacity: colonVisible ? 1 : 0 }}
            >
              :
            </span>
            <span>{seconds}</span>
          </>
        )}

        {period && (
          <span className="ml-2" style={{ fontSize: '0.3em', opacity: 0.6 }}>
            {period}
          </span>
        )}
      </div>

      {/* Date */}
      {config.showDate && (
        <div
          style={{
            fontFamily: `'${config.font}', monospace`,
            fontSize: `${config.fontSize * 0.12}vw`,
            color,
            opacity: 0.4,
            letterSpacing: '0.1em',
            transition: 'color 3s ease',
          }}
        >
          {formatDate(now, config.locale)}
        </div>
      )}
    </div>
  )
}
