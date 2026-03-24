'use client';

import Link from 'next/link';
import Newsletter from '@/components/ui/Newsletter';
import { useLocale } from '@/components/i18n/LocaleProvider';
import styles from './page.module.css';

type Copy = {
  eyebrow: string;
  title: string;
  description: string;
  navHome: string;
  navTopic: string;
  section1Title: string;
  section1: string[];
  sidebarFocusTitle: string;
  sidebarFocus: Array<{ label: string; value: string }>;
  sidebarWhyTitle: string;
  sidebarWhy: string;
  pillarsTitle: string;
  pillars: Array<{ title: string; text: string }>;
  section2Title: string;
  section2: string;
  topicsTitle: string;
  topics: Array<{ href: string; label: string; description: string }>;
  quote: string;
}

const copy: Record<'es' | 'en', Copy> = {
  es: {
    eyebrow: 'Acerca',
    title: 'Un blog para contar lo que funciona de verdad',
    description:
      'Soy Victor Garcia y llevo casi dos décadas trabajando entre tecnología, producto y negocio. Este espacio reúne ese recorrido para escribir sobre inteligencia artificial, criterio editorial, implementación y decisiones útiles para empresas en Latinoamérica.',
    navHome: 'Volver al inicio',
    navTopic: 'IA para Empresas',
    section1Title: 'Mi recorrido',
    section1: [
      'Mi recorrido comenzó en desarrollo front-end, pero con los años fui cruzando hacia project management, product management, operaciones, estrategia e implementación. Ese camino me permitió entender algo que hoy considero clave: la tecnología no vale solo por lo que hace, sino por el problema que resuelve, el tiempo que ahorra, el costo que reduce y la claridad que le aporta al negocio.',
      'En los últimos dos años he estado fuera del mundo laboral tradicional, pero no fuera de la ejecución. He dedicado este tiempo a estudiar, construir, probar, fallar, ajustar y entender cómo aplicar inteligencia artificial de forma lógica y sensata. No desde el ruido. No desde el discurso inflado. Desde el trabajo real.',
      'Hoy trabajo precisamente en esa intersección: producto, negocio, automatización e inteligencia artificial aplicada. Desde mejoras puntuales que ahorran horas de trabajo hasta sistemas más ambiciosos que conectan procesos, datos y decisiones de forma más inteligente.',
    ],
    sidebarFocusTitle: 'Enfoque rápido',
    sidebarFocus: [
      { label: 'Enfoque', value: 'IA, producto y negocio' },
      { label: 'Contexto', value: 'Latinoamérica' },
      { label: 'Tono', value: 'Claro, práctico y sin hype' },
      { label: 'Objetivo', value: 'Ayudar a leer mejor la tecnología' },
    ],
    sidebarWhyTitle: 'Por qué existe este blog',
    sidebarWhy:
      'Para documentar el proceso completo: estrategia, operación y parte humana. Porque construir con tecnología en Latinoamérica requiere contexto, criterio y pies en la tierra.',
    pillarsTitle: 'Sensatez, contexto y aprendizaje',
    pillars: [
      {
        title: 'Sensatez antes que hype',
        text: 'Escribir sobre IA sin vender promesas vacías. Qué funciona, qué no, qué cuesta y qué impacto real deja en una operación.',
      },
      {
        title: 'Latinoamérica como contexto',
        text: 'El mercado, los equipos y las restricciones de la región importan. No se puede importar una narrativa global sin adaptarla.',
      },
      {
        title: 'Aprendizaje en público',
        text: 'Este blog documenta proyectos, procesos, resultados y errores. La idea es construir criterio, no solo presencia.',
      },
    ],
    section2Title: 'Qué vas a encontrar aquí',
    section2:
      'Este espacio mezcla narrativa personal con lectura estratégica del mercado. Vas a encontrar artículos sobre inteligencia artificial aplicada a empresas, noticias y análisis del ecosistema tecnológico, opinión con foco en negocio y ejecución, aprendizajes de implementación, procesos, producto, operaciones y contexto LATAM.',
    topicsTitle: 'Tópicos principales',
    topics: [
      {
        href: '/category/ai-empresas',
        label: 'IA para Empresas',
        description: 'Implementación real, decisiones y resultados.',
      },
      {
        href: '/category/noticias',
        label: 'Noticias',
        description: 'Lectura editorial del mercado y el ecosistema.',
      },
      {
        href: '/category/latam',
        label: 'Impacto LATAM',
        description: 'Contexto regional y oportunidades de adopción.',
      },
      {
        href: '/category/opinion',
        label: 'Opinión',
        description: 'Criterio propio, trade-offs y postura editorial.',
      },
    ],
    quote:
      'La idea no es perseguir cada tendencia. Me interesa entender qué herramientas realmente sirven, qué implicaciones tienen, qué nivel de esfuerzo exigen y qué impacto pueden generar cuando se implementan bien.',
  },
  en: {
    eyebrow: 'About',
    title: 'A blog about what actually works',
    description:
      'I am Victor Garcia, and for nearly two decades I have worked across technology, product, and business. This space brings that experience together to write about artificial intelligence, editorial judgment, implementation, and decisions that help companies in Latin America.',
    navHome: 'Back to home',
    navTopic: 'AI for Business',
    section1Title: 'My background',
    section1: [
      'I started in front-end development, but over the years I moved into project management, product management, operations, strategy, and implementation. That path taught me something I now consider essential: technology is not valuable only because of what it does, but because of the problem it solves, the time it saves, the cost it reduces, and the clarity it brings to a business.',
      'Over the past two years, I have been outside the traditional workforce, but not outside of execution. I have spent this time studying, building, testing, failing, adjusting, and learning how to apply artificial intelligence in a logical and sensible way. Not from noise. Not from inflated claims. From real work.',
      'Today I work at that intersection: product, business, automation, and applied artificial intelligence. From small improvements that save hours of work to more ambitious systems that connect processes, data, and decisions in a smarter way.',
    ],
    sidebarFocusTitle: 'Quick focus',
    sidebarFocus: [
      { label: 'Focus', value: 'AI, product, and business' },
      { label: 'Context', value: 'Latin America' },
      { label: 'Tone', value: 'Clear, practical, and hype-free' },
      { label: 'Goal', value: 'Help readers better understand technology' },
    ],
    sidebarWhyTitle: 'Why this blog exists',
    sidebarWhy:
      'To document the full process: strategy, operations, and the human side of building. Because building with technology in Latin America requires context, judgment, and a grounded view of reality.',
    pillarsTitle: 'Practicality, context, and learning',
    pillars: [
      {
        title: 'Practicality over hype',
        text: 'Writing about AI without selling empty promises. What works, what does not, what it costs, and what real impact it creates inside an operation.',
      },
      {
        title: 'Latin America as context',
        text: 'Markets, teams, and regional constraints matter. You cannot import a global narrative without adapting it to local reality.',
      },
      {
        title: 'Learning in public',
        text: 'This blog documents projects, processes, results, and mistakes. The goal is to build judgment, not just visibility.',
      },
    ],
    section2Title: 'What you will find here',
    section2:
      'This space blends personal narrative with strategic market reading. You will find articles about AI applied to business, technology news and ecosystem analysis, opinion focused on business and execution, implementation learnings, processes, product, operations, and the LATAM context.',
    topicsTitle: 'Main topics',
    topics: [
      {
        href: '/category/ai-empresas',
        label: 'AI for Business',
        description: 'Real implementation, decisions, and outcomes.',
      },
      {
        href: '/category/noticias',
        label: 'News',
        description: 'Editorial reading of the market and the ecosystem.',
      },
      {
        href: '/category/latam',
        label: 'LATAM Impact',
        description: 'Regional context and adoption opportunities.',
      },
      {
        href: '/category/opinion',
        label: 'Opinion',
        description: 'Personal judgment, trade-offs, and editorial stance.',
      },
    ],
    quote:
      'The goal is not to chase every trend. I want to understand which tools actually work, what they imply, how much effort they require, and what impact they can create when implemented well.',
  },
};

