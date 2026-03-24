'use client';

import Link from 'next/link';
import { useLocale } from '@/components/i18n/LocaleProvider';
import styles from './Footer.module.css';

const copy = {
  es: {
    tagline: 'Inteligencia Artificial para empresas. Noticias, análisis e impacto en LATAM.',
    categoriesTitle: 'Categorías',
    blogTitle: 'Blog',
    socialTitle: 'Social',
      links: {
        home: 'Inicio',
        about: 'Acerca',
        ai: 'IA & Empresas',
        news: 'Noticias',
        latam: 'LATAM',
        opinion: 'Opinión',
    },
    copyright: 'Todos los derechos reservados.',
  },
  en: {
    tagline: 'Artificial intelligence for business. News, analysis, and LATAM impact.',
    categoriesTitle: 'Categories',
    blogTitle: 'Blog',
    socialTitle: 'Social',
      links: {
        home: 'Home',
        about: 'About',
        ai: 'AI for Business',
        news: 'News',
        latam: 'LATAM',
        opinion: 'Opinion',
    },
    copyright: 'All rights reserved.',
  },
} as const;

export default function Footer() {
  const { locale } = useLocale();
  const content = copy[locale];

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>Victor Garcia</Link>
          <p className={styles.tagline}>{content.tagline}</p>
        </div>

        <div className={styles.links}>
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>{content.categoriesTitle}</h4>
            <Link href="/category/ai-empresas">{content.links.ai}</Link>
            <Link href="/category/noticias">{content.links.news}</Link>
            <Link href="/category/latam">{content.links.latam}</Link>
            <Link href="/category/opinion">{content.links.opinion}</Link>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>{content.blogTitle}</h4>
            <Link href="/">{content.links.home}</Link>
            <Link href="/about">{content.links.about}</Link>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>{content.socialTitle}</h4>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              Twitter / X
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Victor Garcia. {content.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
