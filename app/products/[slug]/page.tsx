import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllProducts, getProductBySlug } from '@/lib/products';
import ProductContent from '@/app/components/product-content';

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-5 sm:px-8 py-10 sm:py-14">
      <nav className="label-caps text-text-secondary mb-8 flex items-center gap-2">
        <Link href="/store" className="hover:text-text-primary transition-colors">Store</Link>
        <span>/</span>
        <span className="text-text-primary">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        <ProductContent
          slug={product.slug}
          name={product.name}
          category={product.category}
          tagline={product.tagline}
          description={product.description}
          basePrice={product.basePrice}
          variants={product.variants}
          specs={product.specs}
        />
      </div>
    </div>
  );
}
