import type { Metadata } from "next";
import localFont from "next/font/local";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import Header from "./components/header";
import Footer from "./components/footer";

const ndot57 = localFont({
  src: "./fonts/Ndot57-Regular.otf",
  display: "swap",
  variable: "--font-ndot57",
});

const ndot57Caps = localFont({
  src: "./fonts/Ndot57Caps-Regular.otf",
  display: "swap",
  variable: "--font-ndot57-caps",
});

const ntype82 = localFont({
  src: "./fonts/NType82-Regular.otf",
  display: "swap",
  variable: "--font-ntype82",
});

const ntype82Headline = localFont({
  src: "./fonts/NType82-Headline.otf",
  display: "swap",
  variable: "--font-ntype82-headline",
});

const spaceGrotesk = Space_Grotesk({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "Nothing (R) — Phone (4a)",
  description: "Built different. An unofficial Nothing e-commerce concept store.",
};

const themeScript = `(function(){try{var s=localStorage.getItem('theme');var d=s?s==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;var h=document.documentElement;h.setAttribute('data-theme',d?'dark':'light');h.style.colorScheme=d?'dark':'light';}catch(e){document.documentElement.setAttribute('data-theme','dark');document.documentElement.style.colorScheme='dark';}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`min-h-full flex flex-col ${ndot57.variable} ${ndot57Caps.variable} ${ntype82.variable} ${ntype82Headline.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
      >
        <ThemeProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
