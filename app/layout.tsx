import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Smart Energy — Ağıllı Enerji Monitorinqi",
  description:
    "Evinizin gərginlik, cərəyan, enerji sərfiyyatı və elektrik sızması göstəricilərini real vaxta yaxın izləyin.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="az" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-base-950 text-ink-100 font-body antialiased">
        {children}
      </body>
    </html>
  );
}
