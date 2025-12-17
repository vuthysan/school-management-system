"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeColorProvider } from "@/contexts/theme-color-provider";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  return (
    <NextThemesProvider {...themeProps}>
      <ThemeColorProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </ThemeColorProvider>
    </NextThemesProvider>
  );
}
