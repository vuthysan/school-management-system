"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";

export type ThemeColor = "blue" | "green" | "violet" | "orange" | "rose" | "indigo";
export type ThemeVariant = "zinc" | "slate" | "stone" | "gray" | "neutral";

interface ThemeColorContextProps {
	themeColor: ThemeColor;
	setThemeColor: (color: ThemeColor) => void;
	themeVariant: ThemeVariant;
	setThemeVariant: (variant: ThemeVariant) => void;
}

const ThemeColorContext = createContext<ThemeColorContextProps | undefined>(
	undefined,
);

export function ThemeColorProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [themeColor, setThemeColor] = useState<ThemeColor>("blue");
	const [themeVariant, setThemeVariant] = useState<ThemeVariant>("zinc");
	const [isMounted, setIsMounted] = useState(false);
	const {} = useTheme();

	useEffect(() => {
		setIsMounted(true);
		const storedThemeColor = localStorage.getItem("themeColor") as ThemeColor;
		if (storedThemeColor) {
			setThemeColor(storedThemeColor);
		}
		const storedVariant = localStorage.getItem("themeVariant") as ThemeVariant;
		if (storedVariant) {
			setThemeVariant(storedVariant);
		}
	}, []);

	useEffect(() => {
		if (!isMounted) return;
		localStorage.setItem("themeColor", themeColor);
		localStorage.setItem("themeVariant", themeVariant);

		const root = document.documentElement;
		root.setAttribute("data-theme-color", themeColor);
		root.setAttribute("data-theme-variant", themeVariant);
	}, [themeColor, themeVariant, isMounted]);

	return (
		<ThemeColorContext.Provider
			value={{
				themeColor,
				setThemeColor,
				themeVariant,
				setThemeVariant,
			}}
		>
			{children}
		</ThemeColorContext.Provider>
	);
}

export function useThemeColor() {
	const context = useContext(ThemeColorContext);

	if (!context) {
		throw new Error("useThemeColor must be used within a ThemeColorProvider");
	}

	return context;
}
