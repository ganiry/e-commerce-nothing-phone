'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { variantLabelFromRow, cartTotal, type CartRow } from '@/lib/cart-utils';
import { guestSetQty, guestRemove, getGuestCart } from '../lib/cart-client';

export default function CartView({
  initialRows,
  authenticated,
}: {
  initialRows: CartRow[];
  authenticated: boolean;
}) {
  const [rows, setRows] = useState<CartRow[]>(initialRows);
  const [status, setStatus] = useState<string | null>(null);

  async function refreshGuest() {
    const items = getGuestCart();
    const res = await fetch('/api/cart/preview', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    if (res.ok) {
      const data = await res.json();
      setRows(data.items);
    }
  }

  async function updateQty(variantId: string, quantity: number) {
    if (authenticated) {
      const res = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId, quantity }),
      });
      if (res.ok) {
        const data = await res.json();
        setRows(data.items);
        setStatus('[ UPDATED ]');
      }
    } else {
      guestSetQty(variantId, quantity);
      await refreshGuest();
      setStatus('[ UPDATED ]');
    }
  }

  async function remove(variantId: string) {
    if (authenticated) {
      const res = await fetch(`/api/cart?variantId=${encodeURIComponent(variantId)}`, { method: 'DELETE' });
      if (res.ok) {
        const data = await res.json();
        setRows(data.items);
        setStatus('[ REMOVED ]');
      }
    } else {
      guestRemove(variantId);
      await refreshGuest();
      setStatus('[ REMOVED ]');
    }
  }

  const total = cartTotal(rows);

  if (rows.length === 0) {
    return (
      <div className="border border-border rounded-card p-16 text-center">
        <p className="font-display text-2xl text-text-secondary">[ Your bag is empty ]</p>
        <Link href="/store" className="mt-4 inline-block label-caps text-text-primary hover:text-accent transition-colors">
          Browse the store →
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="divide-y divide-border border-y border-border">
        {rows.map((row) => (
          <div key={row.variantId} className="py-6 flex gap-5 items-center">
            <Link href={`/products/${row.productSlug}`} className="shrink-0">
              <div className="relative h-24 w-24 sm:h-28 sm:w-28 rounded-card bg-surface border border-border overflow-hidden dot-grid flex items-center justify-center">
                {row.heroImage && <Image src={row.heroImage} alt={row.productName} fill className="object-contain p-2" />}
              </div>
            </Link>

            <div className="flex-1 min-w-0">
              <Link href={`/products/${row.productSlug}`} className="font-display text-lg tracking-tight text-text-display hover:text-accent transition-colors">
                {row.productName}
              </Link>
              <p className="font-mono text-sm text-text-secondary mt-1">
                {variantLabelFromRow(row).replace(row.productName + ' — ', '')}
              </p>
              <p className="label-caps text-text-disabled mt-1.5">{row.category}</p>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-3 border border-border-visible rounded-full px-2 py-1">
                <button onClick={() => updateQty(row.variantId, row.quantity - 1)} className="label-caps text-text-secondary hover:text-text-primary px-1" aria-label="Decrease">−</button>
                <span className="font-mono text-sm text-text-display w-6 text-center">{row.quantity}</span>
                <button onClick={() => updateQty(row.variantId, row.quantity + 1)} className="label-caps text-text-secondary hover:text-text-primary px-1" aria-label="Increase">+</button>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-sm text-text-primary">£{((row.unitPrice * row.quantity) / 100).toFixed(2)}</span>
                <button onClick={() => remove(row.variantId)} className="label-caps text-text-disabled hover:text-accent transition-colors" aria-label="Remove">[x]</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="label-caps text-text-secondary">Total</p>
          <p className="font-display text-3xl tracking-tight text-text-display">£{(total / 100).toFixed(2)}</p>
        </div>
        <div className="flex flex-col gap-3 items-start">
          {status && <span className="label-caps text-text-secondary">{status}</span>}
          {!authenticated && (
            <Link href="/login?redirect=/cart" className="label-caps text-accent hover:opacity-80 transition-opacity">
              [ Sign in to save your bag ]
            </Link>
          )}
          <button disabled className="rounded-full bg-text-display text-background px-6 py-3.5 label-caps opacity-40 cursor-not-allowed">
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
