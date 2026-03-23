import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/blog/ArticleCard";
import Newsletter from "@/components/ui/Newsletter";
import { getCategories, getPostsByCategory } from "@/lib/supabase";
import { buildAbsoluteUrl } from "@/lib/site";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

async function loadCategory(slug: string) {
  const categories = await getCategories();
  return categories.find((category) => category.slug === slug) ?? null;
}

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>;
  }
): Promise<Metadata> {
  const { slug } = await props.params;
  const category = await loadCategory(slug);

  if (!category) {
    return { title: "Categoría no encontrada" };
  }

  return {
    title: category.name_es,
    description: `Artículos publicados en ${category.name_es}.`,
    alternates: {
      canonical: `/category/${category.slug}`,
    },
    openGraph: {
      type: "website",
      title: category.name_es,
      description: `Artículos publicados en ${category.name_es}.`,
      url: buildAbsoluteUrl(`/category/${category.slug}`),
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await loadCategory(slug);

  if (!category) {
    notFound();
  }

  const posts = await getPostsByCategory(slug, "es").catch(() => []);

  return (
    <>
      <section className={styles.hero}>
        <span className="category-label">{category.name_es}</span>
        <h1 className={styles.title}>{category.name_es}</h1>
        <p className={styles.description}>
          {category.name_es === "IA para Empresas"
            ? "Ideas, análisis y experiencias aplicadas a negocios que quieren usar IA con sensatez."
            : `Artículos y reflexiones publicados dentro de ${category.name_es.toLowerCase()}.`}
        </p>
        <div className={styles.heroMeta}>
          <span>{posts.length} artículo{posts.length === 1 ? "" : "s"}</span>
          <Link href="/" className={styles.backLink}>
            Volver al inicio
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
                category={category.name_es}
                date={post.published_at ?? post.created_at}
                readingTime={post.reading_time}
                coverImage={post.cover_image_url}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <h2>Aún no hay artículos publicados aquí.</h2>
            <p>Cuando publiques contenido en Supabase, aparecerá automáticamente en esta categoría.</p>
          </div>
        )}
      </section>

      <Newsletter />
    </>
  );
}
