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
				success: {
					DEFAULT: "var(--success)",
					foreground: "var(--success-foreground)",
				},
				warning: {
					DEFAULT: "var(--warning)",
					foreground: "var(--warning-foreground)",
				},
				info: {
					DEFAULT: "var(--info)",
					foreground: "var(--info-foreground)",
				},
			},
			fontFamily: {
				sans: ["var(--font-sans)", "var(--font-khmer)"],
				serif: ["var(--font-serif)"],
				mono: ["var(--font-mono)"],
			},
		},
	},
	darkMode: "class",
	plugins: [],
};

module.exports = config;
