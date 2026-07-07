'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cartTotal, type CartRow } from '@/lib/cart-utils';
import { getGuestCart } from '../lib/cart-client';

export default function CartSummary() {
  const [rows, setRows] = useState<CartRow[] | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    let cancelled = false;

    async function fetchCart() {
      try {
        const res = await fetch('/api/cart');
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setRows(data.items);
          return;
        }
      } catch {}

      const guestItems = getGuestCart();
      if (guestItems.length === 0) {
        if (!cancelled) setRows([]);
        return;
      }
      try {
        const res = await fetch('/api/cart/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: guestItems }),
        });
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setRows(data.items);
        }
      } catch {
        if (!cancelled) setRows([]);
      }
    }

    fetchCart();
    window.addEventListener('cart:changed', fetchCart);
    window.addEventListener('storage', fetchCart);
    return () => {
      cancelled = true;
      window.removeEventListener('cart:changed', fetchCart);
      window.removeEventListener('storage', fetchCart);
    };
  }, [pathname]);

  if (rows === null) return null;

  const count = rows.reduce((a, r) => a + r.quantity, 0);
  const total = cartTotal(rows);

  if (count === 0) return null;

  return (
    <>
      <span className="text-accent">[{count}]</span>
      <span className="label-caps text-text-secondary">£{(total / 100).toFixed(2)}</span>
    </>
  );
}
