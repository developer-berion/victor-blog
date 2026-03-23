'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './Newsletter.module.css';

export default function Newsletter() {
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
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus('success');
        setMessage('¡Suscrito! Revisa tu inbox.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(data.message === 'already_subscribed' ? 'Ya estás suscrito.' : 'Error al suscribir.');
      }
    } catch {
      setStatus('error');
      setMessage('Error de conexión.');
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
        <h2 className={styles.heading}>Stay informed</h2>
        <p className={styles.subtext}>
          Recibe análisis sobre IA y su impacto en las empresas directamente en tu inbox.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="newsletter-email" className={styles.label}>
            Correo electrónico
          </label>
          <input
            id="newsletter-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className={styles.input}
            required
            disabled={status === 'loading'}
          />
          <button
            type="submit"
            className={styles.button}
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Enviando...' : 'Suscribirse'}
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
