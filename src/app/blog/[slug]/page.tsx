import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Newsletter from "@/components/ui/Newsletter";
import { renderMarkdown } from "@/lib/markdown";
import { getPostBySlug, getRelatedPosts } from "@/lib/supabase";
import { buildAbsoluteUrl, SITE_NAME } from "@/lib/site";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

async function loadPost(slug: string) {
  try {
    return await getPostBySlug(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>;
  }
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await loadPost(slug);

  if (!post) {
    return {
      title: "Artículo no encontrado",
    };
  }

  const canonicalUrl = buildAbsoluteUrl(`/blog/${post.slug}`);

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await loadPost(slug);

  if (!article) {
    notFound();
  }

  const relatedPosts = article.category_id
    ? await getRelatedPosts(article.slug, article.category_id, article.locale, 3).catch(() => [])
    : [];

  const formattedDate = new Date(article.published_at ?? article.created_at).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const articleUrl = buildAbsoluteUrl(`/blog/${article.slug}`);
  const authorName = article.authors?.name ?? SITE_NAME;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Person",
      name: SITE_NAME,
    },
    datePublished: article.published_at ?? article.created_at,
    dateModified: article.updated_at,
    inLanguage: article.locale === "en" ? "en-US" : "es-ES",
    mainEntityOfPage: articleUrl,
    url: articleUrl,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className={styles.articleHeader}>
        {article.categories?.slug ? (
          <Link href={`/category/${article.categories.slug}`} className="category-label">
            {article.categories.name_es}
          </Link>
        ) : (
          <span className="category-label">{article.categories?.name_es ?? "Artículo"}</span>
        )}
        <h1 className={styles.title}>{article.title}</h1>
        <div className={styles.meta}>
          <div className={styles.authorInfo}>
            <div className={styles.avatarPlaceholder} />
            <span className={styles.authorName}>{authorName}</span>
          </div>
          <time>{formattedDate}</time>
          {article.reading_time ? <span>{article.reading_time} min de lectura</span> : null}
        </div>
      </section>

      <div className={styles.featuredImage}>
        <div className={styles.imagePlaceholder}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        </div>
      </div>

      <article className={styles.articleBody}>
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(article.content) }}
        />
      </article>

      {article.tags.length ? (
        <div className={styles.tags}>
          {article.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <section className={styles.authorCard}>
        <div className={styles.avatarLarge} />
        <div>
          <h4 className={styles.authorCardName}>{authorName}</h4>
          <p className={styles.authorBio}>
            {article.authors?.bio_es ??
              "Fundador y editor. Escribe sobre inteligencia artificial, negocio y construcción de productos desde Latinoamérica."}
          </p>
        </div>
      </section>

      {relatedPosts.length ? (
        <section className={styles.related}>
          <h2 className={styles.relatedTitle}>Artículos relacionados</h2>
          <div className={styles.relatedGrid}>
            {relatedPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className={styles.relatedCard}>
                <div className={styles.relatedImagePlaceholder} />
                <span className="category-label">{post.categories?.name_es ?? "Artículo"}</span>
                <h3 className={styles.relatedHeadline}>{post.title}</h3>
                <div className={styles.relatedMeta}>
                  <time>
                    {new Date(post.published_at ?? post.created_at).toLocaleDateString("es-ES", {
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                  {post.reading_time ? <span>· {post.reading_time} min</span> : null}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <Newsletter />
    </>
  );
}
