import {
  Fira_Code as FontMono,
  Outfit as FontSans,
  Kantumruy_Pro as FontKhmer,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontKhmer = FontKhmer({
  subsets: ["khmer"],
  variable: "--font-khmer",
});
