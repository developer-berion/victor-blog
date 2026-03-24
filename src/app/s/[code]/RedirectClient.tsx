'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type RedirectClientProps = {
  target: string;
};

export default function RedirectClient({ target }: RedirectClientProps) {
  const router = useRouter();

  useEffect(() => {
    router.replace(target);
  }, [router, target]);

  return null;
}
