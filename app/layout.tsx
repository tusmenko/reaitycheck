import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { ConvexClientProvider } from "./convex-provider";
import { Navbar } from "@/components/landing/navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "RealityCheck - AI Models Challenger",
  description:
    "We run non-trivial prompts across popular models to surface failures that academic benchmarks average out. No fluff, just edge cases.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased overflow-x-hidden`}
      >
        <ConvexClientProvider>
          <Navbar />
          {children}
        </ConvexClientProvider>
      </body>
    </html>
  );
}
