'use client';

import { useState } from 'react';

export default function EmailConfirmationBanner({ email }: { email: string }) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const handleResend = async () => {
    // In a real implementation, you would call your backend to resend the confirmation email.
    alert(`A new confirmation email has been sent to ${email}.`);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 w-full mb-6 flex justify-between items-center">
      <div>
        <p className="font-bold">Confirm Your Email</p>
        <p>Please check your inbox at <strong>{email}</strong> to complete your registration. Click <button onClick={handleResend} className="underline">here</button> to resend.</p>
      </div>
      <button onClick={handleDismiss} className="text-yellow-700 font-bold text-2xl">&times;</button>
    </div>
  );
}