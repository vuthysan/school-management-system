"use client";

import { FC } from "react";
import { useTheme } from "next-themes";
import { useIsSSR } from "@react-aria/ssr";
import { Button } from "@/components/ui/button";
import { SunFilledIcon, MoonFilledIcon } from "@/components/icons";
import { cn } from "@/lib/utils";

export interface ThemeSwitchProps {
  className?: string;
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({ className }) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const isDark = theme === "dark" && !isSSR;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      className={cn("h-9 w-9", className)}
    >
      {isDark ? (
        <MoonFilledIcon size={20} />
      ) : (
        <SunFilledIcon size={20} />
      )}
    </Button>
  );
};
