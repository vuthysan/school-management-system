import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

// Initialize i18next - following official react-i18next pattern
i18n
	// load translation using http -> see /public/locales (i.e. https://github.com/i18next/react-i18next/tree/master/example/react/public/locales)
	// learn more: https://github.com/i18next/i18next-http-backend
	.use(Backend)
	// detect user language
	.use(LanguageDetector)
	// pass the i18n instance to react-i18next
	.use(initReactI18next)
	// init i18next
	.init({
		fallbackLng: "en",
		supportedLngs: ["en", "km"],
		debug: process.env.NODE_ENV === "development",
		interpolation: {
			escapeValue: false, // not needed for react as it escapes by default
		},
		backend: {
			loadPath:
				typeof window === "undefined"
					? `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/locales/{{lng}}/{{ns}}.json`
					: "/locales/{{lng}}/{{ns}}.json",
		},
		detection: {
			order: ["localStorage", "navigator"],
			caches: ["localStorage"],
			lookupLocalStorage: "sms-language",
		},
	});

export default i18n;
