'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import type { Locale } from '@/lib/locale';
import type { CoverImageEditor } from '@/lib/social-sharing';
import styles from './ArticleCard.module.css';

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: number | null;
  coverImage?: string | null;
  coverImageEditor?: CoverImageEditor | null;
  index?: number;
  locale?: Locale;
}

export default function ArticleCard({
  slug,
  title,
  excerpt,
  category,
  date,
  readingTime,
  coverImage,
  coverImageEditor,
  index = 0,
  locale = 'es',
}: ArticleCardProps) {
  const formattedDate = new Date(date).toLocaleDateString(locale === 'en' ? 'en-US' : 'es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link href={`/blog/${slug}`} className={styles.link}>
        <div className={styles.imageWrapper}>
          {coverImage ? (
            <Image
              src={coverImage}
              alt={title}
              fill
              unoptimized
              className={styles.image}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              style={
                coverImageEditor
                  ? {
                      transform: `translate(${coverImageEditor.offsetX}%, ${coverImageEditor.offsetY}%) scale(${coverImageEditor.zoom})`,
                      transformOrigin: 'center center',
                    }
                  : undefined
              }
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
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

        <div className={styles.content}>
          <span className="category-label">{category}</span>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.excerpt}>{excerpt}</p>
          <div className={styles.meta}>
            <time>{formattedDate}</time>
            {readingTime && <span>{readingTime} {locale === 'en' ? 'min read' : 'min de lectura'}</span>}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
