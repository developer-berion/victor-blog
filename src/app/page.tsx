import Link from "next/link";
import ArticleCard from "@/components/blog/ArticleCard";
import Newsletter from "@/components/ui/Newsletter";
import { getPosts, type Post } from "@/lib/supabase";
import styles from "./page.module.css";

type CardPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: number | null;
  coverImage: string | null;
};

const fallbackPosts: CardPost[] = [
  {
    slug: "como-la-ia-esta-transformando-la-cadena-de-suministro",
    title: "Cómo la IA está transformando la cadena de suministro en América Latina",
    excerpt:
      "Las empresas latinoamericanas están adoptando la inteligencia artificial para optimizar sus cadenas de suministro, reducir costos y mejorar la trazabilidad de productos.",
    category: "IA para Empresas",
    date: "2026-03-10",
    readingTime: 8,
    coverImage: null,
  },
  {
    slug: "openai-lanza-nuevo-modelo-empresa",
    title: "OpenAI lanza nuevo modelo enfocado en productividad empresarial",
    excerpt:
      "El nuevo modelo GPT-5 Enterprise promete reducir hasta un 40% el tiempo en tareas de análisis de datos para empresas medianas y grandes.",
    category: "Noticias",
    date: "2026-03-08",
    readingTime: 5,
    coverImage: null,
  },
  {
    slug: "ecosistema-startups-ia-venezuela",
    title: "El creciente ecosistema de startups de IA en Venezuela",
    excerpt:
      "A pesar de los desafíos económicos, Venezuela está viendo un surgimiento de startups enfocadas en inteligencia artificial aplicada a fintech y salud.",
    category: "LATAM",
    date: "2026-03-05",
    readingTime: 6,
    coverImage: null,
  },
  {
    slug: "automatizacion-empleos-mito-realidad",
    title: "Automatización y empleos: separando el mito de la realidad",
    excerpt:
      "Un análisis profundo sobre los verdaderos efectos de la automatización con IA en el mercado laboral latinoamericano.",
    category: "Opinión",
    date: "2026-03-03",
    readingTime: 10,
    coverImage: null,
  },
  {
    slug: "gemini-claude-gpt-comparativa",
    title: "Gemini vs Claude vs GPT: ¿Cuál es mejor para tu empresa?",
    excerpt:
      "Comparamos los tres principales modelos de IA generativa desde la perspectiva empresarial: costos, rendimiento y casos de uso reales.",
    category: "IA para Empresas",
    date: "2026-03-01",
    readingTime: 12,
    coverImage: null,
  },
  {
    slug: "regulacion-ia-latam-2026",
    title: "Regulación de la IA en LATAM: panorama 2026",
    excerpt:
      "Brasil, México y Colombia lideran los esfuerzos regulatorios en inteligencia artificial. ¿Qué significa esto para las empresas de la región?",
    category: "LATAM",
    date: "2026-02-28",
    readingTime: 7,
    coverImage: null,
  },
];

function mapPostToCard(post: Post): CardPost {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: post.categories?.name_es ?? post.categories?.name_en ?? "IA para Empresas",
    date: post.published_at ?? post.created_at,
    readingTime: post.reading_time,
    coverImage: post.cover_image_url,
  };
}

export default async function HomePage() {
  let cards = fallbackPosts;

  try {
    const dbPosts = await getPosts("es", 6);
    if (dbPosts.length > 0) {
      cards = dbPosts.map(mapPostToCard);
    }
  } catch (error) {
    console.error("Home page content query failed:", error);
  }

  const [featured, ...articles] = cards;

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <span className="category-label">{featured.category}</span>
            <h1 className={styles.heroTitle}>{featured.title}</h1>
            <p className={styles.heroExcerpt}>{featured.excerpt}</p>
            <div className={styles.heroMeta}>
              <time>
                {new Date(featured.date).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {featured.readingTime ? <span>· {featured.readingTime} min read</span> : null}
            </div>
            <Link href={`/blog/${featured.slug}`} className={styles.heroCta}>
              Leer artículo →
            </Link>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.heroImagePlaceholder}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.articles}>
        <div className={styles.articlesHeader}>
          <h2 className={styles.sectionTitle}>Últimos artículos</h2>
        </div>
        <div className={styles.grid}>
          {articles.map((post, i) => (
            <ArticleCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              excerpt={post.excerpt}
              category={post.category}
              date={post.date}
              readingTime={post.readingTime}
              coverImage={post.coverImage}
              index={i}
            />
          ))}
        </div>
      </section>

      <Newsletter />
    </>
  );
}
