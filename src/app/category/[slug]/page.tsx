import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/blog/ArticleCard";
import Newsletter from "@/components/ui/Newsletter";
import { getCategories, getPostsByCategory } from "@/lib/supabase";
import { buildAbsoluteUrl } from "@/lib/site";
import { getPostCoverImageUrl } from "@/lib/social-sharing";
import { getServerLocale } from "@/lib/server-locale";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const copy = {
  es: {
    home: 'Inicio',
    line: 'Conocer la línea editorial',
    articles: 'artículo',
    articlesPlural: 'artículos',
    otherCategories: 'Otras categorías',
    emptyTitle: 'Aún no hay artículos publicados aquí.',
    emptyBody: 'Cuando publiques contenido en Supabase, aparecerá automáticamente en esta categoría.',
    aiDescription: 'Ideas, análisis y experiencias aplicadas a negocios que quieren usar IA con sensatez.',
    genericDescription: (name: string) => `Artículos y reflexiones publicados dentro de ${name.toLowerCase()}.`,
  },
  en: {
    home: 'Home',
    line: 'See the editorial line',
    articles: 'article',
    articlesPlural: 'articles',
    otherCategories: 'Other categories',
    emptyTitle: 'There are no published articles here yet.',
    emptyBody: 'When you publish content in Supabase, it will appear automatically in this category.',
    aiDescription: 'Ideas, analysis, and practical takes for businesses that want to use AI sensibly.',
    genericDescription: (name: string) => `Articles and reflections published under ${name.toLowerCase()}.`,
  },
} as const;

async function loadCategory(slug: string) {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>;
  }
): Promise<Metadata> {
  const locale = await getServerLocale();
  const { slug } = await props.params;
  const category = await loadCategory(slug);

  if (!category) {
    return { title: locale === 'en' ? 'Category not found' : 'Categoría no encontrada' };
  }

  const categoryName = locale === 'en' ? category.name_en : category.name_es;
  const description =
    slug === 'ai-empresas'
      ? copy[locale].aiDescription
      : copy[locale].genericDescription(categoryName);

  return {
    title: categoryName,
    description,
    alternates: {
      canonical: `/category/${category.slug}`,
    },
    openGraph: {
      type: "website",
      title: categoryName,
      description,
      url: buildAbsoluteUrl(`/category/${category.slug}`),
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const locale = await getServerLocale();
  const pageCopy = copy[locale];
  const { slug } = await params;
  const category = await loadCategory(slug);

  if (!category) {
    notFound();
  }

  const [posts, categories] = await Promise.all([
    getPostsByCategory(slug, locale).catch(() => []),
    getCategories().catch(() => []),
  ]);

  const relatedCategories = categories.filter((item) => item.slug !== slug).slice(0, 3);
  const categoryName = locale === 'en' ? category.name_en : category.name_es;
  const categoryDescription =
    slug === "ai-empresas" ? pageCopy.aiDescription : pageCopy.genericDescription(categoryName);

  return (
    <>
      <section className={styles.hero}>
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
          <Link href="/">{pageCopy.home}</Link>
          <span>/</span>
          <span>{categoryName}</span>
        </nav>
        <span className="category-label">{categoryName}</span>
        <h1 className={styles.title}>{categoryName}</h1>
        <p className={styles.description}>{categoryDescription}</p>
        <div className={styles.heroMeta}>
          <span>
            {posts.length} {posts.length === 1 ? pageCopy.articles : pageCopy.articlesPlural}
          </span>
          <Link href="/about" className={styles.backLink}>
            {pageCopy.line}
          </Link>
        </div>
      </section>

      <section className={styles.articles}>
        {posts.length ? (
          <div className={styles.grid}>
            {posts.map((post, index) => (
              <ArticleCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                category={categoryName}
                date={post.published_at ?? post.created_at}
                readingTime={post.reading_time}
                coverImage={getPostCoverImageUrl(post)}
                index={index}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h2>{pageCopy.emptyTitle}</h2>
            <p>{pageCopy.emptyBody}</p>
          </div>
        )}
      </section>

      {relatedCategories.length ? (
        <section className={styles.relatedTopics}>
          <h2 className={styles.relatedTitle}>{pageCopy.otherCategories}</h2>
          <div className={styles.topicGrid}>
            {relatedCategories.map((item) => (
              <Link key={item.slug} href={`/category/${item.slug}`} className={styles.topicCard}>
                <h3>{locale === 'en' ? item.name_en : item.name_es}</h3>
                <p>
                  {item.slug === "ai-empresas"
                    ? locale === 'en'
                      ? "Cases and decisions for businesses applying AI."
                      : "Casos y decisiones para negocios que aplican IA."
                    : item.slug === "noticias"
                      ? locale === 'en'
                        ? "Editorial reading of what changes in the market."
                        : "Lectura editorial de lo que cambia en el mercado."
                      : item.slug === "latam"
                        ? locale === 'en'
                          ? "Regional context and adoption opportunities."
                          : "Contexto regional y oportunidades de adopción."
                        : locale === 'en'
                          ? "Opinion and editorial judgment for navigating the tech conversation."
                          : "Opinión y criterio para navegar la conversación tecnológica."}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <Newsletter />
    </>
  );
}
