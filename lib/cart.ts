import { and, eq } from 'drizzle-orm';
import { db } from './db';
import { cartItems, productVariants, products } from './db/schema';
import type { Product, ProductVariant } from './db/schema';
import type { CartRow, GuestCartItem } from './cart-utils';

export type { CartRow, GuestCartItem };

export async function getCart(userId: string): Promise<CartRow[]> {
  const rows = await db
    .select({
      id: cartItems.id,
      variantId: cartItems.variantId,
      quantity: cartItems.quantity,
      productId: products.id,
      productName: products.name,
      productSlug: products.slug,
      category: products.category,
      color: productVariants.color,
      storage: productVariants.storage,
      ram: productVariants.ram,
      unitPrice: productVariants.price,
      heroImage: products.heroImage,
    })
    .from(cartItems)
    .innerJoin(productVariants, eq(cartItems.variantId, productVariants.id))
    .innerJoin(products, eq(productVariants.productId, products.id))
    .where(eq(cartItems.userId, userId));

  return rows;
}

export async function addToCart(userId: string, variantId: string, quantity: number) {
  const [existing] = await db
    .select()
    .from(cartItems)
    .where(and(eq(cartItems.userId, userId), eq(cartItems.variantId, variantId)))
    .limit(1);

  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: existing.quantity + quantity, updatedAt: Date.now() })
      .where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({ userId, variantId, quantity });
  }
}

export async function setQuantity(userId: string, variantId: string, quantity: number) {
  if (quantity <= 0) {
    await db
      .delete(cartItems)
      .where(and(eq(cartItems.userId, userId), eq(cartItems.variantId, variantId)));
    return;
  }
  await db
    .update(cartItems)
    .set({ quantity, updatedAt: Date.now() })
    .where(and(eq(cartItems.userId, userId), eq(cartItems.variantId, variantId)));
}

export async function removeFromCart(userId: string, variantId: string) {
  await db
    .delete(cartItems)
    .where(and(eq(cartItems.userId, userId), eq(cartItems.variantId, variantId)));
}

export async function clearCart(userId: string) {
  await db.delete(cartItems).where(eq(cartItems.userId, userId));
}

export async function resolveGuestItems(items: GuestCartItem[]): Promise<CartRow[]> {
  const rows: CartRow[] = [];
  for (const item of items) {
    if (!item.variantId || item.quantity <= 0) continue;
    const detailed = await getVariantById(item.variantId);
    if (!detailed || !detailed.product) continue;
    rows.push({
      id: `guest-${item.variantId}`,
      variantId: detailed.id,
      quantity: item.quantity,
      productId: detailed.product.id,
      productName: detailed.product.name,
      productSlug: detailed.product.slug,
      category: detailed.product.category,
      color: detailed.color,
      storage: detailed.storage,
      ram: detailed.ram,
      unitPrice: detailed.price,
      heroImage: detailed.product.heroImage,
    });
  }
  return rows;
}

export async function mergeGuestCart(userId: string, items: GuestCartItem[]) {
  for (const item of items) {
    if (!item.variantId || item.quantity <= 0) continue;
    await addToCart(userId, item.variantId, item.quantity);
  }
}

export function formatVariantLabel(productName: string, variant: { color: string; storage: string | null; ram: string | null }) {
  const parts = [productName, variant.color];
  if (variant.ram) parts.push(variant.ram);
  if (variant.storage) parts.push(variant.storage);
  return parts.join(' — ');
}

export { variantLabelFromRow, cartTotal } from './cart-utils';

export type DetailedVariant = ProductVariant & { product: Product | null };

export async function getVariantById(variantId: string): Promise<DetailedVariant | null> {
  const [variant] = await db.select().from(productVariants).where(eq(productVariants.id, variantId)).limit(1);
  if (!variant) return null;
  const [product] = await db.select().from(products).where(eq(products.id, variant.productId)).limit(1);
  return { ...variant, product: product ?? null };
}
