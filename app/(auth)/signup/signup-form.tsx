'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { mergeGuestCartOnLogin } from '../../lib/cart-client';

export default function SignupPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') ?? '/store';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, password }),
    });
    if (res.ok) {
      await mergeGuestCartOnLogin();
      router.push(redirect);
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error === 'EMAIL_TAKEN' ? 'That email is already registered.' : 'Sign up failed.');
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-16 sm:py-24">
      <p className="label-caps text-text-secondary mb-3">Account</p>
      <h1 className="text-3xl font-display tracking-tight text-text-display">Create account</h1>

      <form onSubmit={submit} className="mt-8 flex flex-col gap-5">
        <label className="flex flex-col gap-2">
          <span className="label-caps text-text-secondary">Name</span>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="font-mono text-sm bg-transparent border-b border-border-visible focus:border-text-display outline-none py-2 transition-colors"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="label-caps text-text-secondary">Email</span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="font-mono text-sm bg-transparent border-b border-border-visible focus:border-text-display outline-none py-2 transition-colors"
          />
        </label>
        <label className="flex flex-col gap-2">
          <span className="label-caps text-text-secondary">Password</span>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="font-mono text-sm bg-transparent border-b border-border-visible focus:border-text-display outline-none py-2 transition-colors"
          />
        </label>
        <p className="label-caps text-text-disabled">Minimum 6 characters.</p>

        {error && <p className="label-caps text-accent">[ {error} ]</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 rounded-full bg-text-display text-background px-6 py-3.5 label-caps hover:opacity-80 transition-opacity disabled:opacity-40"
        >
          {pending ? '[ Creating... ]' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 label-caps text-text-secondary">
        Already have an account?{' '}
        <Link href={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-text-primary hover:text-accent transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
