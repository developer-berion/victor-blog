'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import styles from './ArticleCard.module.css';

interface ArticleCardProps {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readingTime: number | null;
  coverImage?: string | null;
  index?: number;
}

export default function ArticleCard({
  slug,
  title,
  excerpt,
  category,
  date,
  readingTime,
  coverImage,
  index = 0,
}: ArticleCardProps) {
  const formattedDate = new Date(date).toLocaleDateString('es-ES', {
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
            <img src={coverImage} alt={title} className={styles.image} />
          ) : (
            <div className={styles.imagePlaceholder}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
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
            {readingTime && <span>{readingTime} min read</span>}
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
