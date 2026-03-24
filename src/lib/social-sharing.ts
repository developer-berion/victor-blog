import { buildAbsoluteUrl } from './site';
import { normalizeMediaUrl } from './media';
import type { Post } from './supabase';

function normalizeText(value: string | null | undefined) {
  return value?.trim() ?? '';
}

const SHARE_KIT_PREFIX = '<!-- share-kit';
const SHARE_KIT_SUFFIX = '-->';

export type ImageEditorFormat = 'instagram-4-5' | 'article-16-9';

export type ImageEditor = {
  format: ImageEditorFormat;
  zoom: number;
  offsetX: number;
  offsetY: number;
};

export type SocialImageEditor = ImageEditor;
export type CoverImageEditor = ImageEditor;

export type ShareKitValues = {
  share_code: string | null;
  social_copy: string | null;
  social_copy_linkedin: string | null;
  social_image_url: string | null;
  social_image_editor: SocialImageEditor | null;
  cover_image_editor: CoverImageEditor | null;
};

export type ShareKitSnapshot = ShareKitValues & {
  body: string;
};

export function extractShareKitFromContent(content: string): ShareKitSnapshot {
  const normalizedContent = content ?? '';
  const match = normalizedContent.match(
    /^\s*<!-- share-kit\s*\n([\s\S]*?)\n-->\s*(?:\r?\n)?/,
  );

  if (!match) {
    return {
      body: normalizedContent,
      share_code: null,
      social_copy: null,
      social_copy_linkedin: null,
      social_image_url: null,
      social_image_editor: null,
      cover_image_editor: null,
    };
  }

  try {
    const parsed = JSON.parse(match[1]) as Partial<ShareKitValues>;
    return {
      body: normalizedContent.slice(match[0].length),
      share_code: parsed.share_code ?? null,
      social_copy: parsed.social_copy ?? null,
      social_copy_linkedin: parsed.social_copy_linkedin ?? null,
      social_image_url: parsed.social_image_url ?? null,
      social_image_editor: parsed.social_image_editor ?? null,
      cover_image_editor: parsed.cover_image_editor ?? null,
    };
  } catch {
    return {
      body: normalizedContent.slice(match[0].length),
      share_code: null,
      social_copy: null,
      social_copy_linkedin: null,
      social_image_url: null,
      social_image_editor: null,
      cover_image_editor: null,
    };
  }
}

export function composeContentWithShareKit(content: string, values: ShareKitValues) {
  const body = extractShareKitFromContent(content).body.trimStart();
  const payload = JSON.stringify(values);
  return `<!-- share-kit\n${payload}\n-->\n\n${body}`.trim();
}

export function getPostBodyContent(content: string | null | undefined) {
  return extractShareKitFromContent(content ?? '').body.trimStart();
}

export function getPostShareKit(
  post: Pick<
    Post,
    'social_copy' | 'social_copy_linkedin' | 'social_image_url' | 'content'
  > & {
    share_code?: string | null;
    social_image_editor?: SocialImageEditor | null;
    cover_image_editor?: CoverImageEditor | null;
  },
) {
  const parsed = extractShareKitFromContent(post.content ?? '');
  return {
    share_code: post.share_code ?? parsed.share_code,
    social_copy: post.social_copy ?? parsed.social_copy,
    social_copy_linkedin: post.social_copy_linkedin ?? parsed.social_copy_linkedin,
    social_image_url: normalizeMediaUrl(post.social_image_url ?? parsed.social_image_url),
    social_image_editor: post.social_image_editor ?? parsed.social_image_editor,
    cover_image_editor: post.cover_image_editor ?? parsed.cover_image_editor,
  } satisfies ShareKitValues;
}

export function getPostCanonicalUrl(slug: string) {
  return buildAbsoluteUrl(`/blog/${slug}`);
}

export function getPostShareUrl(
  post: Pick<Post, 'slug' | 'social_copy' | 'social_copy_linkedin' | 'social_image_url' | 'content'> & {
    share_code?: string | null;
  },
) {
  const shareKit = getPostShareKit(post);
  return shareKit.share_code ? buildAbsoluteUrl(`/s/${shareKit.share_code}`) : getPostCanonicalUrl(post.slug);
}

export function getPostSocialCopy(
  post: Pick<Post, 'social_copy' | 'excerpt' | 'title' | 'social_copy_linkedin' | 'social_image_url' | 'content'> & {
    share_code?: string | null;
  },
) {
  const shareKit = getPostShareKit(post);
  return normalizeText(shareKit.social_copy) || normalizeText(post.excerpt) || normalizeText(post.title);
}

export function getPostLinkedInCopy(
  post: Pick<Post, 'social_copy_linkedin' | 'social_copy' | 'excerpt' | 'title' | 'social_image_url' | 'content'> & {
    share_code?: string | null;
  },
) {
  const shareKit = getPostShareKit(post);
  return (
    normalizeText(shareKit.social_copy_linkedin) ||
    normalizeText(shareKit.social_copy) ||
    normalizeText(post.excerpt) ||
    normalizeText(post.title)
  );
}

export function getPostSocialImageUrl(
  post: Pick<
    Post,
    'social_image_url' | 'cover_image_url' | 'social_copy' | 'social_copy_linkedin' | 'content'
  > & {
    share_code?: string | null;
  },
) {
  const shareKit = getPostShareKit(post);
  return (
    normalizeText(shareKit.social_image_url) ||
    normalizeMediaUrl(post.cover_image_url) ||
    normalizeMediaUrl(post.social_image_url) ||
    null
  );
}

export function getPostCoverImageUrl(
  post: Pick<Post, 'cover_image_url' | 'social_image_url' | 'content'> & {
    share_code?: string | null;
  },
) {
  return normalizeMediaUrl(post.cover_image_url) || normalizeMediaUrl(post.social_image_url) || null;
}

export function getPostCoverImageEditor(
  post: Pick<Post, 'content'> & {
    cover_image_editor?: CoverImageEditor | null;
  },
) {
  return post.cover_image_editor ?? extractShareKitFromContent(post.content ?? '').cover_image_editor;
}

export function buildSocialShareUrls(shortlink: string, socialCopy: string) {
  const encodedUrl = encodeURIComponent(shortlink);
  const encodedCopy = encodeURIComponent(socialCopy);

  return {
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedCopy}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedCopy}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
  };
}

export function buildSocialShareCaption(shortlink: string, socialCopy: string) {
  const caption = normalizeText(socialCopy);

  if (!caption) {
    return normalizeText(shortlink);
  }

  return `${caption}\n\n${shortlink}`.trim();
}
