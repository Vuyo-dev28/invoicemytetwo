// app/subscription/page.tsx

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SubscriptionBlock from "./SubscriptionBlock";

export default async function SubscriptionPage() {
  // Create Supabase client on the server
  const supabase = createClient(cookies());

  // Get logged-in user
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login"); // Redirect if not logged in
  }

  // Check for active subscription
  const { data: subscription, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("status, current_period_end")
    .eq("user_id", user.id)
    .in("status", ["active", "trialing"])
    .single();

  if (subscriptionError && subscriptionError.code !== "PGRST116") {
    // PGRST116: No rows found, which is not an error in this case
    console.error("Error fetching subscription:", subscriptionError);
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Choose Your Plan
      </h1>

      {subscription &&
      (subscription.status === "active" ||
        subscription.status === "trialing") ? (
        <div className="text-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <h2 class="text-2xl font-semibold mb-4">Subscription Active</h2>
          <p className="text-lg text-gray-700 dark:text-gray-300">Your subscription is currently {subscription.status}.</p>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            Your current billing period ends on:{" "}
            {new Date(subscription.current_period_end).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <SubscriptionBlock userId={user.id} />
      )}
    </div>
  );
}
