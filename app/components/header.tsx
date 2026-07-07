'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { useTheme } from './theme-provider';
import CartSummary from './cart-summary';
import AccountMenu from './account-menu';

const nav = [
  { href: '/', label: 'Home' },
  { href: '/store', label: 'Store' },
];

export default function Header() {
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    closeMenu();
  }, [pathname, closeMenu]);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 h-14 grid grid-cols-2 sm:grid-cols-3 items-center">
          <Link href="/" className="flex items-center gap-2.5 group justify-self-start">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-text-display transition-transform group-hover:scale-110" />
            <span className="font-display tracking-tight text-base">Nothing(R)</span>
          </Link>

          <nav className="hidden sm:flex items-center justify-center gap-6">
            {nav.map((item) => {
              const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`label-caps transition-colors ${active ? 'text-text-display' : 'text-text-secondary hover:text-text-primary'}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 justify-self-end">
            <div className="hidden sm:flex items-center gap-3">
              <AccountMenu />
              <Link href="/cart" className="label-caps text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5">
                <span>BAG</span>
                <CartSummary />
              </Link>
            </div>

            <button
              onClick={toggle}
              aria-label="Toggle dark mode"
              className="h-9 w-9 grid place-items-center rounded-full border border-border-visible hover:bg-surface transition-colors"
            >
              {theme === 'dark' ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Toggle menu"
              className="sm:hidden h-9 w-9 grid place-items-center rounded-full border border-border-visible hover:bg-surface transition-colors"
            >
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-4 w-4">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-4 w-4">
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`fixed inset-0 z-40 sm:hidden transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!menuOpen}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeMenu} />

        <div
          className={`absolute top-0 right-0 h-full w-72 max-w-[85vw] bg-background border-l border-border transition-transform duration-300 ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
          style={{ transitionTimingFunction: 'var(--ease-nothing)' }}
        >
          <div className="flex flex-col h-full pt-20 px-6 pb-8">
            <nav className="flex flex-col gap-1">
              {nav.map((item) => {
                const active = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className={`px-4 py-3 rounded-card transition-colors text-sm ${active ? 'bg-surface text-text-display' : 'text-text-secondary hover:text-text-primary hover:bg-surface'}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <hr className="my-6 border-border" />

            <div className="flex flex-col gap-4">
              <Link
                href="/cart"
                onClick={closeMenu}
                className="label-caps text-text-secondary hover:text-text-primary transition-colors flex items-center justify-between px-4 py-3"
              >
                <span>Bag</span>
                <CartSummary />
              </Link>

              <div className="px-4 py-1">
                <AccountMenu />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
