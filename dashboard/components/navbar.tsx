"use client";

import { useState } from "react";
import NextLink from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Bell, Menu, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ThemeSwitch } from "@/components/theme-switch";
import { Logo, SearchIcon } from "@/components/icons";
import { roleToMenu, t as tMenu, UserRole } from "@/config/sms-menus";
import { useLanguage } from "@/contexts/language-context";
import { SupportedLang } from "@/config/translations";
import { useAuth } from "@/contexts/auth-context";

export const Navbar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const { logout, user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const roleParam = (searchParams.get("role") as UserRole) || "admin";

  function updateQuery(next: Partial<{ role: UserRole }>) {
    const params = new URLSearchParams(searchParams.toString());

    if (next.role) params.set("role", next.role);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 max-w-full">
        {/* Left side - Logo */}
        <div className="flex items-center gap-4">
          <NextLink className="flex items-center gap-2" href="/">
            <Logo />
            <span className="font-bold">SMS</span>
          </NextLink>
        </div>

        {/* Right side - Desktop */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Language Selector */}
          <Select
            value={language}
            onValueChange={(v) => setLanguage(v as SupportedLang)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">🇺🇸 English</SelectItem>
              <SelectItem value="km">🇰🇭 Khmer</SelectItem>
            </SelectContent>
          </Select>

          <ThemeSwitch />

          <Button size="icon" variant="ghost">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="relative h-8 w-8 rounded-full p-0"
                variant="ghost"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    alt="User"
                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  />
                  <AvatarFallback>S</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <p className="text-sm">Signed in as</p>
                <p className="text-sm font-medium">{user?.email || "User"}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>My Settings</DropdownMenuItem>
              <DropdownMenuItem>Team Settings</DropdownMenuItem>
              <DropdownMenuItem>Analytics</DropdownMenuItem>
              <DropdownMenuItem>System</DropdownMenuItem>
              <DropdownMenuItem>Configurations</DropdownMenuItem>
              <DropdownMenuItem>Help & Feedback</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={logout}
              >
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search */}
          <div className="hidden lg:flex relative">
            <SearchIcon className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8 w-[200px] h-9 bg-muted"
              placeholder="Search..."
              type="search"
            />
            <kbd className="hidden lg:inline-flex absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Mobile menu button */}
        <div className="flex sm:hidden items-center gap-2">
          <ThemeSwitch />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden border-t bg-background p-4">
          <div className="flex gap-2 mb-4">
            <Select
              value={roleParam}
              onValueChange={(v) => updateQuery({ role: v as UserRole })}
            >
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(
                  [
                    "admin",
                    "principal",
                    "teacher",
                    "student",
                    "parent",
                  ] as UserRole[]
                ).map((r) => (
                  <SelectItem key={r} value={r}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={language}
              onValueChange={(v) => setLanguage(v as SupportedLang)}
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">🇺🇸 English</SelectItem>
                <SelectItem value="km">🇰🇭 Khmer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Accordion className="w-full" type="multiple">
            {roleToMenu[roleParam].map((group) => (
              <AccordionItem key={group.key} value={group.key}>
                <AccordionTrigger className="text-sm font-medium">
                  {tMenu(group.title, language)}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-2 pl-4">
                    {group.items.map((it) => (
                      <NextLink
                        key={it.key}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                        href={it.href || "#"}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {tMenu(it.label, language)}
                      </NextLink>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </nav>
  );
};
