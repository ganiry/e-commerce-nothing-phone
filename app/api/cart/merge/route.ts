import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { mergeGuestCart, getCart, type GuestCartItem } from '@/lib/cart';

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
  const body = await request.json().catch(() => null);
  const items: GuestCartItem[] = Array.isArray(body?.items) ? body.items : [];
  await mergeGuestCart(user.id, items);
  const cart = await getCart(user.id);
  return NextResponse.json({ items: cart });
}
