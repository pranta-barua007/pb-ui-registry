// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { GITHUB_REPO_URL } from './environment.js';


// https://astro.build/config
export default defineConfig({
	site: GITHUB_REPO_URL,
	// base: GITHUB_REPO_NAME,
	integrations: [
		starlight({
			title: 'Halp UI Registry',
			customCss: ['./src/styles/global.css'],
			social: [{ icon: 'github', label: 'GitHub', href: GITHUB_REPO_URL }],
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'getting-started/introduction' },
						{ label: 'Installation', slug: 'getting-started/installation' },
					],
				},
				{
					label: 'Components',
					autogenerate: { directory: 'components' },
				},
			],
		}),
		react(),
	],
	vite: {
		plugins: [tailwindcss()],
	},
});
