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
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID!;
  const secret = process.env.PAYPAL_CLIENT_SECRET!;
  const base64 = Buffer.from(`${clientId}:${secret}`).toString("base64");

  const res = await fetch("https://api-m.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Authorization": `Basic ${base64}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`PayPal token fetch failed: ${errorText}`);
  }

  const json = await res.json();
  return json.access_token;
}

export async function POST(req: NextRequest) {
  try {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID!;
    if (!webhookId) {
      return new Response("Missing PAYPAL_WEBHOOK_ID env variable", { status: 500 });
    }

    // Read raw body text (needed for verification)
    const bodyText = await req.text();

    // PayPal sends verification info in headers prefixed with paypal-
    const headers = Object.fromEntries(req.headers.entries());

    // Get OAuth token to verify signature
    const accessToken = await getPayPalAccessToken();

    // Verify webhook signature
    const verificationRes = await fetch(
      "https://api-m.paypal.com/v1/notifications/verify-webhook-signature",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          auth_algo: headers["paypal-auth-algo"],
          cert_url: headers["paypal-cert-url"],
          transmission_id: headers["paypal-transmission-id"],
          transmission_sig: headers["paypal-transmission-sig"],
          transmission_time: headers["paypal-transmission-time"],
          webhook_id: webhookId,
          webhook_event: JSON.parse(bodyText),
        }),
      }
    );

    const verification = await verificationRes.json();

    console.log("PayPal webhook verification result:", verification);

    if (verification.verification_status !== "SUCCESS") {
      console.error("Webhook verification failed");
      return new Response("Invalid webhook signature", { status: 400 });
    }

    // Parse webhook event JSON
    const event = JSON.parse(bodyText);
    console.log("Verified webhook event:", event);

    if (event.event_type === "BILLING.PLAN.ACTIVATED") {
      // Your logic here, e.g., update database
      console.log("Billing plan activated:", event.resource.id);
      // TODO: update your DB or call supabase here
    }

    return new Response("Webhook processed", { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
