import { cookies } from 'next/headers';
import { eq, lt } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import { db } from './db';
import { users, sessions } from './db/schema';
import type { User } from './db/schema';

const SESSION_COOKIE = 'nothing_session';
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
const BCRYPT_COST = 10;

function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, BCRYPT_COST);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export async function createUser({ email, name, password }: { email: string; name: string; password: string }) {
  const existing = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
  if (existing.length > 0) throw new Error('EMAIL_TAKEN');
  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(password);
  await db.insert(users).values({ id, email: email.toLowerCase(), name, passwordHash });
  return { id, email: email.toLowerCase(), name };
}

export async function authenticateUser({ email, password }: { email: string; password: string }) {
  const [user] = await db.select().from(users).where(eq(users.email, email.toLowerCase())).limit(1);
  if (!user) return null;
  const ok = await verifyPassword(password, user.passwordHash);
  if (!ok) return null;
  return user;
}

export async function createSession(userId: string) {
  const token = randomToken();
  const expiresAt = Date.now() + SESSION_TTL_MS;
  await db.insert(sessions).values({ id: token, userId, expiresAt });
  return { token, expiresAt };
}

export async function deleteSession(token: string) {
  await db.delete(sessions).where(eq(sessions.id, token));
}

export async function getSessionUser(): Promise<User | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const [session] = await db.select().from(sessions).where(eq(sessions.id, token)).limit(1);
  if (!session) return null;
  if (session.expiresAt < Date.now()) {
    await db.delete(sessions).where(eq(sessions.id, token));
    return null;
  }
  const [user] = await db.select().from(users).where(eq(users.id, session.userId)).limit(1);
  return user ?? null;
}

export async function setSessionCookie(token: string, expiresAt: number) {
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: new Date(expiresAt),
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function deleteUser(userId: string) {
  await db.delete(users).where(eq(users.id, userId));
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;

// Periodic cleanup of expired sessions — call opportunistically.
export async function pruneExpiredSessions() {
  await db.delete(sessions).where(lt(sessions.expiresAt, Date.now()));
}
