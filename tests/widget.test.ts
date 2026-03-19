import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { HuePicker, DEFAULT_PRESETS } from '../src/widget'

describe('HuePicker', () => {
	let picker: HuePicker | null = null

	beforeEach(() => {
		localStorage.clear()
		document.head.innerHTML = ''
		document.body.innerHTML = ''
	})

	afterEach(() => {
		if (picker) {
			// Guard: already destroyed in some tests
			try { picker.destroy() } catch { /* already destroyed */ }
			picker = null
		}
	})

	// ── Initialisation ─────────────────────────────────────────────────────────

	it('initializes with default hue 250', () => {
		picker = new HuePicker()
		expect(picker.getHue()).toBe(250)
	})

	it('initializes with a custom defaultHue', () => {
		picker = new HuePicker({ defaultHue: 120 })
		expect(picker.getHue()).toBe(120)
	})

	it('restores hue from localStorage', () => {
		localStorage.setItem('tailwind-hue-theme', '75')
		picker = new HuePicker()
		expect(picker.getHue()).toBe(75)
	})

	// ── setHue / getHue ────────────────────────────────────────────────────────

	it('setHue updates getHue()', () => {
		picker = new HuePicker()
		picker.setHue(180)
		expect(picker.getHue()).toBe(180)
	})

	it('setHue normalises angles > 360', () => {
		picker = new HuePicker()
		picker.setHue(370)
		expect(picker.getHue()).toBe(10)
	})

	it('setHue normalises negative angles', () => {
		picker = new HuePicker()
		picker.setHue(-10)
		expect(picker.getHue()).toBe(350)
	})

	it('setHue persists to localStorage', () => {
		picker = new HuePicker()
		picker.setHue(180)
		expect(localStorage.getItem('tailwind-hue-theme')).toBe('180')
	})

	it('setHue uses a custom storageKey', () => {
		picker = new HuePicker({ storageKey: 'my-hue' })
		picker.setHue(200)
		expect(localStorage.getItem('my-hue')).toBe('200')
		expect(localStorage.getItem('tailwind-hue-theme')).toBeNull()
	})

	it('setHue sets --brand-h on documentElement', () => {
		picker = new HuePicker()
		picker.setHue(100)
		expect(document.documentElement.style.getPropertyValue('--brand-h')).toBe('100')
	})

	it('setHue respects a custom cssVariable', () => {
		picker = new HuePicker({ cssVariable: '--my-hue' })
		picker.setHue(42)
		expect(document.documentElement.style.getPropertyValue('--my-hue')).toBe('42')
	})

	// ── onChange callback ──────────────────────────────────────────────────────

	it('calls onChange when setHue is called', () => {
		const onChange = vi.fn()
		picker = new HuePicker({ onChange })
		picker.setHue(100)
		expect(onChange).toHaveBeenCalledOnce()
		expect(onChange).toHaveBeenCalledWith(100)
	})

	it('does not call onChange during init', () => {
		const onChange = vi.fn()
		picker = new HuePicker({ onChange })
		// init calls _applyHue with persist=false and no onChange firing
		expect(onChange).not.toHaveBeenCalled()
	})

	// ── DOM ────────────────────────────────────────────────────────────────────

	it('injects a style tag into document.head', () => {
		picker = new HuePicker()
		expect(document.getElementById('hue-picker-styles')).not.toBeNull()
	})

	it('does not inject duplicate style tags', () => {
		picker = new HuePicker()
		const p2 = new HuePicker()
		expect(document.querySelectorAll('#hue-picker-styles').length).toBe(1)
		p2.destroy()
	})

	it('appends trigger button to body', () => {
		picker = new HuePicker()
		expect(document.querySelector('.hue-picker-trigger')).not.toBeNull()
	})

	it('appends panel to body', () => {
		picker = new HuePicker()
		expect(document.querySelector('.hue-picker-panel')).not.toBeNull()
	})

	it('trigger has correct aria attributes', () => {
		picker = new HuePicker()
		const trigger = document.querySelector('.hue-picker-trigger')!
		expect(trigger.getAttribute('aria-label')).toBe('Open hue theme picker')
		expect(trigger.getAttribute('aria-expanded')).toBe('false')
	})

	it('renders preset swatches by default', () => {
		picker = new HuePicker()
		const swatches = document.querySelectorAll('.hue-picker-preset')
		expect(swatches.length).toBe(DEFAULT_PRESETS.length)
	})

	it('renders no swatches when presets is empty', () => {
		picker = new HuePicker({ presets: [] })
		expect(document.querySelector('.hue-picker-preset')).toBeNull()
	})

	it('renders custom presets', () => {
		picker = new HuePicker({ presets: [{ label: 'Red', hue: 0 }, { label: 'Blue', hue: 240 }] })
		expect(document.querySelectorAll('.hue-picker-preset').length).toBe(2)
	})

	// ── destroy ────────────────────────────────────────────────────────────────

	it('destroy removes trigger and panel from DOM', () => {
		picker = new HuePicker()
		picker.destroy()
		expect(document.querySelector('.hue-picker-trigger')).toBeNull()
		expect(document.querySelector('.hue-picker-panel')).toBeNull()
		picker = null
	})

	it('destroy removes the injected style tag', () => {
		picker = new HuePicker()
		picker.destroy()
		expect(document.getElementById('hue-picker-styles')).toBeNull()
		picker = null
	})

	// ── custom container ───────────────────────────────────────────────────────

	it('appends to a custom container', () => {
		const container = document.createElement('div')
		document.body.appendChild(container)
		picker = new HuePicker({ container })
		expect(container.querySelector('.hue-picker-trigger')).not.toBeNull()
		expect(container.querySelector('.hue-picker-panel')).not.toBeNull()
	})
})
