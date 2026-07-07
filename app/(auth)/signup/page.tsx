import { Suspense } from 'react';
import SignupForm from './signup-form';

export default function SignupPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-sm px-5 py-24"><p className="label-caps text-text-secondary" data-loading>[ LOADING ]</p></div>}>
      <SignupForm />
    </Suspense>
  );
}
