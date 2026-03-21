// ─── CSS (injected into <head> once) ─────────────────────────────────────────

const WIDGET_CSS = `
.hue-picker-wrap {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 9999;
  display: flex;
  flex-direction: column-reverse;
  align-items: flex-end;
  gap: 0.5rem;
}
.hue-picker-trigger {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid oklch(38% 0.02 var(--brand-h, 250));
  background: oklch(20% 0.014 var(--brand-h, 250));
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px oklch(0% 0 0 / 0.45);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  padding: 0;
  flex-shrink: 0;
}
.hue-picker-trigger:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 28px oklch(0% 0 0 / 0.55);
}
.hue-picker-trigger-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--brand-color, oklch(62% 0.18 250));
  display: block;
  pointer-events: none;
  transition: background 0.3s ease;
}
.hue-picker-panel {
  position: relative;
  background: oklch(19% 0.018 var(--brand-h, 250));
  border: 1px solid oklch(32% 0.022 var(--brand-h, 250));
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 8px 40px oklch(0% 0 0 / 0.55);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}
.hue-picker-panel[hidden] {
  display: none;
}
/* ── Wheel ── */
.hue-picker-wheel-wrap {
  position: relative;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  cursor: crosshair;
  outline: none;
  touch-action: none;
}
.hue-picker-wheel {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  background: conic-gradient(
    oklch(65% 0.18 0),
    oklch(65% 0.18 30),
    oklch(65% 0.18 60),
    oklch(65% 0.18 90),
    oklch(65% 0.18 120),
    oklch(65% 0.18 150),
    oklch(65% 0.18 180),
    oklch(65% 0.18 210),
    oklch(65% 0.18 240),
    oklch(65% 0.18 270),
    oklch(65% 0.18 300),
    oklch(65% 0.18 330),
    oklch(65% 0.18 360)
  );
}
/* Donut hole — panel bg colour, centre swatch inside */
.hue-picker-wheel-hole {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 92px;
  height: 92px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: oklch(19% 0.018 var(--brand-h, 250));
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}
.hue-picker-wheel-swatch {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--brand-color, oklch(62% 0.18 250));
  box-shadow: 0 2px 10px oklch(0% 0 0 / 0.3);
  transition: background 0.3s ease;
}
/* Draggable handle */
.hue-picker-handle {
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: white;
  border: 2px solid oklch(0% 0 0 / 0.25);
  box-shadow: 0 1px 6px oklch(0% 0 0 / 0.4);
  transform: translate(-50%, -50%);
  pointer-events: none;
}
/* ── Presets ── */
.hue-picker-presets {
  display: flex;
  gap: 0.375rem;
}
.hue-picker-preset {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  padding: 0;
  transition: transform 0.15s ease, border-color 0.15s ease;
  outline-offset: 2px;
  flex-shrink: 0;
}
.hue-picker-preset:hover,
.hue-picker-preset.is-active {
  transform: scale(1.18);
  border-color: white;
}
/* ── Reset ── */
.hue-picker-reset {
  background: transparent;
  border: 1px solid oklch(35% 0.022 var(--brand-h, 250));
  color: oklch(72% 0.03 var(--brand-h, 250));
  border-radius: 0.4rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.7rem;
  cursor: pointer;
  font-family: inherit;
  transition: background 0.15s ease, color 0.15s ease;
  width: 100%;
}
.hue-picker-reset:hover {
  background: oklch(30% 0.02 var(--brand-h, 250));
  color: white;
}
/* ── Promo ? button ── */
.hue-picker-promo-btn {
  position: absolute;
  top: 0.55rem;
  right: 0.55rem;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 1px solid oklch(45% 0.06 var(--brand-h, 250) / 0.6);
  background: oklch(26% 0.02 var(--brand-h, 250));
  color: oklch(62% 0.12 var(--brand-h, 250));
  font-size: 0.62rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  font-family: inherit;
  z-index: 1;
}
.hue-picker-promo-btn:hover,
.hue-picker-promo-btn[aria-expanded="true"] {
  background: oklch(36% 0.1 var(--brand-h, 250));
  border-color: oklch(60% 0.16 var(--brand-h, 250) / 0.7);
  color: oklch(82% 0.18 var(--brand-h, 250));
}
.hue-picker-promo-popup {
  position: absolute;
  top: 0.4rem;
  right: 1.8rem;
  width: 190px;
  background: oklch(15% 0.016 var(--brand-h, 250));
  border: 1px solid oklch(42% 0.08 var(--brand-h, 250) / 0.55);
  border-radius: 0.55rem;
  padding: 0.65rem 0.75rem;
  font-size: 0.67rem;
  line-height: 1.5;
  color: oklch(65% 0.025 var(--brand-h, 250));
  box-shadow: 0 4px 20px oklch(0% 0 0 / 0.5);
  z-index: 10;
}
.hue-picker-promo-popup p {
  margin: 0 0 0.4rem;
}
.hue-picker-promo-popup a {
  color: oklch(70% 0.18 var(--brand-h, 250));
  text-decoration: none;
  font-weight: 600;
}
.hue-picker-promo-popup a:hover {
  text-decoration: underline;
  color: oklch(80% 0.2 var(--brand-h, 250));
}
`

