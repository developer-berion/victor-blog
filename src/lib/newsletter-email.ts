import { buildAbsoluteUrl, SITE_NAME } from './site';
import type { Locale } from './locale';
import type { PublishedPostSummary } from './supabase';

type NewsletterWelcomeEmailInput = {
  to: string;
  locale: Locale;
  posts: PublishedPostSummary[];
};

type NewsletterTemplate = {
  subject: string;
  preheader: string;
  greeting: string;
  intro: string;
  articleHeading: string;
  consultingTitle: string;
  consultingBody: string;
  footer: string;
  cta: string;
  ctaLabel: string;
  brandLine: string;
};

const templates: Record<Locale, NewsletterTemplate> = {
  es: {
    subject: 'Gracias por suscribirte a Victor Garcia Blog',
    preheader: 'Recibe análisis sobre IA, negocio y LATAM directamente en tu inbox.',
    greeting: 'Gracias por suscribirte',
    intro:
      'Me alegra que estés aquí. Desde este espacio comparto análisis, noticias y lectura editorial sobre IA, negocio y contexto LATAM, con una mirada práctica y sin humo.',
    articleHeading: 'Artículos recientes',
    consultingTitle: 'Asesorías y consultorías independientes',
    consultingBody:
      'También trabajo de forma independiente con empresas y personas que necesitan claridad estratégica, criterio editorial o una segunda opinión para tomar mejores decisiones.',
    footer: 'Visitar Berioncompany.com',
    cta: 'Explorar el blog',
    ctaLabel: 'Ver artículos',
    brandLine: 'Victor García Blog',
  },
  en: {
    subject: 'Thanks for subscribing to Victor Garcia Blog',
    preheader: 'Get AI, business, and LATAM analysis directly in your inbox.',
    greeting: 'Thanks for subscribing',
    intro:
      'I’m glad you’re here. This space shares editorial analysis, news, and practical takes on AI, business, and the LATAM context without the hype.',
    articleHeading: 'Recent articles',
    consultingTitle: 'Independent advisory and consulting',
    consultingBody:
      'I also work independently with companies and individuals who need strategic clarity, editorial judgment, or a second opinion to make better decisions.',
    footer: 'Visit Berioncompany.com',
    cta: 'Explore the blog',
    ctaLabel: 'View articles',
    brandLine: 'Victor Garcia Blog',
  },
};

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildArticleRows(locale: Locale, posts: PublishedPostSummary[]) {
  const items = posts.slice(0, 3);

  if (!items.length) {
    return `<tr><td style="padding: 0.75rem 0; color: #5C7483;">${escapeHtml(
      locale === 'es'
        ? 'Pronto compartiré nuevos artículos contigo.'
        : 'I’ll be sharing new articles with you soon.',
    )}</td></tr>`;
  }

  return items
    .map((post) => {
      const url = buildAbsoluteUrl(`/blog/${post.slug}`);
      return `
        <tr>
          <td style="padding: 0.6rem 0; border-top: 1px solid #D6E5EE;">
            <a href="${url}" style="color: #003459; text-decoration: none; font-weight: 700;">${escapeHtml(
              post.title,
            )}</a>
            <div style="margin-top: 0.25rem; color: #5C7483; font-size: 14px; line-height: 1.5;">
              ${escapeHtml(post.excerpt)}
            </div>
          </td>
        </tr>
      `;
    })
    .join('');
}

function buildPlainText(locale: Locale, posts: PublishedPostSummary[]) {
  const copy = templates[locale];
  const lines = [
    copy.brandLine,
    '',
    copy.greeting,
    '',
    copy.intro,
    '',
    copy.articleHeading,
  ];

  for (const post of posts.slice(0, 3)) {
    lines.push(`- ${post.title}: ${buildAbsoluteUrl(`/blog/${post.slug}`)}`);
  }

  lines.push('', copy.consultingTitle, copy.consultingBody, '', `${copy.footer}: ${buildAbsoluteUrl('/')}`);
  return lines.join('\n');
}

function buildHtml(locale: Locale, posts: PublishedPostSummary[]) {
  const copy = templates[locale];
  const articleRows = buildArticleRows(locale, posts);
  const siteUrl = buildAbsoluteUrl('/');
  const brandName = escapeHtml(copy.brandLine);

  return `<!doctype html>
<html lang="${locale}">
  <body style="margin:0; padding:0; background:#F5FBFF; font-family: Arial, Helvetica, sans-serif; color:#00171F;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0;">
      ${escapeHtml(copy.preheader)}
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F5FBFF; padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px; background:#FFFFFF; border:1px solid #C9DCEC; border-radius:20px; overflow:hidden; box-shadow:0 10px 30px rgba(0, 52, 89, 0.08);">
            <tr>
              <td style="background: linear-gradient(135deg, #003459, #007EA7); height: 10px;"></td>
            </tr>
            <tr>
              <td style="padding:32px 32px 24px;">
                <div style="font-size:12px; letter-spacing:0.2em; text-transform:uppercase; color:#007EA7; font-weight:700;">${brandName}</div>
                <h1 style="margin:12px 0 10px; font-size:32px; line-height:1.1; color:#003459;">${escapeHtml(
                  copy.greeting,
                )}</h1>
                <p style="margin:0; font-size:16px; line-height:1.7; color:#385469;">${escapeHtml(copy.intro)}</p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 8px;">
                <div style="padding:18px 20px; border-radius:16px; background:linear-gradient(135deg, rgba(0,126,167,0.08), rgba(0,168,232,0.1)); border:1px solid #D6E5EE;">
                  <div style="font-size:12px; letter-spacing:0.18em; text-transform:uppercase; color:#003459; font-weight:800;">${escapeHtml(
                    copy.articleHeading,
                  )}</div>
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:14px;">
                    ${articleRows}
                  </table>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 8px;">
                <div style="padding:20px; border-radius:18px; background:#F9FCFE; border:1px solid #D6E5EE;">
                  <div style="font-size:12px; letter-spacing:0.18em; text-transform:uppercase; color:#003459; font-weight:800;">${escapeHtml(
                    copy.consultingTitle,
                  )}</div>
                  <p style="margin:10px 0 0; font-size:15px; line-height:1.7; color:#385469;">${escapeHtml(
                    copy.consultingBody,
                  )}</p>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 8px;">
                <a href="${siteUrl}" style="display:inline-block; background:linear-gradient(135deg, #003459, #007EA7); color:#FFFFFF; text-decoration:none; font-weight:700; padding:14px 22px; border-radius:999px;">${escapeHtml(
                  copy.cta,
                )}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 32px 32px;">
                <p style="margin:0; font-size:12px; line-height:1.5; color:#7C95A4;">
                  <a href="${buildAbsoluteUrl('/')}" style="color:#7C95A4; text-decoration:underline;">${escapeHtml(
                    copy.footer,
                  )}</a>
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function sendNewsletterWelcomeEmail(input: NewsletterWelcomeEmailInput) {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return { sent: false, skipped: true as const };
  }

  const from = 'Victor Garcia <victor@berioncompany.com>';
  const template = templates[input.locale];
  const html = buildHtml(input.locale, input.posts);
  const text = buildPlainText(input.locale, input.posts);

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `newsletter-welcome-${input.to.toLowerCase()}`,
    },
    body: JSON.stringify({
      from,
      to: [input.to],
      subject: template.subject,
      html,
      text,
      reply_to: from,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Newsletter email failed: ${response.status} ${errorText}`.trim());
  }

  return { sent: true, skipped: false as const };
}
