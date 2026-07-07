'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

type Category = 'all' | 'phones' | 'earbuds' | 'headphones';

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'phones', label: 'Phones' },
  { value: 'earbuds', label: 'Earbuds' },
  { value: 'headphones', label: 'Headphones' },
];

const COLOR_HEX: Record<string, string> = {
  White: '#f2f2f2',
  Black: '#15161a',
  Silver: '#d8d8d8',
  Pink: '#f3b9c8',
  Blue: '#9cc0e6',
  Yellow: '#f2d86b',
};

export default function Filters({
  colorsByCategory,
  storageByCategory,
  activeCategory,
  activeColors,
  activeStorage,
}: {
  colorsByCategory: Record<string, string[]>;
  storageByCategory: Record<string, string[]>;
  activeCategory: Category;
  activeColors: string[];
  activeStorage: string[];
}) {
  const router = useRouter();
  const params = useSearchParams();

  const update = useCallback(
    (next: { category?: Category; toggleColor?: string; toggleStorage?: string }) => {
      const sp = new URLSearchParams(params.toString());
      if (next.category && next.category !== 'all') sp.set('category', next.category);
      else if (next.category === 'all') sp.delete('category');

      // When category changes, reset color/storage filters.
      if (next.category && next.category !== activeCategory) {
        sp.delete('color');
        sp.delete('storage');
      }

      if (next.toggleColor) {
        const set = new Set(sp.getAll('color'));
        if (set.has(next.toggleColor)) set.delete(next.toggleColor);
        else set.add(next.toggleColor);
        sp.delete('color');
        Array.from(set).forEach((c) => sp.append('color', c));
      }
      if (next.toggleStorage) {
        const set = new Set(sp.getAll('storage'));
        if (set.has(next.toggleStorage)) set.delete(next.toggleStorage);
        else set.add(next.toggleStorage);
        sp.delete('storage');
        Array.from(set).forEach((s) => sp.append('storage', s));
      }

      const qs = sp.toString();
      router.push(qs ? `/store?${qs}` : '/store');
    },
    [router, params, activeCategory],
  );

  const isAll = activeCategory === 'all';
  const colorList = isAll ? Array.from(new Set(Object.values(colorsByCategory).flat())) : colorsByCategory[activeCategory] ?? [];
  const storageList = isAll ? [] : storageByCategory[activeCategory] ?? [];

  return (
    <aside className="space-y-8 lg:sticky lg:top-20">
      <div>
        <p className="label-caps text-text-secondary mb-3">Category</p>
        <div className="flex flex-col gap-1.5">
          {CATEGORIES.map((c) => {
            const active = activeCategory === c.value;
            return (
              <button
                key={c.value}
                onClick={() => update({ category: c.value })}
                className={`text-left label-caps px-3 py-2 rounded-full border transition-colors ${
                  active
                    ? 'bg-text-display text-background border-text-display'
                    : 'border-border-visible text-text-secondary hover:text-text-primary'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>
      </div>

      {colorList.length > 0 && (
        <div>
          <p className="label-caps text-text-secondary mb-3">Color</p>
          <div className="flex flex-col gap-2">
            {colorList.map((color) => {
              const active = activeColors.includes(color);
              return (
                <button
                  key={color}
                  onClick={() => update({ toggleColor: color })}
                  className={`flex items-center gap-3 text-left label-caps py-1.5 transition-colors ${
                    active ? 'text-text-display' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <span
                    className={`h-6 w-6 rounded-full border ${active ? 'border-text-display' : 'border-border-visible'}`}
                    style={{ background: COLOR_HEX[color] ?? '#999' }}
                  />
                  {color}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {storageList.length > 0 && (
        <div>
          <p className="label-caps text-text-secondary mb-3">Storage</p>
          <div className="flex flex-col gap-2">
            {storageList.map((s) => {
              const active = activeStorage.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => update({ toggleStorage: s })}
                  className={`text-left label-caps py-1.5 transition-colors ${
                    active ? 'text-text-display' : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <span className="mr-2">{active ? '[x]' : '[ ]'}</span>
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {(activeColors.length > 0 || activeStorage.length > 0) && (
        <button onClick={() => router.push('/store')} className="label-caps text-accent hover:opacity-80 transition-opacity">
          [ Clear filters ]
        </button>
      )}
    </aside>
  );
}
