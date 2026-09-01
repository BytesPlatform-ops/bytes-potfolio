import type { Metadata, Viewport } from "next";
import {
  Inter_Tight,
  Instrument_Serif,
  JetBrains_Mono,
  Caveat,
} from "next/font/google";
import { siteConfig, me, siteUrl } from "@/lib/site";
import { Analytics } from "@/components/analytics/Analytics";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-inter-tight",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});

/** The margin-note face. Used ONLY for small handwritten asides — never UI. */
const hand = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
  weight: ["500", "600"],
});

const monoLabel = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-label",
  display: "swap",
  weight: ["400", "500"],
});

const title = `${siteConfig.name} — ${siteConfig.tagline}`;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  keywords: [
    "CMS developer",
    "WordPress developer",
    "Shopify developer",
    "Webflow developer",
    "Figma to WordPress",
    "Figma to Shopify",
    "Figma to Webflow",
    "Elementor Pro",
    "Shopify Liquid",
    "theme customization",
    "website redesign",
    "conversion focused websites",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    ...(siteUrl ? { url: siteUrl } : {}),
    siteName: siteConfig.name,
    title,
    description: siteConfig.description,
    locale: "en_US",
    images: [
      {
        url: "/profile/bia-z.webp",
        width: 888,
        height: 1184,
        alt: `${siteConfig.name} — ${siteConfig.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteConfig.description,
    images: ["/profile/bia-z.webp"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/favicon.svg" }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3f0e9" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0b" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/**
 * Person, not Organization. This is one freelancer: claiming an organisation
 * in structured data would be a straightforward misrepresentation to search
 * engines. No address, registration or contact data — none is published, and
 * `url`/`image` appear only once a real origin is configured.
 */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: me.name,
  ...(siteUrl
    ? {
        url: siteUrl,
        image: new URL("/profile/bia-z.webp", siteUrl).toString(),
      }
    : {}),
  jobTitle: me.role,
  description: siteConfig.description,
  knowsAbout: [
    "WordPress Development",
    "Shopify Development",
    "Webflow Development",
    "Content Management Systems",
    "Theme Customization",
    "Figma to CMS",
    "E-commerce",
    "Conversion Rate Optimisation",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${instrument.variable} ${monoLabel.variable} ${hand.variable}`}
    >
      <body className="grain">
        <a className="skip-link t-label" href="#main">
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <Analytics />
      </body>
    </html>
  );
}
