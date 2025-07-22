import { NextResponse } from "next/server";
import { getPayPalAccessToken } from "@/utils/paypal";
 
export const dynamic = "force-dynamic";

const planIdMap: Record<string, string> = {
  Starter: "P-7E867494AN108783GNB6NY4Y",
  Professional: "P-1VH34161DW222191VNB6OXSA",    
};

export async function POST(req: Request) {
  const { planId } = await req.json();

  // If the planId is a friendly name, map it to the PayPal plan ID
  const paypalPlanId = planIdMap[planId] || planId;

  // Only allow valid PayPal plan IDs
  if (!Object.values(planIdMap).includes(paypalPlanId)) {
    return NextResponse.json({ error: "Invalid or unsupported plan." }, { status: 400 });
  }

  const accessToken = await getPayPalAccessToken();

  const res = await fetch(`${process.env.PAYPAL_API_URL}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      plan_id: paypalPlanId,
      application_context: {
        brand_name: "InvoiceMyte",
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://invoicemytetwo.vercel.app'}/subscription?subscribed=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://invoicemytetwo.vercel.app'}/subscription?subscribed=false`,
      },
    }),
  });

  const data = await res.json();
  const approvalUrl = data.links?.find((l: any) => l.rel === "approve")?.href;

  if (!approvalUrl) {
    console.log("PayPal response:", data);
    return NextResponse.json({ error: data.message || "Failed to create PayPal subscription." }, { status: 500 });
  }

  return NextResponse.json({ approvalUrl });
}
