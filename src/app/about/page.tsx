import type { Metadata } from "next";
import Newsletter from "@/components/ui/Newsletter";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Acerca",
  description:
    "Historia de Víctor García, su enfoque como solopreneur y la línea editorial del blog sobre IA, negocios y Latinoamérica.",
};

const pillars = [
  {
    title: "Sensatez antes que hype",
    text: "Escribir sobre IA sin vender humo. Qué funciona, qué no, qué cuesta y qué impacto real deja en una operación.",
  },
  {
    title: "Latinoamérica como contexto",
    text: "El mercado, los equipos y las restricciones de la región importan. No se puede importar una narrativa global sin adaptarla.",
  },
  {
    title: "Aprendizaje en público",
    text: "Este blog documenta proyectos, procesos, resultados y errores. La idea es construir criterio, no solo presencia.",
  },
];

const topics = [
  "IA para empresas",
  "Noticias y análisis",
  "Opinión",
  "Historias de implementación",
  "Procesos y resultados",
  "LATAM y mercado",
];

export default function AboutPage() {
  return (
    <>
      <section className={styles.hero}>
        <span className="category-label">Acerca</span>
        <h1 className={styles.title}>Un blog para contar lo que funciona de verdad</h1>
        <p className={styles.description}>
          Soy Víctor García y este espacio reúne mi recorrido como emprendedor, consultor y operador.
          Aquí escribo sobre inteligencia artificial, negocios, procesos, implementaciones y las lecciones
          que deja construir en Latinoamérica.
        </p>
      </section>

      <section className={styles.grid}>
        {pillars.map((pillar) => (
          <article key={pillar.title} className={styles.card}>
            <h2>{pillar.title}</h2>
            <p>{pillar.text}</p>
          </article>
        ))}
      </section>

      <section className={styles.story}>
        <div>
          <h2 className={styles.sectionTitle}>Qué vas a encontrar aquí</h2>
          <p className={styles.bodyText}>
            El blog mezcla narrativa personal con lectura estratégica del mercado. No solo hay artículos
            de opinión; también habrá aprendizajes de proyectos, implementación de herramientas, decisiones
            de producto, resultados medibles y reflexiones sobre cómo se está adoptando la IA en la región.
          </p>
        </div>

        <div className={styles.listCard}>
          <h3 className={styles.listTitle}>Tópicos principales</h3>
          <ul className={styles.list}>
            {topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.quoteBlock}>
        <p>
          La idea no es perseguir cada tendencia. Es construir criterio, registrar el proceso y dejar una
          bitácora útil para quienes estén resolviendo problemas reales con IA.
        </p>
      </section>

      <Newsletter />
    </>
  );
}
