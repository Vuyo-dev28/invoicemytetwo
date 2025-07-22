// // File: /app/api/webhooks/paypal/route.ts

// import { NextRequest } from "next/server";
// import { createClient } from "@supabase/supabase-js";

// // Force this API route to be dynamic (no caching)
// export const dynamic = "force-dynamic";

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// if (!supabaseUrl || !supabaseKey) {
//   throw new Error("Missing Supabase environment variables for server-side API");
// }

// const supabase = createClient(supabaseUrl, supabaseKey);

// // Simple debug logger — optional helper
// function logDebug(message: string, data?: any) {
//   if (data !== undefined) {
//     console.log(`[Webhook Debug] ${message}:`, JSON.stringify(data, null, 2));
//   } else {
//     console.log(`[Webhook Debug] ${message}`);
//   }
// }

// export async function POST(req: NextRequest) {
//   try {
//     const payload = await req.json();
//     const eventType = payload.event_type;

//     // Log webhook payload for debugging (console)
//     logDebug("Received PayPal webhook", payload);

//     // Save webhook payload to DB for debugging
//     const { error: logError } = await supabase.from("webhook_logs").insert({
//       event_type: eventType,
//       payload,
//     });

//     if (logError) {
//       console.error("Failed to log webhook payload:", logError);
//     }

//     if (eventType === "BILLING.PLAN.ACTIVATED") {
//       const resource = payload.resource;

//       const email = resource?.subscriber?.email_address;
//       const paypalSubId = resource?.id;
//       const startTime = resource?.start_time;
//       const endTime = resource?.billing_info?.final_payment_time;

//       if (!email || !paypalSubId || !startTime || !endTime) {
//         console.error("Missing required fields in payload");
//         return new Response("Invalid payload", { status: 400 });
//       }

//       // Find user by email
//       const { data: user, error: userError } = await supabase
//         .from("users")
//         .select("id")
//         .eq("email", email)
//         .single();

//       if (userError || !user) {
//         console.error("User not found for email:", email);
//         return new Response("User not found", { status: 404 });
//       }

//       // Update subscription
//       const { error: updateError } = await supabase
//         .from("subscriptions")
//         .update({
//           plan_id: "Professional",
//           status: "active",
//           subscription_id: paypalSubId,
//           start_date: new Date(startTime),
//           end_date: new Date(endTime),
//           updated_at: new Date().toISOString(),
//         })
//         .eq("user_id", user.id);

//       if (updateError) {
//         console.error("Failed to update subscription:", updateError);
//         return new Response("DB error", { status: 500 });
//       }

//       return new Response("Webhook processed", { status: 200 });
//     }

//     return new Response("Unhandled event type", { status: 400 });
//   } catch (err) {
//     console.error("Webhook error:", err);
//     return new Response("Internal Server Error", { status: 500 });
//   }
// }
// /app/api/test-webhook/route.ts
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

const WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID || "15987149KA077520D";

export async function POST(req: NextRequest) {
  try {
    const bodyText = await req.text();
    const body = JSON.parse(bodyText);

    const transmissionId = req.headers.get("paypal-transmission-id");
    const transmissionSig = req.headers.get("paypal-transmission-sig");

    console.log("📥 PAYPAL WEBHOOK TEST RECEIVED");
    console.log("✅ Webhook ID:", WEBHOOK_ID);
    console.log("🧾 Headers:");
    console.log("  - paypal-transmission-id:", transmissionId);
    console.log("  - paypal-transmission-sig:", transmissionSig);
    console.log("📦 Payload:", body);

    return new Response("Test webhook received successfully", { status: 200 });
  } catch (err) {
    console.error("❌ Webhook test failed:", err);
    return new Response("Test error", { status: 500 });
  }
}
