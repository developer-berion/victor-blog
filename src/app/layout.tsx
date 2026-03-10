import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: {
    default: "Victor Garcia — Inteligencia Artificial para Empresas",
    template: "%s | Victor Garcia",
  },
  description:
    "Blog sobre Inteligencia Artificial enfocado en empresas, impacto en LATAM y Venezuela. Noticias, análisis y opinión sobre IA.",
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
    siteName: "Victor Garcia",
    title: "Victor Garcia — Inteligencia Artificial para Empresas",
    description:
      "Blog sobre IA enfocado en empresas, impacto en LATAM y Venezuela.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Victor Garcia",
    description:
      "Inteligencia Artificial para empresas. Noticias, análisis e impacto en LATAM.",
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
