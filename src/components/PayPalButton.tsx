'use client';

import { useEffect, useRef, useState } from "react";

interface Subscription {
  id: string;
  status: string;
  plan_id: string;
  current_period_start?: string;
  current_period_end?: string;
  next_billing_time?: string;
  raw?: any;
}

interface PayPalBtnProps {
  userId: string;
}

export default function PayPalBtn({ userId }: PayPalBtnProps) {
  const paypalRef = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [saving, setSaving] = useState(false);

  const createSubscription = (data: any, actions: any) => {
    return actions.subscription.create({
      plan_id: "P-2UA04610MV6127005NEUUSII",
    });
  };

  const onApprove = async (data: any) => {
    console.log("Subscription approved:", data);

    const subscriptionData: Subscription = {
      id: data.subscriptionID,
      plan_id: "P-2UA04610MV6127005NEUUSII",
      status: "ACTIVE",
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      next_billing_time: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      raw: data,
    };

    setSubscription(subscriptionData);

    setSaving(true);
    try {
      const res = await fetch("/subscription/api/record-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          //profile_id: "PROFILE_ID_HERE",
          subscription: subscriptionData,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        console.error("Error saving subscription:", json.error || res.status);
      } else {
        console.log("Subscription saved to DB:", json.data);
      }
    } catch (err) {
      console.error("Error saving subscription:", err);
    } finally {
      setSaving(false);
    }
  };

  const onError = (err: any) => console.error("PayPal error:", err);
  const onCancel = () => console.log("Subscription canceled");

  // Load PayPal script and render buttons
  useEffect(() => {
    if (!paypalRef.current || !clientId) return;
  
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&vault=true&intent=subscription`;
    script.async = true;
  
    script.onload = () => {
      // @ts-ignore
      if (window.paypal && paypalRef.current) {
        window.paypal.Buttons({
          createSubscription,
          onApprove,
          onError,
          onCancel,
        }).render(paypalRef.current);
      }
    };
  
    document.body.appendChild(script);
  
    return () => {
      // Remove PayPal buttons safely
      if (paypalRef.current) {
        paypalRef.current.innerHTML = "";
      }
      // Remove script safely
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [clientId]);
  

  return (
    <div>
      {subscription ? (
        <div className="p-4 border rounded shadow-sm bg-green-50">
          <p><strong>Subscription Active!</strong></p>
          <p>Subscription ID: {subscription.id}</p>
          <p>Status: {subscription.status}</p>
          <p>Plan: {subscription.plan_id}</p>
          <p>Next Billing: {subscription.next_billing_time}</p>
        </div>
      ) : (
        <div ref={paypalRef}></div>
      )}
      {saving && <p className="mt-4 text-gray-500">Saving subscription...</p>}
    </div>
  );
}
