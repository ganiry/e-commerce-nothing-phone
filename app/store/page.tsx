import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { getStoreProducts, getAllFilterFacets } from '@/lib/products';
import Filters from '../components/filters';
import type { ProductCategory } from '@/lib/db/schema';

type Category = 'all' | ProductCategory;

function toArr(v: string | string[] | undefined): string[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

export default async function StorePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const sp = await searchParams;
  const rawCategory = typeof sp.category === 'string' ? sp.category : 'all';
  const category: Category = ['all', 'phones', 'earbuds', 'headphones'].includes(rawCategory)
    ? (rawCategory as Category)
    : 'all';
  const colors = toArr(sp.color);
  const storage = toArr(sp.storage);

  const [productRows, facets] = await Promise.all([
    getStoreProducts({ category, colors, storage }),
    getAllFilterFacets(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-10 sm:py-14">
      <header className="mb-10">
        <p className="label-caps text-text-secondary mb-3">Marketplace</p>
        <h1 className="text-4xl sm:text-6xl font-display tracking-tight text-text-display">
          The store.
        </h1>
        <p className="mt-3 label-caps text-text-secondary">
          {productRows.length} {productRows.length === 1 ? 'product' : 'products'}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10">
        <Suspense fallback={<aside className="label-caps text-text-secondary" data-loading>[ LOADING FILTERS ]</aside>}>
          <Filters
            colorsByCategory={facets.colorsByCategory}
            storageByCategory={facets.storageByCategory}
            activeCategory={category}
            activeColors={colors}
            activeStorage={storage}
          />
        </Suspense>

        <section>
          {productRows.length === 0 ? (
            <div className="border border-border rounded-card p-16 text-center">
              <p className="font-display text-2xl text-text-secondary">[ No products ]</p>
              <p className="label-caps text-text-disabled mt-2">Adjust your filters to see results.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {productRows.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group border border-border rounded-card overflow-hidden bg-surface hover:border-border-visible transition-colors flex flex-col"
                >
                  <div className="relative aspect-[4/3] bg-surface-raised overflow-hidden dot-grid">
                    {p.heroImage && (
                      <Image
                        src={p.heroImage}
                        alt={p.name}
                        fill
                        className="object-contain p-6"
                      />
                    )}
                  </div>
                  <div className="p-5 flex flex-col gap-2">
                    <div className="flex items-baseline justify-between gap-3">
                      <h2 className="font-display text-xl tracking-tight text-text-display">{p.name}</h2>
                      <span className="font-mono text-sm text-text-primary">£{(p.basePrice / 100).toFixed(0)}</span>
                    </div>
                    {p.tagline && <p className="label-caps text-text-secondary leading-relaxed">{p.tagline}</p>}
                    <span className="mt-2 label-caps text-text-secondary group-hover:text-text-primary transition-colors">
                      View →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
