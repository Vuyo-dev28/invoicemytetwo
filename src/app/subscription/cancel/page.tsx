'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function SubscriptionCancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
      <div className="bg-white p-10 rounded-lg shadow-lg text-center">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Subscription Canceled</h1>
        <p className="text-gray-600 mb-6">Your subscription process was canceled. You have not been charged.</p>
        <Link href="/subscription" className="bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors">
          View Subscription Options
        </Link>
      </div>
    </div>
  );
} 