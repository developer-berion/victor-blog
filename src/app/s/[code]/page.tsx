import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import RedirectClient from './RedirectClient';
import { getPostByShareCode } from '@/lib/supabase';
import {
  getPostCanonicalUrl,
  getPostSocialCopy,
  getPostSocialImageUrl,
} from '@/lib/social-sharing';
import { buildAbsoluteUrl, SITE_NAME } from '@/lib/site';

async function loadPost(code: string) {
  try {
    return await getPostByShareCode(code);
  } catch {
    return null;
  }
}

export async function generateMetadata(
  props: {
    params: Promise<{ code: string }>;
  }
): Promise<Metadata> {
  const { code } = await props.params;
  const post = await loadPost(String(code ?? '').trim());

  if (!post) {
    return {
      title: 'Link not found',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const socialDescription = getPostSocialCopy(post);
  const socialImage = getPostSocialImageUrl(post);
  const imageUrl = socialImage ? buildAbsoluteUrl(socialImage) : null;
  const canonicalUrl = getPostCanonicalUrl(post.slug);

  return {
    title: post.title,
    description: socialDescription,
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
    },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: socialDescription,
      type: 'article',
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              width: 1200,
              height: 630,
              alt: post.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title: post.title,
      description: socialDescription,
      images: imageUrl ? [imageUrl] : undefined,
    },
  };
}

export default async function ShareLinkPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const shareCode = String(code ?? '').trim();
  const post = await loadPost(shareCode);

  if (!post) {
    notFound();
  }

  const target = getPostCanonicalUrl(post.slug);
  const socialImage = getPostSocialImageUrl(post);

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <RedirectClient target={target} />
      <div style={{ maxWidth: 520 }}>
        <p style={{ margin: 0, fontSize: '0.75rem', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          Shared article
        </p>
        <h1 style={{ margin: '0.6rem 0', fontSize: '1.5rem', lineHeight: 1.2 }}>{post.title}</h1>
        <p style={{ margin: '0 0 1rem', color: 'var(--color-text-muted)' }}>
          Redirecting to the full article.
        </p>
        {socialImage ? (
          <p style={{ margin: 0, color: 'var(--color-text-subtle)', fontSize: '0.875rem' }}>
            Social preview image is loaded from the article cover.
          </p>
        ) : null}
        <Link href={target}>Open article</Link>
      </div>
    </main>
  );
}
