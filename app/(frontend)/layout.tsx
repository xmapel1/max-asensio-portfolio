import type { Metadata } from "next";
import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";
import localFont from "next/font/local";

const funeraksDemo = localFont({
  src: "../fonts/Funeraks-j6e9.ttf",
  display: "swap",
  variable: "--font-funeraks-demo",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Max Asensio",
  description: "Max Asensio's personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${funeraksDemo.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-black text-white">
        <main>{children}</main>
      </body>
    </html>
  );
}
