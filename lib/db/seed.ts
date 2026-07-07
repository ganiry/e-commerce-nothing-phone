import { sql } from 'drizzle-orm';
import { db } from './index';
import { products, productVariants, cartItems } from './schema';
import { nanoid } from 'nanoid';

type VariantSeed = { color: string; storage?: string; ram?: string; price: number };

type ProductSeed = {
  slug: string;
  name: string;
  category: 'phones' | 'earbuds' | 'headphones';
  tagline: string;
  description: string;
  basePrice: number;
  heroImage: string;
  featured?: boolean;
  specs: Record<string, string>;
  variants: VariantSeed[];
};

const SEED: ProductSeed[] = [
  {
    slug: 'phone-4a',
    name: 'Phone (4a)',
    category: 'phones',
    tagline: 'Up to 70x ultra zoom · Triple 50 MP cameras · Glyph Bar',
    description:
      'A triple 50 MP camera with up to 70x ultra zoom, a Glyph Bar that keeps you in the moment, and Nothing OS 4.1 with Essential AI.',
    basePrice: 37900,
    heroImage: '/products/phone-4a-white.png',
    featured: true,
    specs: {
      Display: '6.78" AMOLED · 1224×2720',
      Chip: 'Snapdragon 7s Gen 4',
      RAM: '8 / 12 GB',
      Storage: '128 / 256 GB',
      Battery: '5080 mAh · 50W charge',
      Camera: 'Triple 50 MP · 2160p video',
      OS: 'Nothing OS 4.1 · Android 16',
    },
    variants: [
      { color: 'White', storage: '128GB', ram: '8GB', price: 37900 },
      { color: 'White', storage: '256GB', ram: '8GB', price: 42900 },
      { color: 'White', storage: '256GB', ram: '12GB', price: 47900 },
      { color: 'Black', storage: '128GB', ram: '8GB', price: 37900 },
      { color: 'Black', storage: '256GB', ram: '8GB', price: 42900 },
      { color: 'Black', storage: '256GB', ram: '12GB', price: 47900 },
      { color: 'Pink', storage: '128GB', ram: '8GB', price: 37900 },
      { color: 'Pink', storage: '256GB', ram: '12GB', price: 47900 },
      { color: 'Blue', storage: '256GB', ram: '12GB', price: 47900 },
    ],
  },
  {
    slug: 'phone-4a-pro',
    name: 'Phone (4a) Pro',
    category: 'phones',
    tagline: "World's first 140x ultra zoom · Sony sensor · Essential AI",
    description:
      "The world's first 140x ultra zoom. A three-camera system with a Sony sensor. Nothing OS with Essential AI tools.",
    basePrice: 51900,
    heroImage: '/products/phone-4a-pro-white.png',
    specs: {
      Display: '6.78" AMOLED',
      Chip: 'Snapdragon 8s Gen 4',
      Zoom: '140x Ultra Zoom',
      Camera: 'Triple 50 MP · Sony sensor',
      OS: 'Nothing OS 4.1 · Essential AI',
    },
    variants: [
      { color: 'Silver', storage: '128GB', ram: '8GB', price: 51900 },
      { color: 'Silver', storage: '256GB', ram: '12GB', price: 56900 },
      { color: 'Black', storage: '128GB', ram: '8GB', price: 51900 },
      { color: 'Black', storage: '256GB', ram: '12GB', price: 56900 },
      { color: 'Pink', storage: '256GB', ram: '12GB', price: 56900 },
    ],
  },
  {
    slug: 'phone-3',
    name: 'Phone (3)',
    category: 'phones',
    tagline: 'New Glyph Interface · Four 50 MP cameras · Essential Search',
    description:
      'A new Glyph Interface, new Essential Search, and a four 50MP camera system. The flagship Nothing phone.',
    basePrice: 69900,
    heroImage: '/products/phone-3-white.png',
    specs: {
      Display: 'AMOLED · 1224×2720',
      Camera: 'Four 50 MP system',
      Glyph: 'New Glyph Interface',
      Search: 'Essential Search',
      OS: 'Nothing OS',
    },
    variants: [
      { color: 'White', storage: '256GB', ram: '12GB', price: 69900 },
      { color: 'White', storage: '512GB', ram: '16GB', price: 79900 },
      { color: 'Black', storage: '256GB', ram: '12GB', price: 69900 },
      { color: 'Black', storage: '512GB', ram: '16GB', price: 79900 },
    ],
  },
  {
    slug: 'ear-3',
    name: 'Ear (3)',
    category: 'earbuds',
    tagline: 'Super Mic · 45 dB ANC · 24-bit Hi-Res LDAC',
    description:
      'Breakthrough Super Mic. 45 dB noise cancelling. 24-bit Hi-Res LDAC audio. Cut out background noise.',
    basePrice: 14900,
    heroImage: '/products/ear-3-white.png',
    specs: {
      ANC: '45 dB Noise Cancelling',
      Audio: '24-bit Hi-Res LDAC',
      Mic: 'Super Mic',
    },
    variants: [
      { color: 'White', price: 14900 },
      { color: 'Black', price: 14900 },
    ],
  },
  {
    slug: 'headphone-a',
    name: 'Headphone (a)',
    category: 'headphones',
    tagline: '5 days of power · Hi-Res LDAC · Tactile controls',
    description:
      'Up to 5 days of power. Hi-Res and LDAC certified. Custom tactile controls. With Charli xcx.',
    basePrice: 14900,
    heroImage: '/products/headphone-a-white.png',
    specs: {
      Battery: 'Up to 5 days',
      HiRes: 'LDAC certified',
      Controls: 'Custom tactile',
    },
    variants: [
      { color: 'White', price: 14900 },
      { color: 'Black', price: 14900 },
      { color: 'Pink', price: 14900 },
      { color: 'Yellow', price: 14900 },
    ],
  },
  {
    slug: 'headphone-1',
    name: 'Headphone (1)',
    category: 'headphones',
    tagline: '80 hours · Sound by KEF · Adaptive ANC',
    description:
      'Up to 80 hours of playback. Sound by KEF. Real-time adaptive ANC.',
    basePrice: 24900,
    heroImage: '/products/headphone-1-white.png',
    specs: {
      Battery: 'Up to 80 hours',
      Sound: 'Tuned by KEF',
      ANC: 'Real-time adaptive',
    },
    variants: [
      { color: 'White', price: 24900 },
      { color: 'Black', price: 24900 },
    ],
  },
];

