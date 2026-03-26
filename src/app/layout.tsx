import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import SchemaMarkup from "@/components/SchemaMarkup";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Masters Marketing Agency | Digital Marketing That Drives Results",
  description: "Transform your business with proven digital marketing strategies. SEO, reputation management, lead generation & more. Serving Las Vegas and nationwide. Get a free consultation today.",
  keywords: "digital marketing agency, SEO services, reputation management, lead generation, Las Vegas marketing agency, online marketing, business growth",
  openGraph: {
    title: "Masters Marketing Agency | Digital Marketing That Drives Results",
    description: "Transform your business with proven digital marketing strategies. Get a free consultation today.",
    url: "https://mastersmarketingagency.com",
    siteName: "Masters Marketing Agency",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Masters Marketing Agency | Digital Marketing That Drives Results",
    description: "Transform your business with proven digital marketing strategies.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://mastersmarketingagency.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#FF9700" />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <SchemaMarkup />
        {children}
      </body>
    </html>
  );
}
