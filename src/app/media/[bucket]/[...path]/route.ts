import { createClient } from '@supabase/supabase-js';
import type { NextRequest } from 'next/server';
import { ALLOWED_MEDIA_BUCKETS, decodeMediaPath } from '@/lib/media';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

function getStorageClient() {
  return createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY'),
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

function buildMediaHeaders(contentType: string | null, byteLength: number) {
  return new Headers({
    'Content-Type': contentType || 'application/octet-stream',
    'Content-Length': String(byteLength),
    'Cache-Control': 'public, max-age=31536000, immutable',
    'Cross-Origin-Resource-Policy': 'same-site',
    'X-Content-Type-Options': 'nosniff',
    'X-Robots-Tag': 'noindex, nofollow',
  });
}

async function proxyMedia(bucket: string, pathSegments: string[]) {
  if (!ALLOWED_MEDIA_BUCKETS.has(bucket)) {
    return new Response('Not found', { status: 404 });
  }

  const objectPath = decodeMediaPath(pathSegments);
  if (!objectPath) {
    return new Response('Not found', { status: 404 });
  }

  const client = getStorageClient();
  const { data, error } = await client.storage.from(bucket).download(objectPath);

  if (error || !data) {
    return new Response('Not found', { status: 404 });
  }

  const arrayBuffer = await data.arrayBuffer();
  const body = Buffer.from(arrayBuffer);

  return new Response(body, {
    status: 200,
    headers: buildMediaHeaders(data.type, body.byteLength),
  });
}

export async function GET(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ bucket: string; path: string[] }>;
  },
) {
  const { bucket, path } = await params;
  return proxyMedia(bucket, path);
}

export async function HEAD(
  request: NextRequest,
  context: {
    params: Promise<{ bucket: string; path: string[] }>;
  },
) {
  const response = await GET(request, context);
  return new Response(null, {
    status: response.status,
    headers: response.headers,
  });
}
