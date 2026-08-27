import type { Metadata, Viewport } from "next";
import {
  Inter_Tight,
  Instrument_Serif,
  JetBrains_Mono,
  Caveat,
} from "next/font/google";
import { siteConfig, me } from "@/lib/site";
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
  metadataBase: new URL(siteConfig.url),
  title: {
    default: title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  keywords: [
    "freelance web designer",
    "freelance web developer",
    "independent designer developer",
    "website design",
    "UI UX design",
    "creative development",
    "web application development",
    "website redesign",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title,
    description: siteConfig.description,
    locale: "en_US",
    images: [
      {
        url: "/portfolio/nonnis-desktop.webp",
        width: 2000,
        height: 1250,
        alt: `${siteConfig.name} — selected work`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteConfig.description,
    images: ["/portfolio/nonnis-desktop.webp"],
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
 * engines. No address or registration data — none exists to state.
 */
const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: me.name,
  url: siteConfig.url,
  email: siteConfig.email,
  jobTitle: me.role,
  description: siteConfig.description,
  knowsAbout: [
    "Website Design",
    "Frontend Development",
    "UI/UX Design",
    "Creative Development",
    "Web Applications",
    "E-commerce",
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
