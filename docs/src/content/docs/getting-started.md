---
title: Getting Started
description: How to install and use Tailwind Hue Theme
---

# tailwind-hue-theme

A **Tailwind CSS v4 plugin** that makes your entire color palette shift dynamically based on a single `--brand-h` CSS variable. Ship light, bring your own color wheel.

Includes an optional **HuePicker** widget — a floating circular color wheel for live hue selection with drag support, preset swatches, and localStorage persistence.

---

## Features

- **Single variable control** — update `--brand-h` (0–360) and your entire palette shifts: backgrounds, borders, text, and accents.
- **OKLCH color space** — perceptually uniform, wide-gamut colors that look great at any hue.
- **Slate + Indigo + Cyan** scales all respond to `--brand-h`. Slate uses low chroma so dark backgrounds stay dark; indigo follows the hue directly; cyan is offset by +40°.
- **Optional HuePicker widget** — drag the circular color wheel, click a preset, or call `setHue()` from code.
- **localStorage persistence** — selected hue survives page reloads.
- **Zero runtime dependencies** — ships CJS + ESM + `.d.ts`.

---

## Installation

```bash
npm install tailwind-hue-theme
```

---

## Tailwind v4 plugin

Add to your CSS:

```css
@import "tailwindcss";
@plugin "tailwind-hue-theme";
```

That's it. The plugin injects `--brand-h: 250` (indigo) into `:root` and remaps
`--color-slate-*`, `--color-indigo-*`, and `--color-cyan-*` to OKLCH values that
track `--brand-h` at runtime.

Switch the palette live from JavaScript:

```js
// Drop-in anywhere — no framework required
document.documentElement.style.setProperty('--brand-h', '155') // Emerald
document.documentElement.style.setProperty('--brand-h', '10')  // Rose
document.documentElement.style.setProperty('--brand-h', '250') // Indigo (default)
```

Override the default hue in CSS without JavaScript:

```css
@plugin "tailwind-hue-theme";
:root { --brand-h: 155; }
```

---

## JS config API (Tailwind v4 / v3)

```js
// tailwind.config.js
import { createHuePlugin } from 'tailwind-hue-theme'

export default {
  plugins: [
    createHuePlugin({ defaultHue: 155, secondaryOffset: 50 }),
  ],
}
```

### `createHuePlugin(options?)`

| Option            | Type     | Default | Description                                         |
|-------------------|----------|---------|-----------------------------------------------------|
| `defaultHue`      | `number` | `250`   | Starting hue (0–360). Written to `--brand-h`.       |
| `secondaryOffset` | `number` | `40`    | Degrees added to `--brand-h` for the cyan scale.    |

### `buildTokens(options?)`

Returns the raw `Record<string, string>` of CSS custom properties so you can
inspect or test the generated values programmatically.

---

## HuePicker widget

```js
import { HuePicker } from 'tailwind-hue-theme/widget'

const picker = new HuePicker()
// → Floating color wheel appears in the bottom-right corner.
```

### Options

| Option         | Type                      | Default                   | Description                                               |
|----------------|---------------------------|---------------------------|-----------------------------------------------------------|
| `defaultHue`   | `number`                  | `250`                     | Initial hue (0–360) if no persisted value exists.         |
| `cssVariable`  | `string`                  | `'--brand-h'`             | CSS custom property updated on `<html>`.                  |
| `storageKey`   | `string`                  | `'tailwind-hue-theme'`    | localStorage key for persistence.                         |
| `container`    | `HTMLElement`             | `document.body`           | Element the widget is appended to.                        |
| `onChange`     | `(hue: number) => void`   | —                         | Called every time the hue changes.                        |
| `presets`      | `HuePreset[]`             | 6 built-in                | Preset swatches. Pass `[]` to disable.                    |

### Methods

| Method               | Description                                                   |
|----------------------|---------------------------------------------------------------|
| `getHue(): number`   | Returns the current hue (0–360).                              |
| `setHue(n: number)`  | Programmatically set hue. Normalises values outside 0–360.   |
| `destroy()`          | Removes all DOM nodes and the injected `<style>` tag.         |

### Preset format

```ts
interface HuePreset {
  label: string   // Shown in aria-label and title
  hue: number     // 0–360
}
```

### Built-in presets

| Name    | Hue |
|---------|-----|
| Indigo  | 250 |
| Teal    | 195 |
| Purple  | 295 |
| Rose    | 10  |
| Amber   | 75  |
| Emerald | 155 |

### Custom presets

```js
import { HuePicker } from 'tailwind-hue-theme/widget'

new HuePicker({
  presets: [
    { label: 'Sky',  hue: 220 },
    { label: 'Pink', hue: 330 },
  ],
})
```

### Programmatic use (no floating UI)

```js
import { HuePicker } from 'tailwind-hue-theme/widget'

const picker = new HuePicker({
  presets: [],      // no swatches
  container: document.getElementById('my-container')!,
  onChange: (hue) => console.log('hue →', hue),
})

// Drive the palette from your own UI:
document.getElementById('my-slider')!.addEventListener('input', (e) => {
  picker.setHue(Number((e.target as HTMLInputElement).value))
})
```

---

## Color scales

| Scale    | Chroma range | Hue expression                              |
|----------|-------------|---------------------------------------------|
| `slate`  | 0.004–0.036 | `var(--brand-h)`                            |
| `indigo` | 0.03–0.18   | `var(--brand-h)`                            |
| `cyan`   | 0.03–0.18   | `calc(var(--brand-h) + <secondaryOffset>)`  |

The slate scale uses intentionally low chroma so that dark backgrounds (`slate-900`, `slate-950`) remain visually dark at any hue — they just gain a subtle tint.

---

## TypeScript

All exports are fully typed. The package ships `.d.ts` files alongside CJS and ESM bundles.

```ts
import { createHuePlugin, buildTokens, type HuePluginOptions } from 'tailwind-hue-theme'
import { HuePicker, DEFAULT_PRESETS, getWidgetCSS, type HuePickerOptions, type HuePreset } from 'tailwind-hue-theme/widget'
```

---

## License

MIT — see [LICENSE](LICENSE).

---

Created by [Peter Benoit](https://www.peterbenoit.com)
