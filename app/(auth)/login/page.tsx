import { Suspense } from 'react';
import LoginForm from './login-form';

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-sm px-5 py-24"><p className="label-caps text-text-secondary" data-loading>[ LOADING ]</p></div>}>
      <LoginForm />
    </Suspense>
  );
}
