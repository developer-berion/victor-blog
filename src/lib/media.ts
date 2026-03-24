const MEDIA_PROXY_PREFIX = '/media/';
const SUPABASE_STORAGE_URL_RE =
  /^https?:\/\/[^/]+\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/i;
const BLOCKED_INFRA_HOSTS = ['localhost', '127.0.0.1', 'vercel.app', 'vercel.com', 'supabase.co'];

export type MediaReference = {
  bucket: string;
  path: string;
};

export const ALLOWED_MEDIA_BUCKETS = new Set(['blog-covers']);

function cleanBucket(bucket: string) {
  return bucket.trim().replace(/^\/+|\/+$/g, '');
}

export function encodeMediaPath(objectPath: string) {
  return objectPath
    .split('/')
    .filter(Boolean)
    .map((segment) => encodeURIComponent(segment))
    .join('/');
}

export function decodeMediaPath(pathSegments: string[]) {
  return pathSegments.map((segment) => decodeURIComponent(segment)).join('/');
}

export function buildMediaProxyUrl(bucket: string, objectPath: string) {
  const safeBucket = cleanBucket(bucket);
  const safePath = encodeMediaPath(objectPath);
  return `${MEDIA_PROXY_PREFIX}${encodeURIComponent(safeBucket)}/${safePath}`;
}

export function parseMediaProxyUrl(value: string): MediaReference | null {
  const trimmed = value.trim();
  if (!trimmed.startsWith(MEDIA_PROXY_PREFIX)) return null;

  const remainder = trimmed.slice(MEDIA_PROXY_PREFIX.length);
  const [bucketPart, ...pathParts] = remainder.split('/');

  if (!bucketPart || !pathParts.length) return null;

  return {
    bucket: decodeURIComponent(bucketPart),
    path: decodeMediaPath(pathParts),
  };
}

export function parseSupabaseStorageUrl(value: string): MediaReference | null {
  const trimmed = value.trim();
  const match = trimmed.match(SUPABASE_STORAGE_URL_RE);
  if (!match) return null;

  return {
    bucket: decodeURIComponent(match[1]),
    path: decodeURIComponent(match[2]),
  };
}

function isBlockedInfraUrl(value: string) {
  try {
    const url = new URL(value);
    return BLOCKED_INFRA_HOSTS.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`));
  } catch {
    return false;
  }
}

export function normalizeMediaUrl(
  value: string | null | undefined,
  defaultBucket = 'blog-covers',
) {
  const trimmed = value?.trim() ?? '';
  if (!trimmed) return null;

  if (trimmed.startsWith(MEDIA_PROXY_PREFIX)) {
    return trimmed;
  }

  const proxyRef = parseMediaProxyUrl(trimmed);
  if (proxyRef) {
    return buildMediaProxyUrl(proxyRef.bucket, proxyRef.path);
  }

  const supabaseRef = parseSupabaseStorageUrl(trimmed);
  if (supabaseRef) {
    return buildMediaProxyUrl(supabaseRef.bucket, supabaseRef.path);
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const url = new URL(trimmed);
      if (url.pathname.startsWith(MEDIA_PROXY_PREFIX)) {
        return `${url.pathname}${url.search}`;
      }

      if (isBlockedInfraUrl(trimmed)) {
        return null;
      }
    } catch {
      return null;
    }

    return trimmed;
  }

  if (trimmed.startsWith('/')) {
    return trimmed;
  }

  return buildMediaProxyUrl(defaultBucket, trimmed);
}

export function buildSupabaseStoragePublicUrl(
  supabaseBaseUrl: string,
  bucket: string,
  objectPath: string,
) {
  const baseUrl = supabaseBaseUrl.replace(/\/+$/, '');
  return `${baseUrl}/storage/v1/object/public/${cleanBucket(bucket)}/${encodeMediaPath(objectPath)}`;
}
