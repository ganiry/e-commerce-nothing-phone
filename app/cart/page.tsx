import { getSessionUser } from '@/lib/auth';
import { getCart } from '@/lib/cart';
import CartView from '../components/cart-view';
import GuestCart from '../components/guest-cart';

export default async function CartPage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10 sm:py-14">
        <header className="mb-10">
          <p className="label-caps text-text-secondary mb-3">Your bag</p>
          <h1 className="text-4xl sm:text-5xl font-display tracking-tight text-text-display">Bag</h1>
          <p className="mt-3 label-caps text-text-secondary">Guest — sign in to persist your bag.</p>
        </header>
        <GuestCart />
      </div>
    );
  }

  const rows = await getCart(user.id);

  return (
    <div className="mx-auto max-w-3xl px-5 sm:px-8 py-10 sm:py-14">
      <header className="mb-10">
        <p className="label-caps text-text-secondary mb-3">Your bag</p>
        <h1 className="text-4xl sm:text-5xl font-display tracking-tight text-text-display">Bag</h1>
        <p className="mt-3 label-caps text-text-secondary">Signed in as {user.email}</p>
      </header>
      <CartView initialRows={rows} authenticated />
    </div>
  );
}
