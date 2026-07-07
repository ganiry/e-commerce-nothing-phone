'use client';

import { useState, useCallback } from 'react';

const GUEST_KEY = 'guest_cart';

export type GuestItem = { variantId: string; quantity: number };

export function getGuestCart(): GuestItem[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(GUEST_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveGuestCart(items: GuestItem[]) {
  localStorage.setItem(GUEST_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('cart:changed'));
}

export function guestAdd(variantId: string, quantity = 1) {
  const items = getGuestCart();
  const existing = items.find((i) => i.variantId === variantId);
  if (existing) existing.quantity += quantity;
  else items.push({ variantId, quantity });
  saveGuestCart(items);
}

export function guestSetQty(variantId: string, quantity: number) {
  let items = getGuestCart();
  if (quantity <= 0) {
    items = items.filter((i) => i.variantId !== variantId);
  } else {
    const item = items.find((i) => i.variantId === variantId);
    if (item) item.quantity = quantity;
  }
  saveGuestCart(items);
}

export function guestRemove(variantId: string) {
  const items = getGuestCart().filter((i) => i.variantId !== variantId);
  saveGuestCart(items);
}

export function guestClear() {
  localStorage.removeItem(GUEST_KEY);
  window.dispatchEvent(new Event('cart:changed'));
}

/** Add to cart: tries server (logged-in) first, falls back to guest localStorage on 401. */
export async function addToCartEverywhere(variantId: string, quantity = 1): Promise<'server' | 'guest'> {
  const res = await fetch('/api/cart', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ variantId, quantity }),
  });
  if (res.ok) {
    window.dispatchEvent(new Event('cart:changed'));
    return 'server';
  }
  if (res.status === 401) {
    guestAdd(variantId, quantity);
    return 'guest';
  }
  throw new Error('CART_ERROR');
}

/** After login: merge guest cart into the server cart, then clear guest storage. */
export async function mergeGuestCartOnLogin() {
  const items = getGuestCart();
  if (items.length === 0) return;
  await fetch('/api/cart/merge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items }),
  });
  guestClear();
}

export type AddResult = { ok: boolean; mode: 'server' | 'guest'; error?: string };

export function useAddToCart() {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<AddResult | null>(null);

  const add = useCallback(async (variantId: string, quantity = 1) => {
    setPending(true);
    try {
      const mode = await addToCartEverywhere(variantId, quantity);
      setResult({ ok: true, mode });
    } catch (e) {
      setResult({ ok: false, mode: 'server', error: String(e) });
    } finally {
      setPending(false);
    }
  }, []);

  return { add, pending, result };
}
