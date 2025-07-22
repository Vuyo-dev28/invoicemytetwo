'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; // Import supabase client

export default function PaypalSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const updateSubscription = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Assuming you have a subscription table with user_id and status columns
        const { data, error } = await supabase
          .from('subscriptions')
          .update({ status: 'active' }) // Update status and payment method
          .eq('user_id', user.id); // Ensure you update the correct user's subscription

        if (error) {
          console.error('Error updating subscription:', error);
          // Optionally handle the error, e.g., display an error message
        } else {
          console.log('Subscription updated successfully:', data);
        }
      } else {
        console.error('No user found, cannot update subscription.');
        // Handle the case where the user is not authenticated
      }
    };

    updateSubscription(); // Call the function to update the subscription

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