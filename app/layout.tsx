import type { Metadata } from "next";
import { Space_Grotesk, Space_Mono } from "next/font/google";
import { FooterSection } from "@/components/landing/footer-section";
import { Navbar } from "@/components/landing/navbar";
import { ConvexClientProvider } from "./convex-provider";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const siteUrl = "https://reaitycheck.com";
const defaultTitle = "ReAIty Check — Know your AI tools' limitations";
const description =
  "Daily automated testing of viral and edge-case AI failure cases. " +
  "Track real-world limitations of the most popular models.";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite" as const,
  name: "ReAIty Check",
  url: siteUrl,
  description,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: "%s — ReAIty Check",
  },
  description,
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: defaultTitle,
    description,
    url: siteUrl,
    siteName: "ReAIty Check",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "ReAIty Check" }],
  },
  twitter: {
    card: "summary_large_image",
    title: defaultTitle,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`
          ${spaceGrotesk.variable}
          ${spaceMono.variable}
          antialiased
        `}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ConvexClientProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1 pt-20">{children}</div>
            <FooterSection />
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
