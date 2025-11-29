import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { subscription_id } = await req.json();

  if (!subscription_id) return NextResponse.json({ error: "Missing subscription_id" }, { status: 400 });

  const PAYPAL_API_URL = process.env.PAYPAL_API_URL;
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX; // sandbox for dev
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

    if (response.status === 204) {
      return NextResponse.json({ success: true });
    }

    const data = await response.json();
    return NextResponse.json({ error: data }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
