'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function CartCount() {
  const [count, setCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const compute = () => {
      try {
        const guest = JSON.parse(localStorage.getItem('guest_cart') ?? '[]') as { quantity: number }[];
        const n = guest.reduce((a, i) => a + i.quantity, 0);
        setCount(n);
      } catch {
        setCount(0);
      }
    };
    compute();
    window.addEventListener('storage', compute);
    window.addEventListener('cart:changed', compute);
    return () => {
      window.removeEventListener('storage', compute);
      window.removeEventListener('cart:changed', compute);
    };
  }, [pathname]);

  if (count === 0) return null;
  return <span className="text-accent">[{count}]</span>;
}
