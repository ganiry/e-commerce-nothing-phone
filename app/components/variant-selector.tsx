'use client';

import { useMemo, useState } from 'react';
import { useAddToCart } from '../lib/cart-client';

const COLOR_HEX: Record<string, string> = {
  White: '#f2f2f2',
  Black: '#15161a',
  Silver: '#d8d8d8',
  Pink: '#f3b9c8',
  Blue: '#9cc0e6',
  Yellow: '#f2d86b',
};

type Variant = {
  id: string;
  color: string;
  storage: string | null;
  ram: string | null;
  price: number;
  stock: number;
  sku: string;
};

export default function VariantSelector({
  productName,
  variants,
  basePrice,
  onColorChange,
}: {
  productName: string;
  variants: Variant[];
  basePrice: number;
  onColorChange?: (color: string) => void;
}) {
  const { add, pending, result } = useAddToCart();

  const colors = useMemo(() => Array.from(new Set(variants.map((v) => v.color))), [variants]);
  const storages = useMemo(() => Array.from(new Set(variants.map((v) => v.storage).filter(Boolean))) as string[], [variants]);
  const rams = useMemo(() => Array.from(new Set(variants.map((v) => v.ram).filter(Boolean))) as string[], [variants]);

  const [color, setColor] = useState(colors[0]);
  const [storage, setStorage] = useState(storages[0] ?? null);
  const [ram, setRam] = useState(rams[0] ?? null);

  const selected = useMemo(() => {
    return (
      variants.find((v) => v.color === color && v.storage === storage && v.ram === ram) ??
      variants.find((v) => v.color === color) ??
      variants[0]
    );
  }, [variants, color, storage, ram]);

  const hasStorage = storages.length > 0;
  const hasRam = rams.length > 0 && storages.length > 0;
  const inStock = selected?.stock !== 0;

  const label = [productName, selected?.color, selected?.ram, selected?.storage].filter(Boolean).join(' — ');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="label-caps text-text-secondary mb-3">Color</p>
        <div className="flex items-center gap-3 flex-wrap">
          {colors.map((c) => {
            const active = c === color;
            return (
              <button
                key={c}
                onClick={() => { setColor(c); onColorChange?.(c); }}
                aria-label={c}
                className={`h-8 w-8 rounded-full border-2 transition-colors ${active ? 'border-text-display' : 'border-border-visible'}`}
                style={{ background: COLOR_HEX[c] ?? '#999' }}
              />
            );
          })}
        </div>
      </div>

      {hasStorage && (
        <div>
          <p className="label-caps text-text-secondary mb-3">Storage</p>
          <div className="flex items-center gap-2 flex-wrap">
            {storages.map((s) => {
              const active = s === storage;
              return (
                <button
                  key={s}
                  onClick={() => setStorage(s)}
                  className={`label-caps px-4 py-2.5 rounded-full border transition-colors ${
                    active ? 'bg-text-display text-background border-text-display' : 'border-border-visible text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {hasRam && (
        <div>
          <p className="label-caps text-text-secondary mb-3">RAM</p>
          <div className="flex items-center gap-2 flex-wrap">
            {rams.map((r) => {
              const active = r === ram;
              return (
                <button
                  key={r}
                  onClick={() => setRam(r)}
                  className={`label-caps px-4 py-2.5 rounded-full border transition-colors ${
                    active ? 'bg-text-display text-background border-text-display' : 'border-border-visible text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-baseline justify-between border-t border-border pt-6">
        <div>
          <p className="label-caps text-text-secondary">Price</p>
          <p className="font-display text-3xl tracking-tight text-text-display">
            £{((selected?.price ?? basePrice) / 100).toFixed(0)}
          </p>
        </div>
        <p className="label-caps text-text-secondary">{inStock ? 'In stock' : 'Sold out'}</p>
      </div>

      <button
        onClick={() => selected && add(selected.id, 1)}
        disabled={pending || !inStock}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-text-display text-background px-6 py-3.5 label-caps hover:opacity-80 transition-opacity disabled:opacity-40"
      >
        {pending ? '[ Adding... ]' : 'Add to bag'}
      </button>

      {result && (
        <p className="label-caps" data-result>
          {result.ok
            ? result.mode === 'server'
              ? '[ Added to bag ]'
              : '[ Added — sign in to save your bag ]'
            : `[ ERROR: ${result.error ?? 'failed'} ]`}
        </p>
      )}

      <div className="border-t border-border pt-6">
        <p className="label-caps text-text-secondary mb-2">Selected</p>
        <p className="font-mono text-sm text-text-primary">{label}</p>
      </div>
    </div>
  );
}
