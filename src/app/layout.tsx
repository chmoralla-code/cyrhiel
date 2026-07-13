import type { Metadata } from "next";
import { Newsreader, Oxanium, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import { getSiteContent } from "@/lib/content-store";

const oxanium = Oxanium({
  variable: "--font-oxanium",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteContent();
  return {
    title: site.title,
    description: site.description,
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${oxanium.variable} ${sourceSans.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="site-atmosphere min-h-full font-sans text-foreground">
        {children}
      </body>
    </html>
  );
}
