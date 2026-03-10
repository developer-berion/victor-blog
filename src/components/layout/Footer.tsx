import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>Victor Garcia</Link>
          <p className={styles.tagline}>
            Inteligencia Artificial para empresas. Noticias, análisis e impacto en LATAM.
          </p>
        </div>

        <div className={styles.links}>
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Categorías</h4>
            <Link href="/category/ai-empresas">IA & Empresas</Link>
            <Link href="/category/noticias">Noticias</Link>
            <Link href="/category/latam">LATAM</Link>
            <Link href="/category/opinion">Opinión</Link>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Blog</h4>
            <Link href="/">Inicio</Link>
            <Link href="/about">Acerca</Link>
          </div>

          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Social</h4>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter / X</a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>

        <div className={styles.bottom}>
          <p>© {new Date().getFullYear()} Victor Garcia. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
