import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

const now = () => Date.now();

export const users = sqliteTable('users', {
  id: text('id').primaryKey().notNull().$defaultFn(() => nanoid()),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  createdAt: integer('created_at').notNull().$defaultFn(now),
  updatedAt: integer('updated_at').notNull().$defaultFn(now),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey().notNull().$defaultFn(() => nanoid()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at').notNull(),
  createdAt: integer('created_at').notNull().$defaultFn(now),
});

export type ProductCategory = 'phones' | 'earbuds' | 'headphones';

export const products = sqliteTable('products', {
  id: text('id').primaryKey().notNull().$defaultFn(() => nanoid()),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  category: text('category').notNull().$type<ProductCategory>(),
  tagline: text('tagline'),
  description: text('description'),
  basePrice: integer('base_price').notNull(),
  heroImage: text('hero_image'),
  specs: text('specs', { mode: 'json' }).$type<Record<string, string>>(),
  featured: integer('featured').notNull().default(0),
  createdAt: integer('created_at').notNull().$defaultFn(now),
});

export const productVariants = sqliteTable(
  'product_variants',
  {
    id: text('id').primaryKey().notNull().$defaultFn(() => nanoid()),
    productId: text('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
    color: text('color').notNull(),
    storage: text('storage'),
    ram: text('ram'),
    price: integer('price').notNull(),
    stock: integer('stock').notNull().default(0),
    sku: text('sku').notNull().unique(),
    createdAt: integer('created_at').notNull().$defaultFn(now),
  },
  (t) => [uniqueIndex('variant_product_color_storage_ram').on(t.productId, t.color, t.storage, t.ram)],
);

export const cartItems = sqliteTable(
  'cart_items',
  {
    id: text('id').primaryKey().notNull().$defaultFn(() => nanoid()),
    userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
    variantId: text('variant_id').notNull().references(() => productVariants.id, { onDelete: 'cascade' }),
    quantity: integer('quantity').notNull().default(1),
    createdAt: integer('created_at').notNull().$defaultFn(now),
    updatedAt: integer('updated_at').notNull().$defaultFn(now),
  },
  (t) => [uniqueIndex('cart_user_variant').on(t.userId, t.variantId)],
);

export type User = typeof users.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Product = typeof products.$inferSelect;
export type ProductVariant = typeof productVariants.$inferSelect;
export type CartItem = typeof cartItems.$inferSelect;
