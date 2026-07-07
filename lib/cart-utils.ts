export type CartRow = {
  id: string;
  variantId: string;
  quantity: number;
  productId: string;
  productName: string;
  productSlug: string;
  category: string;
  color: string;
  storage: string | null;
  ram: string | null;
  unitPrice: number;
  heroImage: string | null;
};

export type GuestCartItem = { variantId: string; quantity: number };

export function formatVariantLabel(
  productName: string,
  variant: { color: string; storage: string | null; ram: string | null },
) {
  const parts = [productName, variant.color];
  if (variant.ram) parts.push(variant.ram);
  if (variant.storage) parts.push(variant.storage);
  return parts.join(' — ');
}

export function variantLabelFromRow(row: {
  productName: string;
  color: string;
  storage: string | null;
  ram: string | null;
}) {
  return formatVariantLabel(row.productName, { color: row.color, storage: row.storage, ram: row.ram });
}

export function cartTotal(rows: { unitPrice: number; quantity: number }[]) {
  return rows.reduce((sum, r) => sum + r.unitPrice * r.quantity, 0);
}
