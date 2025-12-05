// app/subscription/page.tsx

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import SubscriptionBlock from "./SubscriptionBlock";
import ActiveSubscriptionBlock from "./ActiveSubscriptionBlock";

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

  // Check for existing active / trialing subscription
  const { data: subscription, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("status, current_period_end, paypal_subscription_id")
    .eq("user_id", user.id)
    .in("status", ["ACTIVE", "active", "trialing"])
    .maybeSingle();

  if (subscriptionError && subscriptionError.code !== "PGRST116") {
    // PGRST116: No rows found, which is not an error in this case
    console.error("Error fetching subscription:", subscriptionError);
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Choose Your Plan
      </h1>

      {subscription ? (
        <ActiveSubscriptionBlock
          status={subscription.status}
          currentPeriodEnd={subscription.current_period_end}
          paypalSubscriptionId={subscription.paypal_subscription_id}
        />
      ) : (
        <SubscriptionBlock userId={user.id} />
      )}
    </div>
  );
}
