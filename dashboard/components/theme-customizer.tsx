"use client";

import React, { useEffect } from "react";
import { Moon, Sun, Settings2, RotateCcw } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";
import { useThemeColor, ThemeColor } from "@/contexts/theme-color-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function ThemeCustomizer() {
  const {
    themeColor,
    setThemeColor,
    radius,
    setRadius,
    themeVariant,
    setThemeVariant,
  } = useThemeColor();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themes: { name: ThemeColor; color: string; label: string }[] = [
    { name: "blue", color: "bg-blue-600", label: "Blue" },
    { name: "green", color: "bg-green-600", label: "Green" },
    { name: "violet", color: "bg-violet-600", label: "Violet" },
    { name: "orange", color: "bg-orange-600", label: "Orange" },
    { name: "rose", color: "bg-rose-600", label: "Rose" },
  ];

  const radii = [0, 0.3, 0.5, 0.75, 1.0];
  const variants: {
    name: "zinc" | "slate" | "stone" | "gray" | "neutral";
    label: string;
    color: string;
  }[] = [
    { name: "zinc", label: "Zinc", color: "bg-zinc-500" },
    { name: "slate", label: "Slate", color: "bg-slate-500" },
    { name: "stone", label: "Stone", color: "bg-stone-500" },
    { name: "gray", label: "Gray", color: "bg-gray-500" },
    { name: "neutral", label: "Neutral", color: "bg-neutral-500" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-8 w-8 rounded-full" size="icon" variant="outline">
          <Settings2 className="h-4 w-4" />
          <span className="sr-only">Customize Theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-4">
        <div className="flex items-center justify-between pb-4">
          <DropdownMenuLabel className="p-0">
            Theme Customizer
          </DropdownMenuLabel>
          <Button
            className="h-6 w-6"
            size="icon"
            variant="ghost"
            onClick={() => {
              setThemeColor("blue");
              setRadius(0.5);
              setThemeVariant("zinc");
              setTheme("light");
            }}
          >
            <RotateCcw className="h-3 w-3" />
            <span className="sr-only">Reset</span>
          </Button>
        </div>

        <DropdownMenuSeparator />

        <div className="space-y-1.5 pt-4">
          <Label className="text-xs">Mode</Label>
          <div className="flex w-full items-center justify-between rounded-md border p-2">
            <div className="flex items-center gap-2">
              {mounted ? (
                theme === "dark" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )
              ) : (
                <Sun className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {mounted
                  ? theme === "dark"
                    ? "Dark Mode"
                    : "Light Mode"
                  : "Light Mode"}
              </span>
            </div>
            <Button
              className="h-6 px-2 text-xs"
              size="sm"
              variant="ghost"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              Toggle
            </Button>
          </div>
        </div>

        <div className="space-y-1.5 pt-4">
          <Label className="text-xs">Color</Label>
          <div className="grid grid-cols-5 gap-2">
            {themes.map((t) => (
              <Button
                key={t.name}
                className={cn(
                  "h-8 w-8 rounded-full border-2",
                  themeColor === t.name
                    ? "border-primary"
                    : "border-transparent",
                )}
                size="icon"
                variant="outline"
                onClick={() => setThemeColor(t.name)}
              >
                <div className={cn("h-5 w-5 rounded-full", t.color)} />
                <span className="sr-only">{t.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 pt-4">
          <Label className="text-xs">Radius</Label>
          <div className="grid grid-cols-5 gap-2">
            {radii.map((r) => (
              <Button
                key={r}
                className={cn(
                  "h-8 w-full justify-center px-0",
                  radius === r && "border-primary border-2",
                )}
                size="sm"
                variant="outline"
                onClick={() => setRadius(r)}
              >
                {r}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5 pt-4">
          <Label className="text-xs">Appearance</Label>
          <div className="grid grid-cols-3 gap-2">
            {variants.map((v) => (
              <Button
                key={v.name}
                className={cn(
                  "h-8 w-full justify-start px-2",
                  themeVariant === v.name && "border-primary border-2",
                )}
                size="sm"
                variant="outline"
                onClick={() => setThemeVariant(v.name)}
              >
                <div className={cn("h-4 w-4 rounded-full mr-2", v.color)} />
                <span className="text-xs">{v.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
