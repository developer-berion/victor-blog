'use client';

import Link from 'next/link';
import { useLocale } from '@/components/i18n/LocaleProvider';
import styles from './Footer.module.css';

const copy = {
  es: {
    tagline: 'Inteligencia Artificial para empresas. Noticias, análisis e impacto en LATAM.',
    exploreTitle: 'Explorar',
    connectTitle: 'Redes',
    servicesTitle: 'Servicios profesionales',
    servicesText:
      'Para servicios profesionales, visita Berion Company o escríbeme a victor@berioncompany.com.',
    consultingText:
      'Consultorías independientes para empresas y personas, con foco en IA, estrategia y producto.',
    emailLabel: 'Correo',
    websiteLabel: 'Berion Company',
    copyright: 'Todos los derechos reservados.',
    links: {
      home: 'Inicio',
      about: 'Acerca',
      ai: 'IA & Empresas',
      news: 'Noticias',
      latam: 'LATAM',
      opinion: 'Opinión',
    },
    socials: [
      { label: 'X', href: 'https://x.com/VictorGA24' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/victor-garcia-ve/' },
      { label: 'Instagram', href: 'https://www.instagram.com/v.garcia.a?igsh=MXFsNHQ1b2s4MjU1OA==' },
      { label: 'YouTube', href: 'https://www.youtube.com/@BerionCompany' },
      { label: 'Berion Company', href: 'https://berioncompany.com/' },
    ],
  },
  en: {
    tagline: 'Artificial intelligence for business. News, analysis, and LATAM impact.',
    exploreTitle: 'Explore',
    connectTitle: 'Social',
    servicesTitle: 'Professional services',
    servicesText:
      'For professional services, visit Berion Company or write to me at victor@berioncompany.com.',
    consultingText:
      'Independent consulting for companies and individuals, focused on AI, strategy, and product.',
    emailLabel: 'Email',
    websiteLabel: 'Berion Company',
    copyright: 'All rights reserved.',
    links: {
      home: 'Home',
      about: 'About',
      ai: 'AI for Business',
      news: 'News',
      latam: 'LATAM',
      opinion: 'Opinion',
    },
    socials: [
      { label: 'X', href: 'https://x.com/VictorGA24' },
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/victor-garcia-ve/' },
      { label: 'Instagram', href: 'https://www.instagram.com/v.garcia.a?igsh=MXFsNHQ1b2s4MjU1OA==' },
      { label: 'YouTube', href: 'https://www.youtube.com/@BerionCompany' },
      { label: 'Berion Company', href: 'https://berioncompany.com/' },
    ],
  },
} as const;

export default function Footer() {
  const { locale } = useLocale();
  const content = copy[locale];

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Link href="/" className={styles.logo}>
              Victor Garcia
            </Link>
            <p className={styles.tagline}>{content.tagline}</p>
          </div>

          <section className={styles.servicesCard} aria-label={content.servicesTitle}>
            <p className={styles.cardKicker}>{content.servicesTitle}</p>
            <p className={styles.servicesText}>{content.servicesText}</p>
            <p className={styles.consultingText}>{content.consultingText}</p>
            <div className={styles.servicesActions}>
              <a href="mailto:victor@berioncompany.com" className={styles.emailLink}>
                {content.emailLabel}: victor@berioncompany.com
              </a>
              <a href="https://berioncompany.com/" target="_blank" rel="noopener noreferrer" className={styles.websiteLink}>
                {content.websiteLabel}
              </a>
            </div>
          </section>
        </div>

        <div className={styles.middle}>
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>{content.exploreTitle}</h4>
            <div className={styles.linkList}>
              <Link href="/">{content.links.home}</Link>
              <Link href="/category/ai-empresas">{content.links.ai}</Link>
              <Link href="/category/noticias">{content.links.news}</Link>
              <Link href="/category/latam">{content.links.latam}</Link>
              <Link href="/category/opinion">{content.links.opinion}</Link>
              <Link href="/about">{content.links.about}</Link>
            </div>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>{content.connectTitle}</h4>
            <div className={styles.socialRow}>
              {content.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                >
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Victor Garcia. {content.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
