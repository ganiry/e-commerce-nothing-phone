import { NextResponse } from 'next/server';
import { authenticateUser, createSession, setSessionCookie, pruneExpiredSessions } from '@/lib/auth';

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'INVALID_BODY' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 });
  }

  const user = await authenticateUser({ email, password });
  if (!user) {
    return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 });
  }

  const { token, expiresAt } = await createSession(user.id);
  await setSessionCookie(token, expiresAt);
  await pruneExpiredSessions();
  return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
}
