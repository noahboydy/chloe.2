import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import "./globals.css";

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "For Chlo Chlo",
  description: "A little site to cheer you up, whenever you need it.",
  manifest: "/manifest.json",
  themeColor: "#f4568c",
  appleWebApp: {
    capable: true,
    title: "Chlo Chlo",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/icon-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${caveat.variable} font-sans`}>{children}</body>
    </html>
  );
}
