import { marked } from 'marked';

const MARKED_OPTIONS = {
  breaks: true,
  gfm: true,
} as const;

function looksLikeHtml(content: string) {
  return /<(?:p|h[1-6]|ul|ol|li|blockquote|pre|code|a|strong|em|u|s|span|div|figure|img|hr|br)\b/i.test(
    content,
  );
}

function demoteHeadingLevels(html: string) {
  return html
    .replace(/<h1(\b[^>]*)>/g, '<h2$1>')
    .replace(/<\/h1>/g, '</h2>')
    .replace(/<h2(\b[^>]*)>/g, '<h3$1>')
    .replace(/<\/h2>/g, '</h3>')
    .replace(/<h3(\b[^>]*)>/g, '<h4$1>')
    .replace(/<\/h3>/g, '</h4>');
}

export function normalizeRichContent(content: string | null | undefined) {
  const normalized = content?.trim() ?? '';
  if (!normalized) {
    return '';
  }

  if (looksLikeHtml(normalized)) {
    return normalized;
  }

  const html = String(marked.parse(normalized, MARKED_OPTIONS));
  return demoteHeadingLevels(html).trim();
}

export function renderMarkdown(content: string) {
  return normalizeRichContent(content);
}