// ─── Types ────────────────────────────────────────────────────────────────────

export interface HuePreset {
	label: string
	hue: number
}

export interface HuePickerOptions {
	/** Initial hue (0–360). Default: 250. */
	defaultHue?: number
	/** CSS variable to update on the root element. Default: `'--brand-h'`. */
	cssVariable?: string
	/** localStorage key for persisting the selected hue. Default: `'tailwind-hue-theme'`. */
	storageKey?: string
	/** Element to append the widget to. Default: `document.body`. */
	container?: HTMLElement
	/** Called whenever the hue changes. */
	onChange?: (hue: number) => void
	/** Preset swatches shown below the wheel. Pass `[]` to disable. */
	presets?: HuePreset[]
	/** URL shown in the ? promo popup. Default: npm package page. */
	promoHref?: string
}

// ─── Default presets ──────────────────────────────────────────────────────────

export const DEFAULT_PRESETS: HuePreset[] = [
	{ label: 'Indigo', hue: 250 },
	{ label: 'Teal', hue: 195 },
	{ label: 'Purple', hue: 295 },
	{ label: 'Rose', hue: 10 },
	{ label: 'Amber', hue: 75 },
	{ label: 'Emerald', hue: 155 },
]

// ─── HuePicker class ──────────────────────────────────────────────────────────

/**
 * Floating circular color-wheel widget that updates `--brand-h` on
 * `<html>` in real-time, with drag-to-select, preset swatches, and
 * localStorage persistence.
 *
 * @example
 * ```ts
 * import { HuePicker } from 'tailwind-hue-theme/widget'
 * const picker = new HuePicker({ defaultHue: 250 })
 * ```
 */
export class HuePicker {
	private _hue: number
	private _defaultHue: number
	private _cssVariable: string
	private _storageKey: string
	private _onChange?: (hue: number) => void
	private _presets: HuePreset[]
	private _container: HTMLElement
	private _promoHref: string

	private _wrap!: HTMLDivElement
	private _trigger!: HTMLButtonElement
	private _panel!: HTMLDivElement
	private _wheelWrap!: HTMLDivElement
	private _handle!: HTMLDivElement
	private _promoBtn!: HTMLButtonElement
	private _promoPopup!: HTMLDivElement
	private _styleTag!: HTMLStyleElement
	private _dragging = false

	constructor(options: HuePickerOptions = {}) {
		this._defaultHue = options.defaultHue ?? 250
		this._cssVariable = options.cssVariable ?? '--brand-h'
		this._storageKey = options.storageKey ?? 'tailwind-hue-theme'
		this._onChange = options.onChange
		this._presets = options.presets ?? DEFAULT_PRESETS
		this._container = options.container ?? document.body
		this._promoHref = options.promoHref ?? 'https://www.npmjs.com/package/tailwind-hue-theme'

		// Restore persisted hue (falls back to defaultHue)
		const stored = localStorage.getItem(this._storageKey)
		this._hue = stored !== null ? Number(stored) : this._defaultHue

		this._injectStyles()
		this._buildDOM()
		this._attachEvents()
		// Apply without persisting (we only persist on user interaction)
		this._applyHue(this._hue, false)
	}

	/** Returns the current hue value (0–360). */
	getHue(): number {
		return this._hue
	}

	/**
	 * Programmatically set the hue.  Normalises angles outside 0–360.
	 * Persists to localStorage.
	 */
	setHue(hue: number): void {
		this._applyHue(this._normalise(hue))
	}

	/** Removes the widget's DOM nodes and injected `<style>` tag. */
	destroy(): void {
		this._wrap.remove()
		this._styleTag.remove()
	}

	// ── Private helpers ────────────────────────────────────────────────────────

	private _normalise(hue: number): number {
		return Math.round(((hue % 360) + 360) % 360)
	}

	private _injectStyles(): void {
		if (document.getElementById('hue-picker-styles')) {
			this._styleTag = document.getElementById('hue-picker-styles') as HTMLStyleElement
			return
		}
		this._styleTag = document.createElement('style')
		this._styleTag.id = 'hue-picker-styles'
		this._styleTag.textContent = WIDGET_CSS
		document.head.appendChild(this._styleTag)
	}

