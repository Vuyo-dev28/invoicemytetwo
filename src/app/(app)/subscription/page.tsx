'use client';

import React from 'react';
import PayPalBtn from '../../../components/PayPalButton';

export default function SubscriptionPage() {
  const createSubscription = (data: any, actions: any) => {
    return actions.subscription.create({
      plan_id: 'P-81K74833NS848920GNEU2EKI', // Your PayPal plan ID
    });
  };

  const onApprove = (data: any) => {
    console.log('Subscription approved:', data);
    // Save subscription info to your DB here
  };

  const onError = (err: any) => {
    console.error('PayPal error:', err);
  };

  const onCancel = () => {
    console.log('Subscription canceled');
  };

  return (
    <div className="App">
      <h1 className="text-2xl font-bold mb-4">Subscribe</h1>
      <PayPalBtn
        createSubscription={createSubscription}
        onApprove={onApprove}
        onError={onError}
        onCancel={onCancel}
      />
    </div>
  );
}
