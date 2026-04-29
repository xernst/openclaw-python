import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import BrainDump from "@/components/BrainDump";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", axes: ["SOFT", "WONK"] });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Pyloft",
  description: "Josh's vibe-coded Python course — boot.dev mechanics with the streaks turned down.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${fraunces.variable} ${jetbrains.variable}`}>
      <body className="min-h-screen bg-ink-950 text-ink-100 antialiased font-sans">
        {children}
        <BrainDump />
      </body>
    </html>
  );
}
