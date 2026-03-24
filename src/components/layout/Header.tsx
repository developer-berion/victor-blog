'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLocale } from '@/components/i18n/LocaleProvider';
import styles from './Header.module.css';

const categories = [
  { slug: 'ai-empresas', label: { es: 'IA & Empresas', en: 'AI & Business' } },
  { slug: 'noticias', label: { es: 'Noticias', en: 'News' } },
  { slug: 'latam', label: { es: 'LATAM', en: 'LATAM' } },
  { slug: 'opinion', label: { es: 'Opinión', en: 'Opinion' } },
];

export default function Header() {
  const { locale, toggleLocale } = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') {
      return 'light';
    }

    const saved = window.localStorage.getItem('theme') as 'light' | 'dark' | null;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    return saved || systemTheme;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
  };

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <Link href="/" className={styles.logo}>
            <Image
              src="/brand/victor-garcia-blog-logo-transparent.svg"
              alt="Victor Garcia Blog logo"
              width={28}
              height={28}
              className={styles.logoMark}
              priority
            />
            <span className={styles.logoText}>Victor Garcia</span>
          </Link>

          <nav className={styles.nav}>
            <Link href="/" className={styles.navLink}>Blog</Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className={styles.navLink}
              >
                {cat.label[locale]}
              </Link>
            ))}
            <Link href="/about" className={styles.navLink}>
              {locale === 'es' ? 'Acerca' : 'About'}
            </Link>
          </nav>

          <div className={styles.actions}>
            <button
              onClick={toggleTheme}
              className={styles.iconBtn}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              )}
            </button>

            <button
              onClick={toggleLocale}
              className={styles.localToggle}
              aria-label="Toggle language"
              aria-pressed={locale === 'en'}
            >
              <span className={`${styles.localePill} ${locale === 'es' ? styles.localeActive : ''}`}>
                ES
              </span>
              <span className={styles.divider}>|</span>
              <span className={`${styles.localePill} ${locale === 'en' ? styles.localeActive : ''}`}>
                EN
              </span>
            </button>

            <button
              className={styles.hamburger}
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`${styles.bar} ${menuOpen ? styles.open : ''}`} />
              <span className={`${styles.bar} ${menuOpen ? styles.open : ''}`} />
              <span className={`${styles.bar} ${menuOpen ? styles.open : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <div className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        <nav className={styles.mobileNav}>
          <Link href="/" onClick={() => setMenuOpen(false)} className={styles.mobileLink}>Blog</Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              onClick={() => setMenuOpen(false)}
              className={styles.mobileLink}
            >
              {cat.label[locale]}
            </Link>
          ))}
          <Link href="/about" onClick={() => setMenuOpen(false)} className={styles.mobileLink}>
            {locale === 'es' ? 'Acerca' : 'About'}
          </Link>
        </nav>
      </div>
    </>
  );
}
