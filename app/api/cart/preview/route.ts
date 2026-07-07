import { NextResponse } from 'next/server';
import { resolveGuestItems, type GuestCartItem } from '@/lib/cart';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const items: GuestCartItem[] = Array.isArray(body?.items) ? body.items : [];
  const rows = await resolveGuestItems(items);
  return NextResponse.json({ items: rows });
}
