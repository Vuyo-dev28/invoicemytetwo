import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { plan_id } = await req.json();

  if (!plan_id) return NextResponse.json({ error: "Missing plan_id" }, { status: 400 });

  const PAYPAL_API_URL = process.env.PAYPAL_API_URL;
  const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID; // sandbox for live
  const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

  const basicAuth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");

  try {
    const response = await fetch(`${PAYPAL_API_URL}/v1/billing/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${basicAuth}`,
      },
      body: JSON.stringify({ plan_id }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
