import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShareBar from "@/components/blog/ShareBar";
import Newsletter from "@/components/ui/Newsletter";
import { renderMarkdown } from "@/lib/markdown";
import { getBlogTranslationPair } from "@/lib/blog-translations";
import { getPostBySlug, getRelatedPosts } from "@/lib/supabase";
import {
  getPostLinkedInCopy,
  getPostCoverImageEditor,
  getPostCoverImageUrl,
  getPostShareUrl,
  getPostBodyContent,
  getPostSocialCopy,
  getPostSocialImageUrl,
} from "@/lib/social-sharing";
import { buildAbsoluteUrl, SITE_NAME } from "@/lib/site";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const copy = {
  es: {
    continueTitle: 'Sigue explorando',
    continueIntro: 'Más lecturas de la misma línea editorial para profundizar el contexto.',
    readLabel: 'min de lectura',
    articleLabel: 'Artículo',
    defaultBio:
      'Fundador y editor. Escribe sobre inteligencia artificial, negocio y construcción de productos desde Latinoamérica.',
    sourcesTitle: 'Fuentes y lecturas',
  },
  en: {
    continueTitle: 'Keep exploring',
    continueIntro: 'More reads from the same editorial line to deepen the context.',
    readLabel: 'min read',
    articleLabel: 'Article',
    defaultBio:
      'Founder and editor. Writes about artificial intelligence, business, and product building from Latin America.',
    sourcesTitle: 'Sources and further reading',
  },
} as const;

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
      title: "Article not found",
    };
  }

  const contentCopy = copy[post.locale];
  const translation = getBlogTranslationPair(post.slug);
  const canonicalUrl = buildAbsoluteUrl(`/blog/${post.slug}`);
  const socialDescription = getPostSocialCopy(post);
  const socialImageSource = getPostSocialImageUrl(post);
  const imageUrl = socialImageSource ? buildAbsoluteUrl(socialImageSource) : null;
  const keywords = [
    post.title,
    post.categories?.name_es,
    post.categories?.name_en,
    ...post.tags,
    post.locale === 'en' ? 'artificial intelligence' : 'inteligencia artificial',
    'AI',
    post.locale === 'en' ? 'overconfidence' : 'sobreconfianza',
    post.locale === 'en' ? 'leadership' : 'liderazgo',
    'LATAM',
  ].filter((keyword): keyword is string => Boolean(keyword));

  return {
    title: post.title,
    description: socialDescription,
    keywords,
    alternates: {
      canonical: `/blog/${post.slug}`,
      languages: translation
        ? {
            'es-ES': buildAbsoluteUrl(`/blog/${translation.es}`),
            'en-US': buildAbsoluteUrl(`/blog/${translation.en}`),
          }
        : undefined,
    },
    authors: [{ name: post.authors?.name ?? SITE_NAME }],
    openGraph: {
      title: post.title,
      description: socialDescription,
      type: "article",
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: post.locale === 'en' ? 'en_US' : 'es_LA',
      alternateLocale: post.locale === 'en' ? 'es_LA' : 'en_US',
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
      publishedTime: post.published_at ?? post.created_at,
      modifiedTime: post.updated_at,
      section: post.locale === 'en' ? post.categories?.name_en : post.categories?.name_es,
      tags: post.tags,
      authors: [post.authors?.name ?? SITE_NAME],
    },
    twitter: {
      card: imageUrl ? "summary_large_image" : "summary",
      title: post.title,
      description: socialDescription,
      images: imageUrl ? [imageUrl] : undefined,
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

  const contentCopy = copy[article.locale];
  const relatedPosts = article.category_id
    ? await getRelatedPosts(article.slug, article.category_id, article.locale, 3).catch(() => [])
    : [];

  const formattedDate = new Date(article.published_at ?? article.created_at).toLocaleDateString(
    article.locale === 'en' ? 'en-US' : 'es-ES',
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
  const articleUrl = buildAbsoluteUrl(`/blog/${article.slug}`);
  const shortlink = getPostShareUrl(article);
  const socialCopy = getPostSocialCopy(article);
  const socialCopyLinkedIn = getPostLinkedInCopy(article);
  const authorName = article.authors?.name ?? SITE_NAME;
  const authorBio =
    article.locale === 'en'
      ? article.authors?.bio_en ?? contentCopy.defaultBio
      : article.authors?.bio_es ?? contentCopy.defaultBio;
  const coverSrc = getPostCoverImageUrl(article);
  const coverImageEditor = getPostCoverImageEditor(article);
  const imageUrl = coverSrc ? buildAbsoluteUrl(coverSrc) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: imageUrl ? [imageUrl] : undefined,
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
        <h1 className={styles.title}>{article.title}</h1>
        <p className={styles.lead}>{article.excerpt}</p>
        <div className={styles.meta}>
          <div className={styles.authorInfo}>
            <div className={styles.avatarPlaceholder} />
            <span className={styles.authorName}>{authorName}</span>
          </div>
          <time>{formattedDate}</time>
          {article.reading_time ? <span>{article.reading_time} {contentCopy.readLabel}</span> : null}
        </div>
      </section>

      <article className={styles.articleBody}>
        <div
          className="prose"
          dangerouslySetInnerHTML={{
            __html: renderMarkdown(getPostBodyContent(article.content)),
          }}
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

      <ShareBar
        locale={article.locale}
        shortlink={shortlink}
        socialCopy={socialCopy}
        socialCopyLinkedIn={socialCopyLinkedIn}
      />

      <section className={styles.authorCard}>
        <div className={styles.avatarLarge} />
        <div>
          <h2 className={styles.authorCardName}>{authorName}</h2>
          <p className={styles.authorBio}>{authorBio}</p>
        </div>
      </section>

      <div className={styles.featuredImage}>
        {imageUrl ? (
          <div className={styles.imageFrame}>
              <Image
              src={coverSrc ?? ''}
              alt={article.title}
              fill
              unoptimized
              className={styles.featuredImageMedia}
              sizes="(max-width: 900px) 100vw, 900px"
              priority
              style={
                coverImageEditor
                  ? {
                      transform: `translate(${coverImageEditor.offsetX}%, ${coverImageEditor.offsetY}%) scale(${coverImageEditor.zoom})`,
                      transformOrigin: 'center center',
                    }
                  : undefined
              }
            />
          </div>
        ) : (
          <div className={styles.imagePlaceholder}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}
      </div>

      {relatedPosts.length ? (
        <section className={styles.related}>
          <h2 className={styles.relatedTitle}>{contentCopy.continueTitle}</h2>
          <p className={styles.relatedIntro}>{contentCopy.continueIntro}</p>
          <div className={styles.relatedGrid}>
            {relatedPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.slug} className={styles.relatedCard}>
                <div className={styles.relatedImagePlaceholder} />
                <span className="category-label">
                  {article.locale === 'en' ? post.categories?.name_en ?? contentCopy.articleLabel : post.categories?.name_es ?? contentCopy.articleLabel}
                </span>
                <h3 className={styles.relatedHeadline}>{post.title}</h3>
                <div className={styles.relatedMeta}>
                  <time>
                    {new Date(post.published_at ?? post.created_at).toLocaleDateString(
                      article.locale === 'en' ? 'en-US' : 'es-ES',
                      {
                        month: "short",
                        day: "numeric",
                      },
                    )}
                  </time>
                  {post.reading_time ? <span>· {post.reading_time} {contentCopy.readLabel}</span> : null}
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
