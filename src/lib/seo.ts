import crypto from 'crypto';
import path from 'path';
import { SITE_NAME } from './site';

export function normalizeSeoText(input: string) {
  return input.replace(/\s+/g, ' ').trim();
}

export function slugifyText(input: string) {
  return input
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function trimToLength(input: string, maxLength: number) {
  const text = normalizeSeoText(input);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

export function buildSeoTitle(title: string) {
  return trimToLength(title, 60);
}

export function buildSeoDescription(excerpt: string) {
  return trimToLength(excerpt, 160);
}

export function buildCoverAltText(title: string, category?: string | null) {
  const prefix = category ? `${category}: ` : '';
  return trimToLength(`Portada de ${prefix}${title}`, 110);
}

function getFileExtension(file: File) {
  const extension = path.extname(file.name).toLowerCase();
  if (extension) {
    return extension.startsWith('.') ? extension : `.${extension}`;
  }

  if (file.type === 'image/png') return '.png';
  if (file.type === 'image/webp') return '.webp';
  if (file.type === 'image/gif') return '.gif';
  if (file.type === 'image/jpeg') return '.jpg';
  return '.jpg';
}

export function buildSeoImageFileName(title: string, slug: string, file: File) {
  const extension = getFileExtension(file);
  const safeSlug = trimToLength(slugifyText(slug), 48).replace(/^-+|-+$/g, '');
  const safeTitle = trimToLength(slugifyText(title), 48).replace(/^-+|-+$/g, '');
  const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+$/, '').replace('T', '-');
  const hash = crypto.createHash('sha1').update(`${title}-${slug}-${file.name}`).digest('hex').slice(0, 8);
  return `${safeSlug}/${safeTitle || 'cover'}-${stamp}-${hash}${extension}`;
}

export function buildDefaultSeoTitle(title: string) {
  const normalized = normalizeSeoText(title);
  if (!normalized) {
    return SITE_NAME;
  }
  return trimToLength(`${normalized} | ${SITE_NAME}`, 60);
}

export function buildDefaultSeoDescription(excerpt: string) {
  return buildSeoDescription(excerpt);
}

export type SeoAuditIssue = {
  field: 'seo_title' | 'seo_description' | 'cover_image_alt';
  severity: 'info' | 'warning' | 'error';
  message: string;
};

export function auditSeoDraft(params: {
  title: string;
  seoTitle: string;
  excerpt: string;
  seoDescription: string;
  coverImageAlt: string;
}) {
  const issues: SeoAuditIssue[] = [];

  if (params.seoTitle.length > 60) {
    issues.push({
      field: 'seo_title',
      severity: 'warning',
      message: 'El título SEO debería quedarse por debajo de 60 caracteres.',
    });
  }

  if (params.seoTitle.length < 20) {
    issues.push({
      field: 'seo_title',
      severity: 'info',
      message: 'Un título SEO más descriptivo suele rendir mejor.',
    });
  }

  if (params.seoDescription.length < 120 || params.seoDescription.length > 160) {
    issues.push({
      field: 'seo_description',
      severity: 'warning',
      message: 'La meta description funciona mejor entre 120 y 160 caracteres.',
    });
  }

  if (params.coverImageAlt.length < 15) {
    issues.push({
      field: 'cover_image_alt',
      severity: 'info',
      message: 'El texto alternativo puede ser más descriptivo.',
    });
  }

  if (!params.title.trim()) {
    issues.push({
      field: 'seo_title',
      severity: 'error',
      message: 'El título principal es obligatorio para construir SEO.',
    });
  }

  if (!params.excerpt.trim()) {
    issues.push({
      field: 'seo_description',
      severity: 'error',
      message: 'El extracto es obligatorio para la descripción SEO.',
    });
  }

  return issues;
}
