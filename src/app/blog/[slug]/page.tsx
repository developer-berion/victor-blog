import Link from "next/link";
import Newsletter from "@/components/ui/Newsletter";
import styles from "./page.module.css";

/* Sample article data — will be replaced by Supabase query */
const article = {
  slug: "como-la-ia-esta-transformando-la-cadena-de-suministro",
  title: "Cómo la IA está transformando la cadena de suministro en América Latina",
  excerpt: "Las empresas latinoamericanas están adoptando la inteligencia artificial para optimizar sus cadenas de suministro.",
  category: "AI & BUSINESS",
  categorySlug: "ai-empresas",
  author: "Victor Garcia",
  date: "2026-03-10",
  readingTime: 8,
  tags: ["Supply Chain", "LATAM", "Automatización"],
  content: `
La inteligencia artificial está revolucionando la forma en que las empresas latinoamericanas gestionan sus cadenas de suministro. Desde la predicción de demanda hasta la optimización de rutas logísticas, la IA se está convirtiendo en una herramienta fundamental para la competitividad empresarial.

## El panorama actual

En los últimos dos años, hemos visto un incremento significativo en la adopción de soluciones de IA en la cadena de suministro. Según un estudio reciente, **más del 60% de las empresas medianas y grandes en LATAM** ya están implementando o evaluando soluciones de IA para sus operaciones logísticas.

> "La inteligencia artificial no es el futuro de la cadena de suministro, es el presente. Las empresas que no se adapten quedarán rezagadas en un mercado cada vez más competitivo."

Los principales casos de uso incluyen:

- **Predicción de demanda**: Algoritmos de machine learning que analizan datos históricos, estacionalidad y variables externas para predecir la demanda con mayor precisión.
- **Optimización de inventario**: Sistemas que determinan automáticamente los niveles óptimos de inventario, reduciendo costos de almacenamiento y evitando quiebres de stock.
- **Planificación de rutas**: IA que optimiza las rutas de distribución considerando tráfico, clima y restricciones operativas.

## Desafíos en la implementación

Sin embargo, la implementación no está exenta de desafíos. La calidad de los datos sigue siendo el principal obstáculo. Muchas empresas latinoamericanas aún operan con sistemas legacy que dificultan la integración de soluciones modernas de IA.

El costo de implementación también es un factor relevante. Aunque existen soluciones \`cloud-native\` que reducen la barrera de entrada, la inversión inicial en capacitación y adaptación de procesos puede ser significativa para empresas medianas.

## El camino hacia adelante

La tendencia es clara: la IA en la cadena de suministro pasará de ser una ventaja competitiva a ser un requisito básico. Las empresas que comiencen su transformación digital ahora estarán mejor posicionadas para competir en el mercado global.

Para las empresas latinoamericanas, la oportunidad es particularmente interesante. La región cuenta con un talento técnico creciente y costos operativos que permiten una adopción más ágil de estas tecnologías.
  `,
};

const relatedPosts = [
  {
    slug: "gemini-claude-gpt-comparativa",
    title: "Gemini vs Claude vs GPT: ¿Cuál es mejor para tu empresa?",
    category: "AI & BUSINESS",
    date: "2026-03-01",
    readingTime: 12,
  },
  {
    slug: "regulacion-ia-latam-2026",
    title: "Regulación de la IA en LATAM: panorama 2026",
    category: "LATAM",
    date: "2026-02-28",
    readingTime: 7,
  },
  {
    slug: "automatizacion-empleos-mito-realidad",
    title: "Automatización y empleos: separando el mito de la realidad",
    category: "OPINIÓN",
    date: "2026-03-03",
    readingTime: 10,
  },
];

function renderMarkdown(content: string) {
  /* Simple markdown-to-HTML for demo purposes */
  let html = content
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^> "?(.+)"?$/gm, '<blockquote><p>$1</p></blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>');

  /* Wrap consecutive <li> in <ul> */
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

  /* Wrap remaining text in paragraphs */
  const blocks = html.split('\n\n');
  html = blocks
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return '';
      if (
        trimmed.startsWith('<h') ||
        trimmed.startsWith('<ul') ||
        trimmed.startsWith('<blockquote')
      )
        return trimmed;
      return `<p>${trimmed}</p>`;
    })
    .join('\n');

  return html;
}

export default function ArticlePage() {
  const formattedDate = new Date(article.date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {/* Article Header */}
      <section className={styles.articleHeader}>
        <span className="category-label">{article.category}</span>
        <h1 className={styles.title}>{article.title}</h1>
        <div className={styles.meta}>
          <div className={styles.authorInfo}>
            <div className={styles.avatarPlaceholder} />
            <span className={styles.authorName}>{article.author}</span>
          </div>
          <time>{formattedDate}</time>
          <span>{article.readingTime} min read</span>
        </div>
      </section>

      {/* Featured Image */}
      <div className={styles.featuredImage}>
        <div className={styles.imagePlaceholder}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </div>
      </div>

      {/* Article Body */}
      <article className={styles.articleBody}>
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
        />
      </article>

      {/* Tags */}
      <div className={styles.tags}>
        {article.tags.map((tag) => (
          <span key={tag} className={styles.tag}>{tag}</span>
        ))}
      </div>

      {/* Author Card */}
      <section className={styles.authorCard}>
        <div className={styles.avatarLarge} />
        <div>
          <h4 className={styles.authorCardName}>{article.author}</h4>
          <p className={styles.authorBio}>
            Fundador y editor. Apasionado por la inteligencia artificial y su impacto en las empresas latinoamericanas.
          </p>
        </div>
      </section>

      {/* Related Articles */}
      <section className={styles.related}>
        <h2 className={styles.relatedTitle}>Artículos relacionados</h2>
        <div className={styles.relatedGrid}>
          {relatedPosts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.slug} className={styles.relatedCard}>
              <div className={styles.relatedImagePlaceholder} />
              <span className="category-label">{post.category}</span>
              <h3 className={styles.relatedHeadline}>{post.title}</h3>
              <div className={styles.relatedMeta}>
                <time>{new Date(post.date).toLocaleDateString("es-ES", { month: "short", day: "numeric" })}</time>
                <span>· {post.readingTime} min</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Newsletter />
    </>
  );
}
