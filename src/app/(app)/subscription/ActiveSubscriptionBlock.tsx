'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface ActiveSubscriptionProps {
  status: string;
  currentPeriodEnd: string | null;
  paypalSubscriptionId: string;
}

export default function ActiveSubscriptionBlock({
  status,
  currentPeriodEnd,
  paypalSubscriptionId,
}: ActiveSubscriptionProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleCancel = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const res = await fetch("/subscription/api/cancel-subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscription_id: paypalSubscriptionId }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Unable to cancel subscription. Please try again.");
      }

      setMessage("Your subscription has been cancelled.");
      // Refresh the page so the server re-checks subscription status
      // and shows the subscribe form instead of the active block.
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong while cancelling your subscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-4">
      <h2 className="text-2xl font-semibold">Subscription Active</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300">
        Your subscription is currently <span className="font-semibold capitalize">{status}</span>.
      </p>
      {currentPeriodEnd && (
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Your current billing period ends on:{" "}
          {new Date(currentPeriodEnd).toLocaleDateString()}
        </p>
      )}
      <div className="pt-4">
        <Button
          variant="destructive"
          onClick={handleCancel}
          disabled={loading}
        >
          {loading ? "Cancelling..." : "Cancel subscription"}
        </Button>
      </div>
      {message && (
        <p className="text-sm text-green-600 dark:text-green-400">{message}</p>
      )}
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}



