// ─── CSS (injected into <head> once) ─────────────────────────────────────────

const WIDGET_CSS = `
.hue-picker-trigger {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  border: 2px solid rgba(255,255,255,0.2);
  cursor: pointer;
  box-shadow: 0 4px 24px rgba(0,0,0,0.4);
  z-index: 9999;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  background: conic-gradient(
    from 0deg,
    oklch(70% 0.18 0),
    oklch(70% 0.18 60),
    oklch(70% 0.18 120),
    oklch(70% 0.18 180),
    oklch(70% 0.18 240),
    oklch(70% 0.18 300),
    oklch(70% 0.18 360)
  );
  overflow: hidden;
}
.hue-picker-trigger:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 32px rgba(0,0,0,0.5);
}
.hue-picker-trigger-inner {
  position: absolute;
  inset: 4px;
  border-radius: 9999px;
  background: oklch(18% 0.14 var(--brand-h, 250));
  transition: background 0.3s ease;
  pointer-events: none;
}
.hue-picker-panel {
  position: fixed;
  bottom: 5.5rem;
  right: 1.5rem;
  background: oklch(15% 0.03 var(--brand-h, 250));
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 1.25rem;
  padding: 1.25rem;
  z-index: 9998;
  box-shadow: 0 8px 40px rgba(0,0,0,0.5);
  width: 14rem;
  display: none;
  flex-direction: column;
  gap: 1rem;
  backdrop-filter: blur(12px);
}
.hue-picker-panel.is-open {
  display: flex;
}
.hue-picker-wheel-wrap {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
}
.hue-picker-wheel {
  width: 100%;
  height: 100%;
  border-radius: 9999px;
  background: conic-gradient(
    from 0deg,
    oklch(70% 0.18 0),
    oklch(70% 0.18 30),
    oklch(70% 0.18 60),
    oklch(70% 0.18 90),
    oklch(70% 0.18 120),
    oklch(70% 0.18 150),
    oklch(70% 0.18 180),
    oklch(70% 0.18 210),
    oklch(70% 0.18 240),
    oklch(70% 0.18 270),
    oklch(70% 0.18 300),
    oklch(70% 0.18 330),
    oklch(70% 0.18 360)
  );
  cursor: crosshair;
  touch-action: none;
}
.hue-picker-handle {
  position: absolute;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
  background: white;
  border: 2px solid rgba(0,0,0,0.3);
  box-shadow: 0 2px 8px rgba(0,0,0,0.5);
  transform: translate(-50%, -50%);
  pointer-events: none;
  transition: box-shadow 0.1s;
}
.hue-picker-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  justify-content: center;
}
.hue-picker-preset {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 9999px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: transform 0.12s ease, border-color 0.12s ease;
  flex-shrink: 0;
  padding: 0;
}
.hue-picker-preset:hover {
  transform: scale(1.15);
}
.hue-picker-preset.is-active {
  border-color: white;
}
.hue-picker-reset {
  width: 100%;
  padding: 0.375rem 0;
  background: rgba(255,255,255,0.07);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 0.5rem;
  color: rgba(255,255,255,0.5);
  font-size: 0.75rem;
  cursor: pointer;
  transition: background 0.12s, color 0.12s;
  font-family: inherit;
}
.hue-picker-reset:hover {
  background: rgba(255,255,255,0.12);
  color: rgba(255,255,255,0.8);
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

	private _trigger!: HTMLButtonElement
	private _panel!: HTMLDivElement
	private _wheel!: HTMLDivElement
	private _handle!: HTMLDivElement
	private _styleTag!: HTMLStyleElement
	private _dragging = false

	constructor(options: HuePickerOptions = {}) {
		this._defaultHue = options.defaultHue ?? 250
		this._cssVariable = options.cssVariable ?? '--brand-h'
		this._storageKey = options.storageKey ?? 'tailwind-hue-theme'
		this._onChange = options.onChange
		this._presets = options.presets ?? DEFAULT_PRESETS
		this._container = options.container ?? document.body

		// Restore persisted hue (falls back to defaultHue)
		const stored = localStorage.getItem(this._storageKey)
		this._hue = stored !== null ? Number(stored) : this._defaultHue

		this._injectStyles()
		this._buildDOM()
		this._attachEvents()
		// Apply without persisting (we only persisted on user interaction)
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
		this._trigger.remove()
		this._panel.remove()
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
		// ── Trigger button ──────────────────────────────────────────────────────
		this._trigger = document.createElement('button')
		this._trigger.className = 'hue-picker-trigger'
		this._trigger.setAttribute('aria-label', 'Open hue theme picker')
		this._trigger.setAttribute('aria-expanded', 'false')
		this._trigger.setAttribute('aria-haspopup', 'dialog')
		this._trigger.setAttribute('type', 'button')
		const triggerInner = document.createElement('span')
		triggerInner.className = 'hue-picker-trigger-inner'
		triggerInner.setAttribute('aria-hidden', 'true')
		this._trigger.appendChild(triggerInner)

		// ── Panel ───────────────────────────────────────────────────────────────
		this._panel = document.createElement('div')
		this._panel.className = 'hue-picker-panel'
		this._panel.setAttribute('role', 'dialog')
		this._panel.setAttribute('aria-label', 'Hue theme picker')
		this._panel.setAttribute('aria-modal', 'false')

		// Wheel wrapper + wheel + handle
		const wheelWrap = document.createElement('div')
		wheelWrap.className = 'hue-picker-wheel-wrap'

		this._wheel = document.createElement('div')
		this._wheel.className = 'hue-picker-wheel'
		this._wheel.setAttribute('role', 'slider')
		this._wheel.setAttribute('aria-label', 'Hue angle')
		this._wheel.setAttribute('aria-valuemin', '0')
		this._wheel.setAttribute('aria-valuemax', '359')

		this._handle = document.createElement('div')
		this._handle.className = 'hue-picker-handle'
		this._handle.setAttribute('aria-hidden', 'true')

		wheelWrap.append(this._wheel, this._handle)
		this._panel.appendChild(wheelWrap)

		// ── Preset swatches ─────────────────────────────────────────────────────
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
				btn.style.background = `oklch(65% 0.18 ${preset.hue})`
				btn.dataset.hue = String(preset.hue)
				btn.addEventListener('click', () => this._applyHue(preset.hue))
				presetRow.appendChild(btn)
			}

			this._panel.appendChild(presetRow)
		}

		// ── Reset button ────────────────────────────────────────────────────────
		const reset = document.createElement('button')
		reset.className = 'hue-picker-reset'
		reset.setAttribute('type', 'button')
		reset.textContent = 'Reset to default'
		reset.addEventListener('click', () => this._applyHue(this._defaultHue))
		this._panel.appendChild(reset)

		this._container.appendChild(this._trigger)
		this._container.appendChild(this._panel)
	}

	private _attachEvents(): void {
		this._trigger.addEventListener('click', () => this._togglePanel())

		// Close on Escape
		document.addEventListener('keydown', (e: KeyboardEvent) => {
			if (e.key === 'Escape' && this._panel.classList.contains('is-open')) {
				this._closePanel()
				this._trigger.focus()
			}
		})

		// Close on outside click
		document.addEventListener('pointerdown', (e: PointerEvent) => {
			if (
				this._panel.classList.contains('is-open') &&
				!this._panel.contains(e.target as Node) &&
				!this._trigger.contains(e.target as Node)
			) {
				this._closePanel()
			}
		})

		// Wheel pointer drag
		this._wheel.addEventListener('pointerdown', (e: PointerEvent) => {
			this._dragging = true
			this._wheel.setPointerCapture(e.pointerId)
			this._handleWheelPointer(e)
		})
		this._wheel.addEventListener('pointermove', (e: PointerEvent) => {
			if (!this._dragging) return
			this._handleWheelPointer(e)
		})
		this._wheel.addEventListener('pointerup', () => { this._dragging = false })
		this._wheel.addEventListener('pointercancel', () => { this._dragging = false })

		// Arrow-key support on the wheel for accessibility
		this._wheel.addEventListener('keydown', (e: KeyboardEvent) => {
			if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
				e.preventDefault()
				this._applyHue(this._normalise(this._hue + 5))
			} else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
				e.preventDefault()
				this._applyHue(this._normalise(this._hue - 5))
			}
		})
		this._wheel.setAttribute('tabindex', '0')
	}

	private _handleWheelPointer(e: PointerEvent): void {
		const rect = this._wheel.getBoundingClientRect()
		const cx = rect.left + rect.width / 2
		const cy = rect.top + rect.height / 2
		const dx = e.clientX - cx
		const dy = e.clientY - cy
		// atan2 gives angle (radians) from +x axis, clockwise in screen coords.
		// Offset by +90° so hue 0 (red) lands at the top (12 o'clock).
		const screenAngleDeg = Math.atan2(dy, dx) * (180 / Math.PI)
		this._applyHue(this._normalise(screenAngleDeg + 90))
	}

	private _applyHue(hue: number, persist = true): void {
		this._hue = this._normalise(hue)
		document.documentElement.style.setProperty(this._cssVariable, String(this._hue))
		this._updateHandle()
		this._wheel.setAttribute('aria-valuenow', String(this._hue))

		// Sync preset active state
		this._panel.querySelectorAll<HTMLElement>('.hue-picker-preset').forEach((btn) => {
			btn.classList.toggle('is-active', Number(btn.dataset.hue) === this._hue)
		})

if (persist) {
      localStorage.setItem(this._storageKey, String(this._hue))
      this._onChange?.(this._hue)
    }
	}

	private _updateHandle(): void {
		const wrap = this._wheel.parentElement as HTMLElement
		const size = wrap.clientWidth
		if (!size) return // not yet laid out (e.g. panel hidden)
		const r = size / 2
		// Place handle at 82 % of the radius so it sits just inside the wheel edge
		const trackR = r * 0.82
		const angleDeg = (this._hue - 90) // rotate so hue 0 = top
		const angleRad = angleDeg * (Math.PI / 180)
		this._handle.style.left = `${r + trackR * Math.cos(angleRad)}px`
		this._handle.style.top = `${r + trackR * Math.sin(angleRad)}px`
	}

	private _togglePanel(): void {
		this._panel.classList.contains('is-open') ? this._closePanel() : this._openPanel()
	}

	private _openPanel(): void {
		this._panel.classList.add('is-open')
		this._trigger.setAttribute('aria-expanded', 'true')
		// Re-sync handle now that the panel is visible and layout has run
		requestAnimationFrame(() => this._updateHandle())
	}

	private _closePanel(): void {
		this._panel.classList.remove('is-open')
		this._trigger.setAttribute('aria-expanded', 'false')
	}
}

/** Returns the raw CSS string injected by HuePicker — useful for SSR or custom injection. */
export function getWidgetCSS(): string {
	return WIDGET_CSS
}
