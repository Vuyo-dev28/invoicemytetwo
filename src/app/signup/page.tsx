'use client';

import { useSearchParams } from 'next/navigation';
import { useActionState } from 'react';

import { signUp } from './actions';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function SignUpPage() {
  const searchParams = useSearchParams();
  const message = searchParams.get('message');
  const [state, formAction] = useActionState(signUp, null);  // <-- fixed here

  return (
    <main className="flex items-center justify-center min-h-screen px-4">
      <form action={formAction} className="w-full max-w-md space-y-6 bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold text-center">Create an Account</h1>

        {message && (
          <p className="text-red-500 text-sm text-center">{message}</p>
        )}

        <div>
          <label htmlFor="email" className="block mb-1 font-medium">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-1 font-medium">Password</label>
          <input
            name="password"
            type="password"
            required
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <Button  className="w-full bg-black text-white py-2 rounded">
          Sign Up
        </Button>

        <p className="text-sm text-center">
          Already have an account?{' '}
          <Link href="/login" className="underline text-blue-600">Log in</Link>
        </p>
      </form>
    </main>
  );
}
