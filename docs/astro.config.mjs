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
		}),
	],

	vite: {
		plugins: [tailwindcss()],
	},
});
