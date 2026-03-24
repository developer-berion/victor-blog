'use client';

import { useMemo, useState } from 'react';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import XIcon from '@mui/icons-material/X';
import type { Locale } from '@/lib/locale';
import { buildSocialShareUrls } from '@/lib/social-sharing';
import styles from './ShareBar.module.css';

type ShareBarProps = {
  locale: Locale;
  shortlink: string;
  socialCopy: string;
  socialCopyLinkedIn: string;
};

const copyByLocale = {
  es: {
    kicker: 'Compartir',
    x: 'Compartir en X',
    facebook: 'Compartir en Facebook',
    linkedin: 'Compartir en LinkedIn',
    copy: 'Copiar enlace',
    copied: 'Copiado',
  },
  en: {
    kicker: 'Share',
    x: 'Share on X',
    facebook: 'Share on Facebook',
    linkedin: 'Share on LinkedIn',
    copy: 'Copy link',
    copied: 'Copied',
  },
} as const;

export default function ShareBar({ locale, shortlink, socialCopy, socialCopyLinkedIn }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const copy = copyByLocale[locale];
  const shareCopy = socialCopy || socialCopyLinkedIn;

  const shareUrls = useMemo(
    () => buildSocialShareUrls(shortlink, shareCopy),
    [shareCopy, shortlink],
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shortlink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section className={styles.shareBar} aria-label={copy.kicker}>
      <div className={styles.panel}>
        <span className={styles.kicker}>{copy.kicker}</span>

        <div className={styles.actions}>
          <a
            className={styles.action}
            href={shareUrls.x}
            target="_blank"
            rel="noopener noreferrer"
            title={copy.x}
            aria-label={copy.x}
          >
            <XIcon className={styles.icon} fontSize="small" />
            <span className={styles.srOnly}>{copy.x}</span>
          </a>

          <a
            className={styles.action}
            href={shareUrls.facebook}
            target="_blank"
            rel="noopener noreferrer"
            title={copy.facebook}
            aria-label={copy.facebook}
          >
            <FacebookRoundedIcon className={styles.icon} fontSize="small" />
            <span className={styles.srOnly}>{copy.facebook}</span>
          </a>

          <a
            className={styles.action}
            href={shareUrls.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            title={copy.linkedin}
            aria-label={copy.linkedin}
          >
            <LinkedInIcon className={styles.icon} fontSize="small" />
            <span className={styles.srOnly}>{copy.linkedin}</span>
          </a>

          <button
            type="button"
            className={styles.copyButton}
            onClick={handleCopy}
            title={copied ? copy.copied : copy.copy}
            aria-label={copied ? copy.copied : copy.copy}
            data-copied={copied ? 'true' : 'false'}
          >
            <ContentCopyRoundedIcon className={styles.icon} fontSize="small" />
            <span className={styles.srOnly}>{copied ? copy.copied : copy.copy}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
