import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
export const revalidate = 0;


export async function POST(req: NextRequest) {
  const { subscription_id } = await req.json();

  if (!subscription_id) return NextResponse.json({ error: "Missing subscription_id" }, { status: 400 });

  const PAYPAL_API_URL = process.env.PAYPAL_API_URL;
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

  const basicAuth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");

  try {
    const response = await fetch(`${PAYPAL_API_URL}/v1/billing/subscriptions/${subscription_id}/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify({ reason: "User requested cancellation" }),
    });

    if (response.status !== 204) {
      const data = await response.json();
      return NextResponse.json({ error: data }, { status: 400 });
    }

    // Also mark the subscription as cancelled in our database.
    const supabase = createClient();

    // First try to update by paypal_subscription_id (preferred, explicit link).
    const { data: byPaypal, error: byPaypalError } = await supabase
      .from("subscriptions")
      .update({
        status: "CANCELLED",
        cancelled_at: new Date().toISOString(),
      })
      .eq("paypal_subscription_id", subscription_id);

    // If nothing was updated by paypal_subscription_id, fall back to the current user's ACTIVE/trialing sub.
    if (byPaypalError || !byPaypal || byPaypal.length === 0) {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!userError && user) {
        const { error: byUserError } = await supabase
          .from("subscriptions")
          .update({
            status: "CANCELLED",
            cancelled_at: new Date().toISOString(),
          })
          .eq("user_id", user.id)
          .in("status", ["ACTIVE", "active", "trialing"]);

        if (byUserError) {
          console.error("Error updating subscription status in DB by user_id:", byUserError);
          return NextResponse.json(
            { success: true, warning: "Subscription cancelled on PayPal, but failed to update status in database." },
            { status: 200 },
          );
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
