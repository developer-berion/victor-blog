import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Víctor García — IA, negocios y LATAM",
    template: "%s | Víctor García",
  },
  description:
    "Blog sobre inteligencia artificial enfocado en empresas, impacto en LATAM y Venezuela. Noticias, análisis y opinión desde la experiencia de un solopreneur.",
  keywords: [
    "inteligencia artificial",
    "AI",
    "empresas",
    "LATAM",
    "Venezuela",
    "noticias IA",
    "artificial intelligence",
    "business",
  ],
  authors: [{ name: "Victor Garcia" }],
  openGraph: {
    type: "website",
    locale: "es_LA",
    alternateLocale: "en_US",
    siteName: "Víctor García",
    title: "Víctor García — IA, negocios y LATAM",
    description: "Blog sobre IA enfocado en empresas, impacto en LATAM y Venezuela.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Víctor García",
    description: "Inteligencia artificial para empresas. Noticias, análisis e impacto en LATAM.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
