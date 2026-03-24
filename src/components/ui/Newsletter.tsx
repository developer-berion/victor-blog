'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useLocale } from '@/components/i18n/LocaleProvider';
import styles from './Newsletter.module.css';

const copy = {
  es: {
    heading: 'Noticias y actualizaciones',
    subtext:
      'Recibe noticias, cambios y actualizaciones sobre IA, negocio y contexto LATAM directamente en tu inbox.',
    label: 'Correo electrónico',
    placeholder: 'tu@email.com',
    submit: 'Suscribirse',
    loading: 'Enviando...',
    success: '¡Suscrito! Revisa tu inbox.',
    alreadySubscribed: 'Ya estás suscrito.',
    error: 'Error al suscribir.',
    connectionError: 'Error de conexión.',
  },
  en: {
    heading: 'News and updates',
    subtext:
      'Get news, updates, and editorial notes on AI, business, and the LATAM context directly in your inbox.',
    label: 'Email address',
    placeholder: 'you@email.com',
    submit: 'Subscribe',
    loading: 'Sending...',
    success: 'Subscribed! Check your inbox.',
    alreadySubscribed: 'You are already subscribed.',
    error: 'Subscription error.',
    connectionError: 'Connection error.',
  },
} as const;

export default function Newsletter() {
  const { locale } = useLocale();
  const content = copy[locale];
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setMessage(content.success);
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message === 'already_subscribed' ? content.alreadySubscribed : content.error);
      }
    } catch {
      setStatus('error');
      setMessage(content.connectionError);
    }
  };

  return (
    <motion.section
      className={styles.section}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.inner}>
        <h2 className={styles.heading}>{content.heading}</h2>
        <p className={styles.subtext}>{content.subtext}</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="newsletter-email" className={styles.label}>
            {content.label}
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={content.placeholder}
            className={styles.input}
            required
            disabled={status === 'loading'}
          />
          <button type="submit" className={styles.button} disabled={status === 'loading'}>
            {status === 'loading' ? content.loading : content.submit}
          </button>
        </form>

        {message && (
          <p className={`${styles.message} ${status === 'success' ? styles.success : styles.errorMsg}`}>
            {message}
          </p>
        )}
      </div>
    </motion.section>
  );
}
