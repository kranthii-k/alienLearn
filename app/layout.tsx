import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alien Learn — AI-Powered Placement Prep",
  description:
    "Let AI analyze your coding skills and build a personalized 7-day spaced-repetition roadmap to ace your technical interviews.",
  keywords: ["placement prep", "DSA", "coding interview", "AI roadmap", "LeetCode"],
  openGraph: {
    title: "Alien Learn — AI-Powered Placement Prep",
    description: "AI-driven personalized roadmaps to ace your technical placement.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased relative">{children}</body>
    </html>
  );
}
