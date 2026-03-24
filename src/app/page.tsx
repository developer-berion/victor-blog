import type { Metadata } from "next";
import ArticleCard from "@/components/blog/ArticleCard";
import Newsletter from "@/components/ui/Newsletter";
import { getPosts, type Post } from "@/lib/supabase";
import { SITE_DESCRIPTION, SITE_NAME, buildAbsoluteUrl } from "@/lib/site";
import { getPostCoverImageEditor, getPostCoverImageUrl } from "@/lib/social-sharing";
import { getServerLocale } from "@/lib/server-locale";
import styles from "./page.module.css";

type CardPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: number | null;
  coverImage: string | null;
  coverImageEditor: ReturnType<typeof getPostCoverImageEditor>;
};

const copy = {
  es: {
    title: `Lee, infórmate y aprende | ${SITE_NAME}`,
    description: SITE_DESCRIPTION,
    heroTitle: 'Lee, infórmate y aprende',
    latestEyebrow: 'Últimas publicaciones',
    latestTitle: 'Artículos recientes',
  },
  en: {
    title: `Read, learn, and grow | ${SITE_NAME}`,
    description: 'A practical editorial blog about AI, business decisions, and the LATAM context.',
    heroTitle: 'Read, learn, and grow',
    latestEyebrow: 'Latest posts',
    latestTitle: 'Recent articles',
  },
} as const;

function mapPostToCard(post: Post, locale: 'es' | 'en'): CardPost {
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: locale === 'en' ? post.categories?.name_en ?? post.categories?.name_es ?? 'AI for Business' : post.categories?.name_es ?? post.categories?.name_en ?? 'IA para Empresas',
    date: post.published_at ?? post.created_at,
    readingTime: post.reading_time,
    coverImage: getPostCoverImageUrl(post),
    coverImageEditor: getPostCoverImageEditor(post),
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const pageCopy = copy[locale];

  return {
    title: pageCopy.title,
    description: pageCopy.description,
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      title: pageCopy.title,
      description: pageCopy.description,
      url: buildAbsoluteUrl("/"),
      locale: locale === 'en' ? 'en_US' : 'es_LA',
      alternateLocale: locale === 'en' ? 'es_LA' : 'en_US',
    },
    twitter: {
      card: "summary_large_image",
      title: pageCopy.title,
      description: pageCopy.description,
    },
  };
}

export default async function HomePage() {
  const locale = await getServerLocale();
  const pageCopy = copy[locale];
  let cards: CardPost[] = [];

  try {
    const dbPosts = await getPosts(locale, 6);

    if (dbPosts.length > 0) {
      cards = dbPosts.map((post) => mapPostToCard(post, locale));
    }
  } catch (error) {
    console.error("Home page content query failed:", error);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: buildAbsoluteUrl("/"),
    description: pageCopy.description,
    inLanguage: locale === 'en' ? 'en-US' : 'es-ES',
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{pageCopy.heroTitle}</h1>
        </div>
      </section>

      <section className={styles.articles}>
        <div className={styles.articlesHeader}>
          <span className="category-label">{pageCopy.latestEyebrow}</span>
          <h2 className={styles.sectionTitle}>{pageCopy.latestTitle}</h2>
        </div>
        {cards.length > 0 ? (
          <div className={styles.grid}>
            {cards.map((post, i) => (
              <ArticleCard
                key={post.slug}
                slug={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                category={post.category}
                date={post.date}
                readingTime={post.readingTime}
                coverImage={post.coverImage}
                coverImageEditor={post.coverImageEditor}
                index={i}
                locale={locale}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p className={styles.emptyTitle}>
              {locale === 'en'
                ? 'No real posts are published yet.'
                : 'Todavía no hay publicaciones reales.'}
            </p>
            <p className={styles.emptyText}>
              {locale === 'en'
                ? 'Check back soon or visit the about page.'
                : 'Vuelve pronto o visita la página de autor.'}
            </p>
          </div>
        )}
      </section>

      <Newsletter />
    </>
  );
}
