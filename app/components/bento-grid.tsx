import Image from 'next/image';
import Link from 'next/link';

export default function BentoGrid() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 auto-rows-[200px] md:auto-rows-[230px] gap-4 md:gap-5">
      {/* 1. Hero */}
      <article className="relative overflow-hidden rounded-card border border-border bg-surface p-7 sm:p-9 flex flex-col justify-between col-span-1 row-span-1 md:col-span-2 md:row-span-2 lg:col-span-2 lg:row-span-2">
        <div className="relative z-10">
          <p className="label-caps text-text-secondary flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            New
          </p>
          <h2 className="mt-2 text-3xl sm:text-5xl font-display tracking-tight text-text-display">Phone (4a)</h2>
          <p className="mt-2 text-sm sm:text-base text-text-secondary max-w-xs">
            Up to 70x ultra zoom. Three 50 MP cameras. One unmistakable design.
          </p>
        </div>
        <div className="relative z-10 flex items-end justify-between">
          <span className="label-caps text-text-primary border border-border-visible rounded-full px-3 py-1.5">
            From £379
          </span>
          <Image
            src="/bento/phone-4a-white.png"
            alt="Nothing Phone (4a) in White"
            width={2048}
            height={2048}
            priority
            className="pointer-events-none absolute right-[-4%] bottom-[-8%] sm:right-[-2%] sm:bottom-[-6%] h-[78%] sm:h-[92%] w-auto object-contain"
          />
        </div>
      </article>

      {/* 2. Camera / ultra zoom */}
      <article className="relative overflow-hidden rounded-card border border-border col-span-1 row-span-1 md:col-span-2 lg:col-span-2 group">
        <Image src="/bento/camera.jpg" alt="Phone (4a) camera system" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 h-full p-6 sm:p-7 flex flex-col justify-end text-white">
          <h3 className="text-2xl sm:text-3xl font-display tracking-tight">70x Ultra Zoom</h3>
          <p className="mt-1 label-caps text-white/70">Triple 50 MP camera system · 2160p video</p>
        </div>
      </article>

      {/* 3. Battery */}
      <article className="relative overflow-hidden rounded-card bg-surface border border-border p-6 flex flex-col justify-between col-span-1 row-span-1 lg:col-span-1">
        <div className="label-caps text-text-secondary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
            <rect x="2" y="7" width="16" height="10" rx="2" />
            <path d="M22 11v2M6 10v4M10 10v4" strokeLinecap="round" />
          </svg>
          Battery
        </div>
        <div>
          <p className="text-4xl font-display tracking-tight text-text-display">
            5080<span className="text-base font-mono text-text-secondary"> mAh</span>
          </p>
          <p className="mt-1 label-caps text-text-secondary">50W fast charge · All-day power</p>
        </div>
      </article>

      {/* 4. Glyph Bar (tall) */}
      <article className="relative overflow-hidden rounded-card border border-border col-span-1 row-span-1 md:row-span-2 lg:col-span-1 lg:row-span-2 group">
        <Image src="/bento/glyph-bar.jpg" alt="Glyph Bar on Phone (4a)" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 h-full p-6 flex flex-col justify-end text-white">
          <h3 className="text-2xl font-display tracking-tight">Glyph Bar</h3>
          <p className="mt-1 label-caps text-white/70">Essential Notifications — at a glance, without unlocking.</p>
        </div>
      </article>

      {/* 5. Colorways */}
      <article className="relative overflow-hidden rounded-card bg-surface border border-border p-6 flex flex-col justify-between col-span-1 row-span-1 lg:col-span-1">
        <p className="label-caps text-text-secondary">Colorways</p>
        <div>
          <h3 className="text-2xl font-display tracking-tight text-text-display">Four finishes</h3>
          <div className="mt-4 flex items-center gap-3">
            <span title="White" className="h-7 w-7 rounded-full border border-border-visible" style={{ background: '#f2f2f2' }} />
            <span title="Black" className="h-7 w-7 rounded-full border border-border-visible" style={{ background: '#15161a' }} />
            <span title="Pink" className="h-7 w-7 rounded-full border border-border-visible" style={{ background: '#f3b9c8' }} />
            <span title="Blue" className="h-7 w-7 rounded-full border border-border-visible" style={{ background: '#9cc0e6' }} />
          </div>
        </div>
      </article>

      {/* 6. Nothing OS */}
      <article className="relative overflow-hidden rounded-card border border-border col-span-1 row-span-1 md:col-span-2 lg:col-span-2 group">
        <Image src="/bento/nothing-os.jpg" alt="Nothing OS 4.1 with Essential AI" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 h-full p-6 sm:p-7 flex flex-col justify-center text-white max-w-xs">
          <h3 className="text-2xl sm:text-3xl font-display tracking-tight">Nothing OS 4.1</h3>
          <p className="mt-1 label-caps text-white/70">Essential AI tools, built in · Android 16</p>
        </div>
      </article>

      {/* 7. Display */}
      <article className="relative overflow-hidden rounded-card bg-surface border border-border p-6 flex flex-col justify-between col-span-1 row-span-1 lg:col-span-1">
        <div className="label-caps text-text-secondary flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4">
            <rect x="3" y="3" width="18" height="18" rx="3" />
            <path d="M3 9h18" strokeLinecap="round" />
          </svg>
          Display
        </div>
        <div>
          <p className="text-4xl font-display tracking-tight text-text-display">
            6.78<span className="text-base font-mono text-text-secondary">″</span>
          </p>
          <p className="mt-1 label-caps text-text-secondary">AMOLED · 1224×2720</p>
        </div>
      </article>

      {/* 8. Design (press shot) */}
      <article className="relative overflow-hidden rounded-card border border-border col-span-1 row-span-1 lg:col-span-1 group">
        <Image src="/bento/press-shot.jpg" alt="Nothing Phone (4a) press image" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full p-5 flex flex-col justify-end text-white">
          <h3 className="text-xl font-display tracking-tight">Built different</h3>
        </div>
      </article>

      {/* 9. Specs / CTA */}
      <article className="relative overflow-hidden rounded-card bg-text-display text-background border border-border p-6 sm:p-7 flex flex-col justify-between col-span-1 row-span-1 md:col-span-2 lg:col-span-2">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="label-caps opacity-50">Chip</p>
            <p className="mt-1 font-mono text-sm">Snapdragon 7s Gen 4</p>
          </div>
          <div>
            <p className="label-caps opacity-50">RAM</p>
            <p className="mt-1 font-mono text-sm">8 / 12 GB</p>
          </div>
          <div>
            <p className="label-caps opacity-50">Storage</p>
            <p className="mt-1 font-mono text-sm">128 / 256 GB</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-2xl font-display tracking-tight">From £379</p>
          <Link
            href="/store"
            className="inline-flex items-center gap-2 rounded-full bg-background text-text-display px-5 py-2.5 label-caps hover:opacity-80 transition-opacity"
          >
            Discover
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </article>
    </section>
  );
}