	private _buildDOM(): void {
		// ── Wrapper ──────────────────────────────────────────────────────────────
		this._wrap = document.createElement('div')
		this._wrap.className = 'hue-picker-wrap'
		this._wrap.setAttribute('role', 'complementary')
		this._wrap.setAttribute('aria-label', 'Theme colour picker')

		// ── Trigger button ────────────────────────────────────────────────────
		this._trigger = document.createElement('button')
		this._trigger.className = 'hue-picker-trigger'
		this._trigger.setAttribute('type', 'button')
		this._trigger.setAttribute('aria-label', 'Open hue theme picker')
		this._trigger.setAttribute('aria-expanded', 'false')
		const dot = document.createElement('span')
		dot.className = 'hue-picker-trigger-dot'
		dot.setAttribute('aria-hidden', 'true')
		this._trigger.appendChild(dot)

		// ── Panel ─────────────────────────────────────────────────────────────
		this._panel = document.createElement('div')
		this._panel.className = 'hue-picker-panel'
		this._panel.setAttribute('role', 'dialog')
		this._panel.setAttribute('aria-label', 'Hue theme picker')
		this._panel.setAttribute('aria-modal', 'false')
		this._panel.hidden = true

		// ── Promo ? button ────────────────────────────────────────────────────
		this._promoBtn = document.createElement('button')
		this._promoBtn.className = 'hue-picker-promo-btn'
		this._promoBtn.setAttribute('type', 'button')
		this._promoBtn.setAttribute('aria-expanded', 'false')
		this._promoBtn.setAttribute('title', 'Use this on your site')
		this._promoBtn.textContent = '?'
		this._panel.appendChild(this._promoBtn)

		this._promoPopup = document.createElement('div')
		this._promoPopup.className = 'hue-picker-promo-popup'
		this._promoPopup.hidden = true
		const promoP = document.createElement('p')
		promoP.textContent = 'One CSS variable, every component recolors. A Tailwind CSS plugin.'
		const promoA = document.createElement('a')
		promoA.href = this._promoHref
		promoA.target = '_blank'
		promoA.rel = 'noopener noreferrer'
		promoA.textContent = 'tailwind-hue-theme →'
		this._promoPopup.append(promoP, promoA)
		this._panel.appendChild(this._promoPopup)

		// ── Wheel wrap ────────────────────────────────────────────────────────
		this._wheelWrap = document.createElement('div')
		this._wheelWrap.className = 'hue-picker-wheel-wrap'
		this._wheelWrap.setAttribute('role', 'slider')
		this._wheelWrap.setAttribute('aria-label', 'Hue angle')
		this._wheelWrap.setAttribute('aria-valuemin', '0')
		this._wheelWrap.setAttribute('aria-valuemax', '359')
		this._wheelWrap.setAttribute('tabindex', '0')

		const ring = document.createElement('div')
		ring.className = 'hue-picker-wheel'
		ring.setAttribute('aria-hidden', 'true')

		const hole = document.createElement('div')
		hole.className = 'hue-picker-wheel-hole'
		hole.setAttribute('aria-hidden', 'true')
		const swatch = document.createElement('div')
		swatch.className = 'hue-picker-wheel-swatch'
		hole.appendChild(swatch)

		this._handle = document.createElement('div')
		this._handle.className = 'hue-picker-handle'
		this._handle.setAttribute('aria-hidden', 'true')

		this._wheelWrap.append(ring, hole, this._handle)
		this._panel.appendChild(this._wheelWrap)

		// ── Preset swatches ───────────────────────────────────────────────────
		if (this._presets.length > 0) {
			const presetRow = document.createElement('div')
			presetRow.className = 'hue-picker-presets'
			presetRow.setAttribute('role', 'group')
			presetRow.setAttribute('aria-label', 'Preset hues')

			for (const preset of this._presets) {
				const btn = document.createElement('button')
				btn.className = 'hue-picker-preset'
				btn.setAttribute('type', 'button')
				btn.setAttribute('aria-label', `${preset.label} (hue ${preset.hue})`)
				btn.title = preset.label
				btn.style.background = `oklch(62% 0.18 ${preset.hue})`
				btn.dataset.hue = String(preset.hue)
				btn.addEventListener('click', () => this._applyHue(preset.hue))
				presetRow.appendChild(btn)
			}

			this._panel.appendChild(presetRow)
		}

		// ── Reset button ──────────────────────────────────────────────────────
		const reset = document.createElement('button')
		reset.className = 'hue-picker-reset'
		reset.setAttribute('type', 'button')
		reset.textContent = '↩ Reset to default'
		reset.addEventListener('click', () => this._applyHue(this._defaultHue))
		this._panel.appendChild(reset)

		// ── Assemble ──────────────────────────────────────────────────────────
		this._wrap.appendChild(this._trigger)
		this._wrap.appendChild(this._panel)
		this._container.appendChild(this._wrap)
	}

