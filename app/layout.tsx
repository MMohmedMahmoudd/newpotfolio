import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import Navigation from "@/components/navigation";
import CommandPalette from "@/components/command-palette";
import Footer from "@/components/footer";
import BackgroundCanvas from "@/components/background/background-canvas";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://portfolio.example.com";
const SITE_NAME = "Mohamed Mahmoud — Senior Full-Stack Engineer";
const DESCRIPTION =
  "Senior full-stack engineer and freelancer building premium SaaS platforms, distributed systems, and AI-powered products. 7+ years shipping production-grade software.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s · Mohamed Mahmoud",
  },
  description: DESCRIPTION,
  applicationName: "Mohamed Mahmoud Portfolio",
  keywords: [
    "senior software engineer",
    "full-stack developer",
    "freelance engineer",
    "SaaS architect",
    "system design",
    "Next.js",
    "TypeScript",
    "React",
    "Node.js",
    "cloud infrastructure",
    "AI engineering",
    "performance optimization",
  ],
  authors: [{ name: "Mohamed Mahmoud", url: SITE_URL }],
  creator: "Mohamed Mahmoud",
  publisher: "Mohamed Mahmoud",
  category: "technology",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Mohamed Mahmoud — Senior Full-Stack Engineer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: DESCRIPTION,
    images: ["/og-image.png"],
    creator: "mohmedmahmoud257@gmail.com",
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
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: "REPLACE_WITH_GOOGLE_SITE_VERIFICATION",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  colorScheme: "dark light",
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Mohamed Mahmoud",
  url: SITE_URL,
  jobTitle: "Senior Full-Stack Engineer",
  image: `${SITE_URL}/og-image.png`,
  description: DESCRIPTION,
  sameAs: [
    "https://github.com/mohmedmahmoud257@gmail.com",
    "https://linkedin.com/in/mohmedmahmoud257@gmail.com",
    "https://x.com/mohmedmahmoud257@gmail.com",
  ],
  knowsAbout: [
    "System Design",
    "Distributed Systems",
    "Cloud Infrastructure",
    "React",
    "Next.js",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "Kubernetes",
    "AI Engineering",
  ],
  worksFor: {
    "@type": "Organization",
    name: "Freelance",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "en-US",
  publisher: {
    "@type": "Person",
    name: "Mohamed Mahmoud",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${inter.variable} ${jetBrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased font-sans selection:bg-blue-500/30 selection:text-foreground">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <a
            href="#home"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-foreground focus:text-background"
          >
            Skip to content
          </a>
          <BackgroundCanvas />
          <Navigation />
          <CommandPalette />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
