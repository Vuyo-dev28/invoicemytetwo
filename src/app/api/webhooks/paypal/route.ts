// File: /app/api/webhooks/paypal/route.ts

import { NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    const eventType = payload.event_type;
    const resource = payload.resource;

    if (eventType === "BILLING.SUBSCRIPTION.ACTIVATED") {
      const email = resource?.subscriber?.email_address;
      const planId = resource?.plan_id; // optional: you can map this if you use multiple PayPal plans
      const paypalSubId = resource?.id;
      const startTime = resource?.start_time;
      const endTime = resource?.billing_info?.final_payment_time;

      if (!email || !paypalSubId || !startTime || !endTime) {
        console.error("Missing required fields in payload");
        return new Response("Invalid payload", { status: 400 });
      }

      // Step 1: Find user by email
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("id")
        .eq("email", email)
        .single();

      if (userError || !user) {
        console.error("User not found for email:", email);
        return new Response("User not found", { status: 404 });
      }

      // Step 2: Update subscriptions
      const { error: updateError } = await supabase
        .from("subscriptions")
        .update({
          plan_id: "Professional",
          status: "active",
          subscription_id: paypalSubId,
          start_date: new Date(startTime),
          end_date: new Date(endTime),
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Failed to update subscription:", updateError);
        return new Response("DB error", { status: 500 });
      }

      return new Response("Webhook processed", { status: 200 });
    }

    return new Response("Unhandled event type", { status: 400 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