	private _attachEvents(): void {
		this._trigger.addEventListener('click', () => this._togglePanel())

		// Close on Escape
		document.addEventListener('keydown', (e: KeyboardEvent) => {
			if (e.key === 'Escape' && !this._panel.hidden) {
				this._closePanel()
				this._trigger.focus()
			}
		})

		// Close on outside click
		document.addEventListener('pointerdown', (e: PointerEvent) => {
			if (!this._panel.hidden && !this._wrap.contains(e.target as Node)) {
				this._closePanel()
			}
		})

		// Wheel pointer drag
		this._wheelWrap.addEventListener('pointerdown', (e: PointerEvent) => {
			e.preventDefault()
			this._dragging = true
			this._wheelWrap.setPointerCapture(e.pointerId)
			this._handleWheelPointer(e)
		})
		this._wheelWrap.addEventListener('pointermove', (e: PointerEvent) => {
			if (!this._dragging) return
			this._handleWheelPointer(e)
		})
		this._wheelWrap.addEventListener('pointerup', () => { this._dragging = false })
		this._wheelWrap.addEventListener('pointercancel', () => { this._dragging = false })

		// Arrow-key support — Shift held = 15° step, otherwise 5°
		this._wheelWrap.addEventListener('keydown', (e: KeyboardEvent) => {
			const step = e.shiftKey ? 15 : 5
			if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
				e.preventDefault()
				this._applyHue(this._normalise(this._hue + step))
			} else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
				e.preventDefault()
				this._applyHue(this._normalise(this._hue - step))
			}
		})

		// Promo popup toggle
		this._promoBtn.addEventListener('click', () => {
			const willExpand = this._promoPopup.hidden
			this._promoPopup.hidden = !willExpand
			this._promoBtn.setAttribute('aria-expanded', String(willExpand))
		})
	}

	private _handleWheelPointer(e: PointerEvent): void {
		const rect = this._wheelWrap.getBoundingClientRect()
		const cx = rect.left + rect.width / 2
		const cy = rect.top + rect.height / 2
		const dx = e.clientX - cx
		const dy = e.clientY - cy
		// atan2(dx, -dy): 0° at top (12 o'clock), increases clockwise.
		const hue = Math.atan2(dx, -dy) * (180 / Math.PI)
		this._applyHue(this._normalise(hue))
	}

	private _applyHue(hue: number, persist = true): void {
		this._hue = this._normalise(hue)
		document.documentElement.style.setProperty(this._cssVariable, String(this._hue))
		// --brand-color lets the trigger dot and wheel swatch update via CSS
		document.documentElement.style.setProperty('--brand-color', `oklch(62% 0.18 ${this._hue})`)
		this._updateHandle()
		this._wheelWrap.setAttribute('aria-valuenow', String(this._hue))

		// Sync preset active state (fuzzy match within ±8°)
		this._panel.querySelectorAll<HTMLElement>('.hue-picker-preset').forEach((btn) => {
			const ph = Number(btn.dataset.hue)
			const diff = Math.abs(((ph - this._hue + 540) % 360) - 180)
			btn.classList.toggle('is-active', diff < 8)
		})

		if (persist) {
			localStorage.setItem(this._storageKey, String(this._hue))
			this._onChange?.(this._hue)
		}
	}

	private _updateHandle(): void {
		const size = this._wheelWrap.clientWidth
		if (!size) return // not yet laid out (panel hidden)
		const r = size / 2
		// 0.7625 ≈ 61 / 80 — centres the handle on the ring (92 px hole, 160 px wheel)
		const trackR = r * 0.7625
		const angleRad = this._hue * (Math.PI / 180)
		this._handle.style.left = `${r + trackR * Math.sin(angleRad)}px`
		this._handle.style.top = `${r - trackR * Math.cos(angleRad)}px`
	}

	private _togglePanel(): void {
		this._panel.hidden ? this._openPanel() : this._closePanel()
	}

	private _openPanel(): void {
		this._panel.hidden = false
		this._trigger.setAttribute('aria-expanded', 'true')
		// Re-sync handle now that the panel is visible and layout has run
		requestAnimationFrame(() => this._updateHandle())
	}

	private _closePanel(): void {
		this._panel.hidden = true
		this._trigger.setAttribute('aria-expanded', 'false')
		this._promoPopup.hidden = true
		this._promoBtn.setAttribute('aria-expanded', 'false')
	}
}

/** Returns the raw CSS string injected by HuePicker — useful for SSR or custom injection. */
export function getWidgetCSS(): string {
	return WIDGET_CSS
}
