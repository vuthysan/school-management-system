import {
  Fira_Code as FontMono,
  DM_Sans as FontSans,
  DM_Serif_Display as FontSerif,
  Kantumruy_Pro as FontKhmer,
} from "next/font/google";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const fontSerif = FontSerif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const fontKhmer = FontKhmer({
  subsets: ["khmer"],
  variable: "--font-khmer",
});
