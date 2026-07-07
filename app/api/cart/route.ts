import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { getCart, addToCart, setQuantity, removeFromCart } from '@/lib/cart';

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
  const items = await getCart(user.id);
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body?.variantId || typeof body.variantId !== 'string') {
    return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 });
  }
  const quantity = Math.max(1, Math.min(99, Number(body.quantity ?? 1) || 1));
  await addToCart(user.id, body.variantId, quantity);
  const items = await getCart(user.id);
  return NextResponse.json({ items });
}

export async function PATCH(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
  const body = await request.json().catch(() => null);
  if (!body?.variantId || typeof body.variantId !== 'string') {
    return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 });
  }
  const quantity = Math.max(0, Math.min(99, Number(body.quantity ?? 0) || 0));
  await setQuantity(user.id, body.variantId, quantity);
  const items = await getCart(user.id);
  return NextResponse.json({ items });
}

export async function DELETE(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const variantId = searchParams.get('variantId');
  if (!variantId) return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 });
  await removeFromCart(user.id, variantId);
  const items = await getCart(user.id);
  return NextResponse.json({ items });
}
