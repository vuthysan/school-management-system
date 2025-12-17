"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";

export type ThemeColor = "blue" | "green" | "violet" | "orange" | "rose";
export type ThemeVariant = "zinc" | "slate" | "stone" | "gray" | "neutral";

interface ThemeColorContextProps {
  themeColor: ThemeColor;
  setThemeColor: (color: ThemeColor) => void;
  radius: number;
  setRadius: (radius: number) => void;
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
  const [radius, setRadius] = useState<number>(0.5);
  const [themeVariant, setThemeVariant] = useState<ThemeVariant>("zinc");
  const [isMounted, setIsMounted] = useState(false);
  const {} = useTheme(); // Ensure next-themes is initialized if needed, though mostly handled by ThemeProvider wrapper

  useEffect(() => {
    setIsMounted(true);
    const storedThemeColor = localStorage.getItem("themeColor") as ThemeColor;

    if (storedThemeColor) {
      setThemeColor(storedThemeColor);
    }
    const storedRadius = localStorage.getItem("themeRadius");

    if (storedRadius) {
      setRadius(parseFloat(storedRadius));
    }
    const storedVariant = localStorage.getItem("themeVariant") as ThemeVariant;

    if (storedVariant) {
      setThemeVariant(storedVariant);
    }
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem("themeColor", themeColor);
    localStorage.setItem("themeRadius", radius.toString());
    localStorage.setItem("themeVariant", themeVariant);

    const root = document.documentElement;

    root.setAttribute("data-theme-color", themeColor);
    root.setAttribute("data-theme-variant", themeVariant);
    root.style.setProperty("--radius", `${radius}rem`);
  }, [themeColor, radius, themeVariant, isMounted]);

  return (
    <ThemeColorContext.Provider
      value={{
        themeColor,
        setThemeColor,
        radius,
        setRadius,
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
