'use client';

import { useEffect, useRef } from 'react';

interface PayPalBtnProps {
  createSubscription: (data: any, actions: any) => any;
  onApprove: (data: any) => void;
  onError?: (err: any) => void;
  onCancel?: () => void;
}

export default function PayPalBtn({ createSubscription, onApprove, onError, onCancel }: PayPalBtnProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  useEffect(() => {
    if (!paypalRef.current) return;
    if (!clientId) {
      console.error('PayPal client ID is missing!');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription`;
    script.async = true;

    script.onload = () => {
      // @ts-ignore
      window.paypal.Buttons({
        createSubscription,
        onApprove,
        onError,
        onCancel,
      }).render(paypalRef.current);
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [clientId, createSubscription, onApprove, onError, onCancel]);

  return <div ref={paypalRef}></div>;
}