export default function AboutContent() {
  const { locale } = useLocale();
  const content = copy[locale];

  return (
    <>
      <section className={styles.hero}>
        <span className="category-label">{content.eyebrow}</span>
        <h1 className={styles.title}>{content.title}</h1>
        <p className={styles.description}>{content.description}</p>
        <nav className={styles.heroLinks} aria-label="Secondary navigation">
          <Link href="/" className={styles.heroLink}>
            {content.navHome}
          </Link>
          <span className={styles.heroDivider}>/</span>
          <Link href="/category/ai-empresas" className={styles.heroLink}>
            {content.navTopic}
          </Link>
        </nav>
      </section>

      <section className={styles.story}>
        <div className={styles.storyMain}>
          <h2 className={styles.sectionTitle}>{content.section1Title}</h2>
          {content.section1.map((paragraph) => (
            <p key={paragraph} className={styles.bodyText}>
              {paragraph}
            </p>
          ))}
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.listCard}>
            <h3 className={styles.listTitle}>{content.sidebarFocusTitle}</h3>
            <dl className={styles.quickFacts}>
              {content.sidebarFocus.map((item) => (
                <div key={item.label} className={styles.factRow}>
                  <dt>{item.label}</dt>
                  <dd>{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className={styles.listCard}>
            <h3 className={styles.listTitle}>{content.sidebarWhyTitle}</h3>
            <p className={styles.sidebarText}>{content.sidebarWhy}</p>
          </div>
        </aside>
      </section>

      <section className={styles.grid}>
        {content.pillars.map((pillar) => (
          <article key={pillar.title} className={styles.card}>
            <h2>{pillar.title}</h2>
            <p>{pillar.text}</p>
          </article>
        ))}
      </section>

      <section className={styles.story}>
        <div className={styles.storyMain}>
          <h2 className={styles.sectionTitle}>{content.section2Title}</h2>
          <p className={styles.bodyText}>{content.section2}</p>
        </div>

        <div className={styles.listCard}>
          <h3 className={styles.listTitle}>{content.topicsTitle}</h3>
          <ul className={styles.list}>
            {content.topics.map((topic) => (
              <li key={topic.label}>
                <Link href={topic.href}>{topic.label}</Link>
                <span>{topic.description}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className={styles.quoteBlock}>
        <p>{content.quote}</p>
      </section>

      <Newsletter />
    </>
  );
}
