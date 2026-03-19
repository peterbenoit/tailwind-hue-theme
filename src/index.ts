// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore — tailwindcss/plugin types vary across v4 patch releases
import plugin from 'tailwindcss/plugin'

// ─── Color scale definitions: [step, lightness, chroma] ──────────────────────

/** Slate: very low chroma — provides subtle, tinted dark backgrounds. */
const SLATE = [
	['50', '98%', '0.004'],
	['100', '94%', '0.006'],
	['200', '88%', '0.008'],
	['300', '80%', '0.012'],
	['400', '70%', '0.016'],
	['500', '58%', '0.020'],
	['600', '48%', '0.022'],
	['700', '38%', '0.026'],
	['800', '28%', '0.030'],
	['900', '20%', '0.032'],
	['950', '13%', '0.036'],
] as const

/** Brand (indigo): mid-high chroma — follows --brand-h directly. */
const BRAND = [
	['50', '97%', '0.03'],
	['100', '94%', '0.06'],
	['200', '88%', '0.09'],
	['300', '80%', '0.12'],
	['400', '70%', '0.14'],
	['500', '60%', '0.16'],
	['600', '50%', '0.17'],
	['700', '42%', '0.18'],
	['800', '34%', '0.18'],
	['900', '26%', '0.17'],
	['950', '18%', '0.14'],
] as const

// ─── Public API ───────────────────────────────────────────────────────────────

export interface HuePluginOptions {
	/** Default brand hue (0–360). Default: 250 (indigo). */
	defaultHue?: number
	/** Hue offset added to the secondary (cyan) scale. Default: 40. */
	secondaryOffset?: number
}

/**
 * Builds the full set of `:root` CSS custom-property tokens.
 * Exported so you can inspect or test the generated values directly.
 */
export function buildTokens(opts: HuePluginOptions = {}): Record<string, string> {
	const h = opts.defaultHue ?? 250
	const offset = opts.secondaryOffset ?? 40
	const tokens: Record<string, string> = {
		'--brand-h': String(h),
	}

	for (const [step, l, c] of SLATE) {
		tokens[`--color-slate-${step}`] = `oklch(${l} ${c} var(--brand-h, ${h}))`
	}
	for (const [step, l, c] of BRAND) {
		tokens[`--color-indigo-${step}`] = `oklch(${l} ${c} var(--brand-h, ${h}))`
	}
	for (const [step, l, c] of BRAND) {
		tokens[`--color-cyan-${step}`] = `oklch(${l} ${c} calc(var(--brand-h, ${h}) + ${offset}))`
	}

	return tokens
}

/**
 * Factory that returns a Tailwind plugin with customised defaults.
 *
 * @example
 * // tailwind.config.js or JS config
 * import { createHuePlugin } from 'tailwind-hue-theme'
 * export default { plugins: [createHuePlugin({ defaultHue: 155 })] }
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createHuePlugin(opts: HuePluginOptions = {}): any {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return plugin(function ({ addBase }: { addBase: (base: any) => void }) {
		addBase({ ':root': buildTokens(opts) })
	})
}

/**
 * Default Tailwind v4 plugin — use via `@plugin "tailwind-hue-theme"` in CSS.
 *
 * Sets `--brand-h: 250` (indigo) and remaps slate, indigo, and cyan scales
 * to OKLCH tokens that track `--brand-h` at runtime. Update the variable at
 * any time to shift the entire palette:
 *
 * ```js
 * document.documentElement.style.setProperty('--brand-h', '155') // Emerald
 * ```
 */
export default createHuePlugin()
