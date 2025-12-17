/** @type {import('tailwindcss').Config} */
const config = {
	content: [
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: "var(--primary)",
					foreground: "var(--primary-foreground)",
				},
			},
			fontFamily: {
				sans: ["var(--font-sans)", "var(--font-khmer)"],
				mono: ["var(--font-mono)"],
			},
		},
	},
	darkMode: "class",
	plugins: [],
};

module.exports = config;
