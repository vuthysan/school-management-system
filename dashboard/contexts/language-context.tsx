"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { SupportedLang } from "@/config/translations";

// Import i18n configuration (this initializes i18next)
import "@/config/i18n";

type LanguageContextType = {
	language: SupportedLang;
	setLanguage: (lang: SupportedLang) => void;
	t: (key: string, options?: Record<string, unknown>) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
	undefined
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
	// useTranslation hook handles re-renders automatically when language changes
	const { t: i18nT, i18n } = useTranslation();

	const language = (i18n.language as SupportedLang) || "en";

	const setLanguage = (lang: SupportedLang) => {
		i18n.changeLanguage(lang);
	};

	const t = (key: string, options?: Record<string, unknown>): string => {
		const result = i18nT(key, options as any);
		return typeof result === "string" ? result : key;
	};

	return (
		<LanguageContext.Provider value={{ language, setLanguage, t }}>
			{children}
		</LanguageContext.Provider>
	);
};

export const useLanguage = () => {
	const context = useContext(LanguageContext);

	if (context === undefined) {
		throw new Error("useLanguage must be used within a LanguageProvider");
	}

	return context;
};
