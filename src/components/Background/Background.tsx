import type { ThemeMode } from '../../store/useConfig.ts'
import { getBackgroundStyle } from '../../utils/timeUtils.ts'

interface Props {
  theme: ThemeMode
  now: Date
}

export function Background({ theme, now }: Props) {
  return (
    <div
      className="fixed inset-0 transition-colors duration-[3000ms]"
      style={{ backgroundColor: getBackgroundStyle(theme, now) }}
    />
  )
}
