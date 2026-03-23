import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import { SITE_DESCRIPTION, SITE_NAME, getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} — IA, negocios y LATAM`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "inteligencia artificial",
    "IA para empresas",
    "empresas",
    "LATAM",
    "Venezuela",
    "noticias IA",
    "consultoría",
    "solopreneur",
  ],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "es_LA",
    alternateLocale: "en_US",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — IA, negocios y LATAM`,
    description: SITE_DESCRIPTION,
    url: getSiteUrl(),
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
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
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
