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

const siteUrl = "https://reaitycheck.com";
const defaultTitle = "ReAIity Check — Know your AI tools' limitations";
const description =
  "Daily automated testing of viral and edge-case AI failure cases. Track real-world limitations of the most popular models.";

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
    siteName: "ReAIity Check",
    locale: "en_US",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "ReAIity Check" }],
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
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${poppins.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
