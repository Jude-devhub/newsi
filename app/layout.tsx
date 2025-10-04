import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Adsense from "@/components/ads/googeAds";

import Script from "next/script";
import Navigationbar from "@/components/layout/navigationbar";
import Footer from "@/components/layout/footer";

<Script
  id="adsense-script"
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX"
  crossOrigin="anonymous"
/>;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Newsi",
  description:
    "Get the latest news updates on world, Sports, Finance, and Technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >        
        <Adsense />
        <Navigationbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
