import { NextResponse } from 'next/server';
import { createUser, createSession, setSessionCookie, pruneExpiredSessions } from '@/lib/auth';

export async function POST(request: Request) {
  let body: { email?: string; name?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'INVALID_BODY' }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const name = body.name?.trim();
  const password = body.password;

  if (!email || !name || !password || password.length < 6) {
    return NextResponse.json({ error: 'INVALID_INPUT' }, { status: 400 });
  }

  try {
    const user = await createUser({ email, name, password });
    const { token, expiresAt } = await createSession(user.id);
    await setSessionCookie(token, expiresAt);
    await pruneExpiredSessions();
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (e) {
    if (e instanceof Error && e.message === 'EMAIL_TAKEN') {
      return NextResponse.json({ error: 'EMAIL_TAKEN' }, { status: 409 });
    }
    throw e;
  }
}
