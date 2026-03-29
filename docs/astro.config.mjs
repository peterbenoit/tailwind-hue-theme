// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Tailwind Hue Theme',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/peterbenoit/tailwind-hue-theme' }],
			sidebar: [
				{ label: 'Getting Started', slug: 'getting-started' },
				{ label: 'Live Demo', slug: 'demo' },
			],
			head: [
				// Google Analytics
				{ tag: 'script', attrs: { src: 'https://www.googletagmanager.com/gtag/js?id=G-GQEC09BG5Z', async: true } },
				{ tag: 'script', content: "window.dataLayer = window.dataLayer || []; function gtag() { dataLayer.push(arguments); } gtag('js', new Date()); gtag('config', 'G-GQEC09BG5Z');" },
			],
		}),
	],

	vite: {
		plugins: [tailwindcss()],
	},
});
