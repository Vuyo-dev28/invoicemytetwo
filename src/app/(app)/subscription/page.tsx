"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

export default function SubscriptionPage() {
  const searchParams = useSearchParams();
  const router = useRouter(); // Get the router instance
  const [sub, setSub] = useState<{ plan: string; status: string; renews_at: string } | null>(null);
  const [error, setError] = useState("");
  const plans = [
  {
    id: "Free",
    name: "Free",
    price: "$0",
    billing: "/ month • Billed yearly",
    oldPrice: "",
    features: [
      "3 Invoices",
      "3 Estimates",
      "3 Credit Notes",
      "3 Clients",
      "3 Items",
    ],
    highlight: true,
  },
  {
    id: "Professional",
    name: "Professional",
    price: "$7.50",
    oldPrice: "$52.00/month",
    billing: "/ month • Billed yearly • Save 86%",
    features: [
      "Unlimited Invoices",
      "Unlimited Estimates",
      "Unlimited Credit Notes",
      "Unlimited Clients",
      "Unlimited Items",
      "AI Email Assistant",
      "Ask AI",
      "AI Calendar Planner",
    ],
    highlight: false,
  },
];


  useEffect(() => {
    const subscribed = searchParams.get("subscribed");

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

    const markSubscribed = async () => {
      const res = await fetch("/api/subscription/activate", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        console.log("Subscription marked as active, reloading page.");
        // Remove the 'subscribed' parameter from the URL
        router.replace("/subscription");
      } else {
        console.error("Failed to mark subscription:", data.error);
      }
    };

    if (subscribed === "true") {
      markSubscribed(); // 👈 Update DB when redirected back
    }

    fetchSub();
  }, [searchParams, router]);

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

  // const plans = [
  //   { id: "Free", name: "Free", description: "Basic features, no cost." },
  //   { id: "Starter", name: "Starter", description: "For growing businesses." },
  //   { id: "Professional", name: "Professional", description: "All features, best value." },
  // ];

  const handleChangePlan = async (planId: string) => {
    // For Free plan, just update in DB (no payment)
    if (planId === "Free") {
      const res = await fetch("/api/subscription/change", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Subscription changed to Free.");
        window.location.reload();
      } else {
        alert(data.error || "Failed to change subscription.");
      }
      return;
    }

    // For paid plans, initiate PayPal flow
    const res = await fetch("/api/paypal/create-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ planId }),
    });
    const data = await res.json();
    if (data.approvalUrl) {
       localStorage.setItem("selectedPlan", planId); // ✅ Save before redirect
      window.location.href = data.approvalUrl; // Redirect to PayPal
    } else {
      alert(data.error || "Failed to initiate PayPal payment.");
    }
  };

  if (error) return <p className="text-red-600">Error: {error}</p>;
  if (!sub) return <p>Loading subscription...</p>;

return (
  <div className="max-w-4xl mx-auto px-6 py-12">
    <h1 className="text-3xl font-bold mb-6 text-center">Your Subscription</h1>

    <div className="bg-white shadow-lg rounded-xl p-6 mb-8 border border-gray-200">
      <p className="text-lg">
        <span className="font-medium text-gray-600">Current Plan:</span>{" "}
        <span className="font-semibold text-blue-700">{sub.plan}</span>
      </p>
      <p className="text-lg">
        <span className="font-medium text-gray-600">Status:</span> {sub.status}
      </p>
      <p className="text-lg">
        <span className="font-medium text-gray-600">Renews:</span> {sub.renews_at}
      </p>

      <button
        onClick={handleCancel}
        className="mt-6 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
      >
        Cancel Subscription
      </button>
    </div>

    <h2 className="text-2xl font-bold mb-4 text-center">Change Plan</h2>
    <div className="grid md:grid-cols-2 gap-6">
      {plans
        .filter((plan) => plan.id !== sub.plan)
        .map((plan) => (
          <div
            key={plan.id}
            className={`border rounded-xl p-6 shadow-sm ${
              plan.highlight ? "border-blue-500" : "border-gray-300"
            }`}
          >
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 flex justify-between items-center">
                {plan.name}
                {plan.highlight && (
                  <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                    Most Popular
                  </span>
                )}
              </h3>
              <div className="text-3xl font-bold text-blue-700">{plan.price}</div>
              <div className="text-sm text-gray-500">
                {plan.oldPrice && (
                  <span className="line-through mr-1">{plan.oldPrice}</span>
                )}
                {plan.billing}
              </div>
            </div>

            <ul className="text-sm text-gray-700 mb-4 list-disc list-inside space-y-1">
              {plan.features.map((feature, i) => (
                <li key={i}>{feature}</li>
              ))}
            </ul>

            <button
              onClick={() => handleChangePlan(plan.id)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Choose {plan.name}
            </button>
          </div>
        ))}
    </div>
  </div>
);


}
