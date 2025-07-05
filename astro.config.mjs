import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

import sitemap from "@astrojs/sitemap";
import astroD2 from "astro-d2";
import { remarkAside } from "./src/transformers/asides";
import { remarkNewthought } from "./src/transformers/newthought";

// https://astro.build/config
export default defineConfig({
	site: "https://example.com",
	integrations: [
		mdx(),
		sitemap(),
		astroD2({
			sketch: true,
			inline: true,
			theme: {
				default: "105",
				dark: "200",
			},
		}),
	],
	markdown: {
		remarkPlugins: [remarkAside, remarkNewthought],
		shikiConfig: {
			themes: {
				light: "solarized-light",
				dark: "solarized-dark",
			},
			langs: [],
			wrap: false,
		},
	},
});
