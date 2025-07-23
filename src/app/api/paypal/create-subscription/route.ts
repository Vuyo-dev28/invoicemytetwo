// import { NextResponse } from "next/server";
// import { getPayPalAccessToken } from "@/utils/paypal";
 
// export const dynamic = "force-dynamic";

// const planIdMap: Record<string, string> = {
//   // Starter: "P-7E867494AN108783GNB6NY4Y",
//   Professional: "P-1VH34161DW222191VNB6OXSA"
// };

// export async function POST(req: Request) {
//   const { planId } = await req.json();

//   // If the planId is a friendly name, map it to the PayPal plan ID
//   const paypalPlanId = planIdMap[planId] || planId;

//   // Only allow valid PayPal plan IDs
//   if (!Object.values(planIdMap).includes(paypalPlanId)) {
//     return NextResponse.json({ error: "Invalid or unsupported plan." }, { status: 400 });
//   }

//   const accessToken = await getPayPalAccessToken();

//   const res = await fetch(`${process.env.PAYPAL_API_URL}/v1/billing/subscriptions`, {
//     method: "POST",
//     headers: {
//       "Authorization": `Bearer ${accessToken}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       plan_id: paypalPlanId,
//       application_context: {
//         brand_name: "InvoiceMyte",
//         return_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/subscription?subscribed=true`,
//         cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://invoicemytetwo.vercel.app'}/subscription?subscribed=false`,
//       },
//     }),
//   });

//   const data = await res.json();
//   const approvalUrl = data.links?.find((l: any) => l.rel === "approve")?.href;

//   if (!approvalUrl) {
//     console.log("PayPal response:", data);
//     return NextResponse.json({ error: data.message || "Failed to create PayPal subscription." }, { status: 500 });
//   }

//   return NextResponse.json({ approvalUrl });
// }
import { NextResponse } from "next/server";
import { getPayPalAccessToken } from "@/utils/paypal";

export const dynamic = "force-dynamic";

const planIdMap: Record<string, string> = {
  Starter: "P-7E867494AN108783GNB6NY4Y",
  Professional: "P-1VH34161DW222191VNB6OXSA",
};

const paypalErrorMap: Record<string, { code: string; message: string }> = {
  "CCREJECT-REFUSED": { code: "0500", message: "DO_NOT_HONOR" },
  "CCREJECT-SF": { code: "9500", message: "SUSPECTED_FRAUD. Try using another card. Do not retry the same card." },
  "CCREJECT-EC": { code: "5400", message: "EXPIRED_CARD" },
  "CCREJECT-IRC": { code: "5180", message: "INVALID_OR_RESTRICTED_CARD. Try using another card. Do not retry the same card." },
  "CCREJECT-IF": { code: "5120", message: "INSUFFICIENT_FUNDS" },
  "CCREJECT-LS": { code: "9520", message: "LOST_OR_STOLEN. Try using another card. Do not retry the same card." },
  "CCREJECT-IA": { code: "1330", message: "INVALID_ACCOUNT" },
  "CCREJECT-BANK_ERROR": { code: "5100", message: "GENERIC_DECLINE" },
  "CCREJECT-CVV_F": { code: "00N7", message: "CVV2_FAILURE_POSSIBLE_RETRY_WITH_CVV" },
};

export async function POST(req: Request) {
  const { planId } = await req.json();

  const paypalPlanId = planIdMap[planId] || planId;

  if (!Object.values(planIdMap).includes(paypalPlanId)) {
    return NextResponse.json({ error: "Invalid or unsupported plan." }, { status: 400 });
  }

  const accessToken = await getPayPalAccessToken();

  const res = await fetch(`${process.env.PAYPAL_API_URL}/v1/billing/subscriptions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      plan_id: paypalPlanId,
      application_context: {
        brand_name: "InvoiceMyte",
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/subscription?subscribed=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "https://invoicemytetwo.vercel.app"}/subscription?subscribed=false`,
      },
    }),
  });

  const data = await res.json();

  const approvalUrl = data.links?.find((l: any) => l.rel === "approve")?.href;

  if (!approvalUrl) {
    const errorName = data?.name;
    const mappedError = paypalErrorMap[errorName];

    if (mappedError) {
      return NextResponse.json(
        {
          error: mappedError.message,
          code: mappedError.code,
          raw: data,
        },
        { status: 400 }
      );
    }

    console.error("PayPal subscription creation error:", data);
    return NextResponse.json(
      {
        error: data.message || "Failed to create PayPal subscription.",
        raw: data,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ approvalUrl });
}
