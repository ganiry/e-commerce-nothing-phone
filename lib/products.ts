import { eq, inArray, and } from 'drizzle-orm';
import { db } from './db';
import { products, productVariants } from './db/schema';
import type { ProductCategory } from './db/schema';

export type ProductWithVariants = {
  id: string;
  slug: string;
  name: string;
  category: ProductCategory;
  tagline: string | null;
  description: string | null;
  basePrice: number;
  heroImage: string | null;
  specs: Record<string, string> | null;
  featured: number;
  variants: {
    id: string;
    color: string;
    storage: string | null;
    ram: string | null;
    price: number;
    stock: number;
    sku: string;
  }[];
};

export async function getAllProducts() {
  const rows = await db.select().from(products).orderBy(products.basePrice);
  return rows;
}

export async function getProductsByCategory(category: ProductCategory | 'all') {
  if (category === 'all') return getAllProducts();
  return db.select().from(products).where(eq(products.category, category)).orderBy(products.basePrice);
}

export async function getFeaturedProduct() {
  const [row] = await db.select().from(products).where(eq(products.featured, 1)).limit(1);
  if (row) return row;
  const [fallback] = await db.select().from(products).limit(1);
  return fallback;
}

export async function getProductBySlug(slug: string): Promise<ProductWithVariants | null> {
  const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  if (!product) return null;
  const variants = await db
    .select({
      id: productVariants.id,
      color: productVariants.color,
      storage: productVariants.storage,
      ram: productVariants.ram,
      price: productVariants.price,
      stock: productVariants.stock,
      sku: productVariants.sku,
    })
    .from(productVariants)
    .where(eq(productVariants.productId, product.id));

  return { ...product, variants };
}

export type StoreFilter = {
  category?: ProductCategory | 'all';
  colors?: string[];
  storage?: string[];
};

export async function getStoreProducts(filter: StoreFilter) {
  const productRows = await getProductsByCategory(filter.category ?? 'all');

  if (!filter.colors?.length && !filter.storage?.length) return productRows;

  const productIds = productRows.map((p) => p.id);
  if (productIds.length === 0) return [];

  const conditions = [inArray(productVariants.productId, productIds)];
  if (filter.colors?.length) conditions.push(inArray(productVariants.color, filter.colors));
  if (filter.storage?.length) conditions.push(inArray(productVariants.storage, filter.storage));

  const matching = await db
    .select({ productId: productVariants.productId })
    .from(productVariants)
    .where(and(...conditions));

  const matchingIds = new Set(matching.map((m) => m.productId));
  return productRows.filter((p) => matchingIds.has(p.id));
}

export async function getHomeProducts(limit: number = 4) {
  return db.select().from(products).orderBy(products.basePrice).limit(limit);
}

export async function getAllFilterFacets() {
  const rows = await db
    .select({
      category: products.category,
      color: productVariants.color,
      storage: productVariants.storage,
    })
    .from(productVariants)
    .innerJoin(products, eq(productVariants.productId, products.id));

  const colorsByCategory: Record<string, string[]> = {};
  const storageByCategory: Record<string, string[]> = {};
  for (const r of rows) {
    colorsByCategory[r.category] ??= [];
    if (!colorsByCategory[r.category].includes(r.color)) colorsByCategory[r.category].push(r.color);
    if (r.storage) {
      storageByCategory[r.category] ??= [];
      if (!storageByCategory[r.category].includes(r.storage)) storageByCategory[r.category].push(r.storage);
    }
  }
  return { colorsByCategory, storageByCategory };
}