export async function seed() {
  console.log('[seed] starting...');
  // Clear dependent cart items + variants + products (users/sessions preserved).
  await db.delete(cartItems);
  await db.delete(productVariants);
  await db.delete(products);

  for (const p of SEED) {
    const productId = nanoid();
    await db.insert(products).values({
      id: productId,
      slug: p.slug,
      name: p.name,
      category: p.category,
      tagline: p.tagline,
      description: p.description,
      basePrice: p.basePrice,
      heroImage: p.heroImage,
      specs: p.specs,
      featured: p.featured ? 1 : 0,
    });

    for (const v of p.variants) {
      await db.insert(productVariants).values({
        id: nanoid(),
        productId,
        color: v.color,
        storage: v.storage ?? null,
        ram: v.ram ?? null,
        price: v.price,
        stock: 25,
        sku: `${p.slug}-${v.color}${v.ram ? `-${v.ram}` : ''}${v.storage ? `-${v.storage}` : ''}`
          .toLowerCase()
          .replace(/\s/g, ''),
      });
    }
  }

  const [count] = await db
    .select({ c: sql`count(*)` })
    .from(products);
  console.log('[seed] inserted', count?.c, 'products · done');
}

seed().catch((err) => {
  console.error('[seed] failed:', err);
  process.exit(1);
});
