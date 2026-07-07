import Image from 'next/image';
import Link from 'next/link';
import BentoGrid from './components/bento-grid';
import VideoAd from './components/video-ad';
import { getHomeProducts } from '@/lib/products';

export default async function Home() {
  const products = await getHomeProducts(4);
  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-10 sm:py-14">
      {/* Hero */}
      <section className="rounded-card bg-surface border border-border p-7 sm:p-12 mb-8 sm:mb-10">
        <div className="flex items-center gap-2 mb-6">
          <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          <span className="label-caps text-text-secondary">Nothing(R) · 2026</span>
        </div>
        <div className="max-w-xl">
          <p className="label-caps text-text-secondary mb-3">Phone (4a)</p>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display tracking-tight leading-[1.05] text-balance text-text-display">
            Built different.
            <br />
            <span className="text-text-secondary">So is your phone.</span>
          </h1>
          <Link
            href="/store"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-text-display text-background px-5 py-3 label-caps hover:opacity-80 transition-opacity"
          >
            Shop Phone (4a)
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Video ad */}
      <div className="mb-12 sm:mb-16">
        <VideoAd />
      </div>

      {/* Title block */}
      <section className="mb-8 sm:mb-10">
        <p className="label-caps text-text-secondary mb-3">Phone (4a)</p>
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-display tracking-tight text-text-display text-balance leading-[1.05]">
          Built different.
          <br className="hidden sm:block" />
          <span className="text-text-secondary">So is your phone.</span>
        </h2>
        <p className="mt-4 sm:mt-5 max-w-2xl text-base sm:text-lg text-text-secondary text-balance">
          A triple 50 MP camera with up to 70x ultra zoom, a Glyph Bar that keeps you in the moment, and Nothing OS 4.1 with Essential AI. From £379.
        </p>
      </section>

      <BentoGrid />

      {/* Featured products */}
      <section className="mt-16 sm:mt-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="label-caps text-text-secondary mb-3">The lineup</p>
            <h2 className="text-3xl sm:text-5xl font-display tracking-tight text-text-display">
              Products.
            </h2>
          </div>
          <Link
            href="/store"
            className="label-caps text-text-secondary hover:text-text-primary transition-colors hidden sm:inline-block"
          >
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {products.map((p) => (
            <Link
              key={p.id}
              href={`/products/${p.slug}`}
              className="group border border-border rounded-card overflow-hidden bg-surface hover:border-border-visible transition-colors flex flex-col"
            >
              <div className="relative aspect-[4/3] bg-surface-raised overflow-hidden dot-grid">
                {p.heroImage && (
                  <Image src={p.heroImage} alt={p.name} fill className="object-contain p-6" />
                )}
              </div>
              <div className="p-5 flex flex-col gap-2">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl tracking-tight text-text-display">{p.name}</h3>
                  <span className="font-mono text-sm text-text-primary">£{(p.basePrice / 100).toFixed(0)}</span>
                </div>
                {p.tagline && <p className="label-caps text-text-secondary leading-relaxed line-clamp-2">{p.tagline}</p>}
                <span className="mt-2 label-caps text-text-secondary group-hover:text-text-primary transition-colors">
                  Shop →
                </span>
              </div>
            </Link>
          ))}
        </div>
        <Link
          href="/store"
          className="mt-6 label-caps text-text-secondary hover:text-text-primary transition-colors sm:hidden inline-block"
        >
          View all →
        </Link>
      </section>
    </div>
  );
}
