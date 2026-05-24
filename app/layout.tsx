import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({
  subsets: ["latin"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "LeanPath | Body Fat & Calorie Calculator",
  description:
    "A premium body fat and calorie planning app with body composition visuals, target weight, calorie deficit, and projected timeline.",
  openGraph: {
    title: "LeanPath | Body Fat & Calorie Calculator",
    description:
      "Calculate fat mass, lean body mass, target weight, daily calorie intake, and a realistic fat-loss timeline.",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
