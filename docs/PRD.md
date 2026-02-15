# Project: WALL-CLOCK

## 1. Vision / Concept
- **"The Digital Gear"**: ブラウザに「機材（Gear）」としての壁掛け時計を。
- **"Industrial Minimalism"**: 広告・ノイズを徹底排除。タイポグラフィの美しさと時間の経過を楽しむための道具。
- **"Global Product"**: JP/EN 両対応。世界中のクリエイターのデスクに馴染むデザイン。
- **"Professional Integrity"**: 才能の無駄遣いと言われるほどの過剰なエンジニアリングによる、ユーザーとハードウェアへの誠実さ。

## 2. Design & Layered Architecture
UIと時計、背景を完全に分離し、将来の拡張とピクセルシフトの干渉を防ぐ3層構造を採用。
1. **Background Layer**: HSL Gradient / Future Image support.
2. **Content Layer**: Clock & Date (Pixel Shifter をこの層にのみ適用).
3. **UI Layer**: Fixed Ghost UI (Settings, Language). マウスホバー時のみ表示。

## 3. Engineering Manifesto (Zero Compromise)

### 3.1 Hardware Longevity (Pixel Shifter 2.0)
- **仕様**: 10分ごとに表示位置を ±2px の範囲でランダムにオフセット。
- **目的**: 有機EL/液晶ディスプレイの焼き付き（Burn-in）を統計的に防止する。

### 3.2 Circadian Eye Care (Adaptive Control)
- **仕様**: 22:00〜06:00 の間、自動的に色相を暖色系に寄せ、輝度（L）と彩度（S）を抑制。
- **目的**: ブルーライトを抑え、睡眠の質を妨げない視覚環境を構築。

### 3.3 Zero-Waste Engine (Low Power & Stability)
- **仕様**: 
  - 秒表示OFF時は描画更新を1分1回に制限。
  - **Screen Wake Lock API**: ブラウザがアクティブな間のスリープを防止。
  - GPU負荷を最小化する CSS Transform 最適化。

## 4. Features & Customization
- **Display Toggles**: 24h/12h, Seconds (Show/Hide), Blinking Colon, Date Format.
- **Typography**: 
  - Fonts: Geist, JetBrains Mono, Inter, Noto Serif JP.
  - Sizing: スライダーによる無段階調整。
- **Themes**:
  - `Dynamic`: 24時間周期の無段階HSLグラデーション。
  - `Fixed`: 特定の機材（Amber/Matrix等）を模した固定カラー。

## 5. State Persistence & Portability (Serverless Sharing)
- **URL Serialization**: 設定値を短縮キー（f=font, t=theme等）でシリアライズし、URLパラメータとして出力・復元可能にする。
- **Zero-Server Sharing**: データベースに依存せず、URLそのものを共有することで設定を配布可能にする。
- **Priority Logic**: URL Params > LocalStorage > Defaults.

## 6. Technical Stack
- **Framework**: Vite + React + TypeScript + Tailwind CSS
- **PWA**: vite-plugin-pwa (完全オフライン対応)
- **i18n**: JP / EN 対応 (Labels: English, Descriptions: Bilingual)

## 7. Directory Structure
wall-clock/
├── docs/
│   └── PRD.md
├── src/
│   ├── components/
│   │   ├── Background/ (Layered: HSL, Image, Overlay)
│   │   ├── Clock/ (Main rendering logic)
│   │   └── UI/ (Settings panel, Language selector)
│   ├── i18n/ (en.ts, jp.ts, useTranslation.ts)
│   ├── hooks/ (useTime, useWakeLock, usePixelShifter, useUrlSync)
│   ├── store/ (useConfig)
│   └── utils/ (serialization.ts, timeUtils)