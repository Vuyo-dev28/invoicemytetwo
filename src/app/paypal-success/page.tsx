'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PaypalSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the subscription page with a success query parameter
    router.push('/subscription?paypal=success');
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        {/* You can add a loading spinner or message here if desired */}
        <h1 className="text-xl font-bold text-gray-800">Redirecting...</h1>
      </div>
    </div>
  );
}