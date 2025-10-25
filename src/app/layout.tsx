import type { Metadata } from "next";
import type { Viewport } from "next";
import { Toaster } from 'sonner';
import "./globals.css";
import { Inter, Montserrat } from 'next/font/google'
import { Providers } from './providers'

const montserrat = Montserrat({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata: Metadata = {
  title: "Bivo Health | Web3 Medical Data Platform",
  description: "Secure medical data storage on BlockDAG blockchain. Access your health records with NFC-enabled cards. Empowering patients and healthcare providers with decentralized medical data management.",
  keywords: "medical records, blockchain healthcare, Web3 health, NFC medical cards, BlockDAG, decentralized health data, patient records, hospital data management",
  authors: [{ name: "Bivo Health" }],
  creator: "Bivo Health",
  publisher: "Bivo Health",
  applicationName: "Bivo Health",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://bivohealth.com",
    title: "Bivo Health | Web3 Medical Data Platform",
    description: "Secure medical data storage on BlockDAG blockchain with NFC card access for patients and healthcare providers",
    siteName: "Bivo Health",
    images: [{
      url: "/og-image.png",
      width: 1200,
      height: 630,
      alt: "Bivo Health - Web3 Medical Data Platform"
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Bivo Health | Web3 Medical Data Platform",
    description: "Secure medical data storage on BlockDAG blockchain with NFC card access for patients and healthcare providers",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#194dbe",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${montserrat.className}`}>
        <Providers>
          <Toaster position="top-right" />
          {children}
         </Providers>
      </body>
    </html>
  );
}
