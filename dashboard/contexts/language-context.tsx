"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

import { translations, SupportedLang } from "@/config/translations";

type LanguageContextType = {
  language: SupportedLang;
  setLanguage: (lang: SupportedLang) => void;
  t: (key: keyof typeof translations.en) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<SupportedLang>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("sms-language") as SupportedLang;

    if (savedLang && (savedLang === "en" || savedLang === "km")) {
      setLanguage(savedLang);
    }
  }, []);

  const handleSetLanguage = (lang: SupportedLang) => {
    setLanguage(lang);
    localStorage.setItem("sms-language", lang);
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || translations["en"][key] || key;
  };

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
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
