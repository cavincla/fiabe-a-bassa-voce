import type { Metadata, Viewport } from "next";
import { Fraunces, Karla } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

// Fraunces: titoli e testo delle pagine lette ad alta voce nel lettore.
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

// Karla: interfaccia (filtri, pulsanti, metadati).
const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fiabe a Bassa Voce",
  description:
    "Fiabe per bambini, gratuite, categorizzate per età, morale e benessere del bambino.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Fiabe a Bassa Voce",
  },
};

export const viewport: Viewport = {
  themeColor: "#171433",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" suppressHydrationWarning>
      <body
        className={`${fraunces.variable} ${karla.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
