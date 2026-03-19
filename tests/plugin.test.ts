import { describe, it, expect } from 'vitest'
import { buildTokens, createHuePlugin } from '../src/index'

describe('buildTokens', () => {
	it('sets --brand-h to the default hue', () => {
		expect(buildTokens()['--brand-h']).toBe('250')
	})

	it('respects a custom defaultHue', () => {
		expect(buildTokens({ defaultHue: 0 })['--brand-h']).toBe('0')
	})

	it('emits all 11 slate steps', () => {
		const tokens = buildTokens()
		const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
		for (const step of steps) {
			expect(tokens[`--color-slate-${step}`], `slate-${step} missing`).toBeDefined()
		}
	})

	it('emits all 11 indigo steps', () => {
		const tokens = buildTokens()
		const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
		for (const step of steps) {
			expect(tokens[`--color-indigo-${step}`], `indigo-${step} missing`).toBeDefined()
		}
	})

	it('emits all 11 cyan steps', () => {
		const tokens = buildTokens()
		const steps = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
		for (const step of steps) {
			expect(tokens[`--color-cyan-${step}`], `cyan-${step} missing`).toBeDefined()
		}
	})

	it('slate tokens have low chroma (≤ 0.036)', () => {
		const tokens = buildTokens()
		expect(tokens['--color-slate-950']).toContain('0.036')
		expect(tokens['--color-slate-50']).toContain('0.004')
	})

	it('slate tokens reference --brand-h without calc()', () => {
		const tokens = buildTokens()
		expect(tokens['--color-slate-500']).toMatch(/var\(--brand-h/)
		expect(tokens['--color-slate-500']).not.toContain('calc')
	})

	it('indigo tokens reference --brand-h without an offset', () => {
		const tokens = buildTokens()
		expect(tokens['--color-indigo-500']).toContain('var(--brand-h')
		expect(tokens['--color-indigo-500']).not.toContain('calc')
	})

	it('cyan tokens use calc() with the default offset (+40)', () => {
		const tokens = buildTokens()
		expect(tokens['--color-cyan-500']).toContain('calc(var(--brand-h')
		expect(tokens['--color-cyan-500']).toContain('+ 40)')
	})

	it('respects a custom secondaryOffset', () => {
		const tokens = buildTokens({ secondaryOffset: 60 })
		expect(tokens['--color-cyan-500']).toContain('+ 60)')
	})

	it('falls back to defaultHue inside var()', () => {
		const tokens = buildTokens({ defaultHue: 155 })
		expect(tokens['--color-slate-950']).toContain('var(--brand-h, 155)')
		expect(tokens['--color-indigo-500']).toContain('var(--brand-h, 155)')
		expect(tokens['--color-cyan-500']).toContain('var(--brand-h, 155)')
	})

	it('produces valid oklch() strings', () => {
		const tokens = buildTokens()
		for (const value of Object.values(tokens)) {
			if (value.startsWith('oklch')) {
				expect(value).toMatch(/^oklch\(\d+%? [\d.]+ /)
			}
		}
	})
})

describe('createHuePlugin', () => {
	it('returns an object that has a handler property', () => {
		const p = createHuePlugin()
		// The plugin() helper returns { handler, config }
		expect(typeof (p as { handler: unknown }).handler).toBe('function')
	})

	it('handler calls addBase with :root tokens', () => {
		const p = createHuePlugin({ defaultHue: 120 })
		let capturedBase: Record<string, unknown> | undefined
		const fakeApi = {
			addBase: (base: Record<string, unknown>) => { capturedBase = base },
		}
			; (p as { handler: (api: unknown) => void }).handler(fakeApi)
		expect(capturedBase).toBeDefined()
		expect((capturedBase as Record<string, unknown>)[':root']).toBeDefined()
		const root = (capturedBase as { ':root': Record<string, string> })[':root']
		expect(root['--brand-h']).toBe('120')
	})
})
