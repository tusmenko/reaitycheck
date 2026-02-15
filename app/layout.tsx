import type { Metadata } from "next";
import { Geist_Mono, Inter, Poppins } from "next/font/google";
import { ConvexClientProvider } from "./convex-provider";
import { Navbar } from "@/components/landing/navbar";
import { FooterSection } from "@/components/landing/footer-section";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ReAIity Check — Know your tools' limitations",
  description:
    "Daily automated testing of viral and edge-case AI failure cases. Track real-world limitations of the most popular models.",
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
        className={`${inter.variable} ${poppins.variable} ${geistMono.variable} antialiased`}
      >
        <ConvexClientProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="content-below-nav flex-1 pt-20">{children}</div>
            <FooterSection />
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
