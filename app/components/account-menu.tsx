'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { guestClear } from '@/app/lib/cart-client';

type Me = { name: string; email: string } | null;

export default function AccountMenu() {
  const [me, setMe] = useState<Me | undefined>(undefined);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setMe(d?.user ?? null))
      .catch(() => setMe(null));
  }, [pathname]);

  async function signOut() {
    await fetch('/api/auth/logout', { method: 'POST' });
    guestClear();
    setMe(null);
    router.push('/');
    router.refresh();
  }

  if (me === undefined) return <span className="label-caps text-text-disabled">···</span>;
  if (me === null) {
    return (
      <Link href="/login" className="label-caps text-text-secondary hover:text-text-primary transition-colors">
        Sign in
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-3">
      <Link href="/account" className="label-caps text-text-secondary hover:text-text-primary transition-colors hidden sm:inline">
        {me.name}
      </Link>
      <button onClick={signOut} className="label-caps text-text-secondary hover:text-accent transition-colors">
        Sign out
      </button>
    </div>
  );
}
