'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { guestClear } from '@/app/lib/cart-client';

type Me = { name: string; email: string } | null;

export default function AccountPage() {
  const router = useRouter();
  const [me, setMe] = useState<Me | undefined>(undefined);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<'idle' | 'confirm'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.user) {
          router.replace('/login?redirect=/account');
        } else {
          setMe(d.user);
        }
      })
      .catch(() => router.replace('/login?redirect=/account'));
  }, [router]);

  async function signOut() {
    await fetch('/api/auth/logout', { method: 'POST' });
    guestClear();
    router.push('/');
    router.refresh();
  }

  async function deleteAccount(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setPending(true);
    setError(null);
    const res = await fetch('/api/auth/delete-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.push('/');
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error === 'WRONG_PASSWORD' ? 'Wrong password.' : 'Failed to delete account.');
      setPending(false);
    }
  }

  if (me === undefined) {
    return (
      <div className="mx-auto max-w-sm px-5 py-16 sm:py-24">
        <p className="label-caps text-text-disabled">[ LOADING... ]</p>
      </div>
    );
  }

  if (me === null) return null;

  return (
    <div className="mx-auto max-w-sm px-5 py-16 sm:py-24">
      <p className="label-caps text-text-secondary mb-3">Account</p>
      <h1 className="text-3xl font-display tracking-tight text-text-display">{me.name}</h1>

      <div className="mt-8 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="label-caps text-text-secondary">Name</span>
          <p className="font-mono text-sm text-text-primary border-b border-border-visible py-2">
            {me.name}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <span className="label-caps text-text-secondary">Email</span>
          <p className="font-mono text-sm text-text-primary border-b border-border-visible py-2">
            {me.email}
          </p>
        </div>
      </div>

      <button
        onClick={signOut}
        className="mt-8 rounded-full border border-border-visible text-text-secondary px-6 py-3.5 label-caps hover:border-text-primary hover:text-text-primary transition-colors w-full"
      >
        Sign out
      </button>

      <div className="mt-12 border-t border-border pt-10">
        <h2 className="label-caps text-accent mb-6">Danger zone</h2>

        {step === 'idle' ? (
          <button
            onClick={() => setStep('confirm')}
            className="rounded-full border border-accent text-accent px-6 py-3.5 label-caps hover:bg-accent hover:text-white transition-colors w-full"
          >
            Delete account
          </button>
        ) : (
          <form onSubmit={deleteAccount} className="flex flex-col gap-5">
            <label className="flex flex-col gap-2">
              <span className="label-caps text-text-secondary">Enter your password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="font-mono text-sm bg-transparent border-b border-border-visible focus:border-text-display outline-none py-2 transition-colors"
              />
            </label>
            <label className="flex flex-col gap-2">
              <span className="label-caps text-text-secondary">Confirm password</span>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="font-mono text-sm bg-transparent border-b border-border-visible focus:border-text-display outline-none py-2 transition-colors"
              />
            </label>

            {error && <p className="label-caps text-accent">[ {error} ]</p>}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => { setStep('idle'); setPassword(''); setConfirmPassword(''); setError(null); }}
                className="flex-1 rounded-full border border-border-visible text-text-secondary px-6 py-3.5 label-caps hover:border-text-primary hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pending}
                className="flex-1 rounded-full border border-accent text-accent px-6 py-3.5 label-caps hover:bg-accent hover:text-white transition-colors disabled:opacity-40"
              >
                {pending ? '[ Deleting... ]' : 'Confirm delete'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
