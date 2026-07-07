'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import VariantSelector from './variant-selector';

type VariantData = {
  id: string;
  color: string;
  storage: string | null;
  ram: string | null;
  price: number;
  stock: number;
  sku: string;
};

export default function ProductContent({
  slug,
  name,
  category,
  tagline,
  description,
  basePrice,
  variants,
  specs,
}: {
  slug: string;
  name: string;
  category: string;
  tagline: string | null;
  description: string | null;
  basePrice: number;
  variants: VariantData[];
  specs: Record<string, string> | null;
}) {
  const colors = useMemo(() => Array.from(new Set(variants.map((v) => v.color))), [variants]);
  const [selectedColor, setSelectedColor] = useState<string>(colors[0]);

  const imagePath = `/products/${slug}-${selectedColor.toLowerCase()}.png`;

  return (
    <>
      <section className="relative aspect-square bg-surface border border-border rounded-card overflow-hidden dot-grid flex items-center justify-center">
        <Image src={imagePath} alt={`${name} — ${selectedColor}`} fill className="object-contain p-10 sm:p-16" />
      </section>

      <section className="flex flex-col gap-6">
        <div>
          <p className="label-caps text-text-secondary mb-2 flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            {category}
          </p>
          <h1 className="text-4xl sm:text-5xl font-display tracking-tight text-text-display">{name}</h1>
          {tagline && <p className="mt-3 label-caps text-text-secondary leading-relaxed">{tagline}</p>}
        </div>

        {description && (
          <p className="text-text-secondary text-base leading-relaxed max-w-md">{description}</p>
        )}

        <VariantSelector
          productName={name}
          variants={variants}
          basePrice={basePrice}
          onColorChange={setSelectedColor}
        />

        {specs && Object.keys(specs).length > 0 && (
          <div className="border-t border-border pt-6">
            <p className="label-caps text-text-secondary mb-4">Specifications</p>
            <dl className="divide-y divide-border">
              {Object.entries(specs).map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between py-3 gap-4">
                  <dt className="label-caps text-text-secondary">{k}</dt>
                  <dd className="font-mono text-sm text-text-primary text-right">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </section>
    </>
  );
}
