import { NextResponse } from 'next/server';
import { getSessionUser, verifyPassword, deleteUser, clearSessionCookie } from '@/lib/auth';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });

  let body: { password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'INVALID_BODY' }, { status: 400 });
  }

  if (!body.password) {
    return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 });
  }

  const [stored] = await db.select({ passwordHash: users.passwordHash }).from(users).where(eq(users.id, user.id)).limit(1);
  if (!stored) return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });

  const ok = await verifyPassword(body.password, stored.passwordHash);
  if (!ok) return NextResponse.json({ error: 'WRONG_PASSWORD' }, { status: 403 });

  await deleteUser(user.id);
  await clearSessionCookie();

  return NextResponse.json({ ok: true });
}
