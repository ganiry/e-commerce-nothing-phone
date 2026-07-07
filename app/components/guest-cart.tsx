'use client';

import { useEffect, useState } from 'react';
import { getGuestCart } from '../lib/cart-client';
import { type CartRow } from '@/lib/cart-utils';
import CartView from './cart-view';

export default function GuestCart() {
  const [rows, setRows] = useState<CartRow[] | null>(null);

  useEffect(() => {
    (async () => {
      const items = getGuestCart();
      const res = await fetch('/api/cart/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });
      if (res.ok) {
        const data = await res.json();
        setRows(data.items);
      } else {
        setRows([]);
      }
    })();
  }, []);

  if (rows === null) {
    return <p className="label-caps text-text-secondary" data-loading>[ LOADING ]</p>;
  }

  return <CartView initialRows={rows} authenticated={false} />;
}
