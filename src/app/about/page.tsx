import type { Metadata } from "next";
import { SITE_DESCRIPTION, SITE_NAME, buildAbsoluteUrl } from "@/lib/site";
import AboutContent from "./AboutContent";

export const metadata: Metadata = {
  title: "Acerca de Victor Garcia | IA para empresas, negocio y LATAM",
  description:
    "Victor Garcia escribe sobre inteligencia artificial para empresas, producto, operaciones, negocio y contexto LATAM con una mirada práctica y editorial.",
  keywords: [
    "Victor Garcia",
    "inteligencia artificial",
    "IA para empresas",
    "negocios",
    "Latinoamerica",
    "producto",
    "operaciones",
  ],
  alternates: {
    canonical: "/about",
  },
  openGraph: {
    type: "profile",
    title: `Acerca de ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    url: buildAbsoluteUrl("/about"),
  },
};

export default function AboutPage() {
  return <AboutContent />;
}
