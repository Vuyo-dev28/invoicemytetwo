"use client";
import { useEffect, useState } from "react";

export default function SubscriptionPage() {
  const [sub, setSub] = useState<{ plan: string; status: string; renews_at: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSub = async () => {
      const res = await fetch("/api/subscription");
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Unknown error");
        return;
      }
      const data = await res.json();
      setSub(data);
    };
    fetchSub();
  }, []);

  const handleCancel = async () => {
    const res = await fetch("/api/subscription/cancel", { method: "POST" });
    const data = await res.json();
    if (data.success) {
      alert("Subscription cancelled.");
      window.location.reload();
    } else {
      alert(data.error || "Failed to cancel subscription.");
    }
  };

  const plans = [
    { id: "Free", name: "Free", description: "Basic features, no cost." },
    { id: "Starter", name: "Starter", description: "For growing businesses." },
    { id: "Professional", name: "Professional", description: "All features, best value." },
  ];

  const handleChangePlan = async (planId: string) => {
    const res = await fetch("/api/subscription/change", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    });
    const data = await res.json();
    if (data.success) {
      alert(`Subscription changed to ${planId}.`);
      window.location.reload();
    } else {
      alert(data.error || "Failed to change subscription.");
    }
  };

  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!sub) return <p>Loading subscription...</p>;

  return (
    <div>
      <h1>Your Subscription</h1>
      <p>Current Plan: <b>{sub.plan}</b></p>
      <p>Status: {sub.status}</p>
      <p>Renews: {sub.renews_at}</p>
      <div className="mt-6">
        <h2 className="font-bold mb-2">Change Plan</h2>
        <div className="flex flex-col gap-3">
          {plans.filter(plan => plan.id !== sub.plan).map(plan => (
            <button
              key={plan.id}
              onClick={() => handleChangePlan(plan.id)}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {plan.name}
              <div className="text-xs text-gray-700">{plan.description}</div>
            </button>
          ))}
        </div>
      </div>
      <button onClick={handleCancel} className="bg-red-600 text-white px-4 py-2 rounded mt-6">Cancel Subscription</button>
    </div>
  );
}
