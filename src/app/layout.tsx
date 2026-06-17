import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// Schriftart Inter via next/font laden (selbst-gehostet, performant)
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Wetter-Dashboard",
  description:
    "Modernes Wetter-Dashboard mit aktuellem Wetter und 5-Tage-Vorhersage, gebaut mit Next.js, TypeScript und Tailwind CSS.",
  keywords: ["Wetter", "Dashboard", "Next.js", "Vorhersage", "OpenWeatherMap"],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="font-sans text-white antialiased">{children}</body>
    </html>
  );
}
