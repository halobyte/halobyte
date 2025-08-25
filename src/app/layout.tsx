import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";

const interSans = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Halobyte | Technology & Marketing That Scales Brands",
  description:
    "At Halobyte, we devise ingenious technology and amplify brands. From tangible advertising technology and enterprise software to digital marketing, our diverse team blends 30+ years of cross-generational expertise to power business growth.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${interSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
