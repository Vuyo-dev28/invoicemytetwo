// utils/paypal.ts
import fetch from 'node-fetch';

const PAYPAL_API = process.env.PAYPAL_API_URL || 'https://api-m.paypal.com';
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID!;
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;
const WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID || '';

if (!CLIENT_ID || !CLIENT_SECRET) {
  // In server environment this should exist; otherwise fail fast when calling functions.
  // We don't throw now so local dev without env doesn't crash on import.
}

async function getAccessToken(): Promise<string> {
  const auth = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`PayPal token error ${res.status}: ${txt}`);
  }
  const data = await res.json();
  return data.access_token;
}

export async function createSubscription(planId: string) {
  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_API}/v1/billing/subscriptions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      plan_id: planId,
      application_context: {
        brand_name: 'Your App',
        locale: 'en-US',
        shipping_preference: 'NO_SHIPPING',
        user_action: 'SUBSCRIBE_NOW',
        // Return/cancel URLs are optional if you prefer server activation flow
        return_url: `${process.env.NEXT_PUBLIC_APP_URL || ''}/subscribe/return`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || ''}/subscribe/cancel`
      }
    })
  });

  const body = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(body));
  // PayPal returns links: find approval_url (user must approve on PayPal)
  const approveLink = (body.links || []).find((l: any) => l.rel === 'approve')?.href;
  return { raw: body, approveLink };
}

export async function getSubscription(subscriptionId: string) {
  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });
  const body = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(body));
  return body;
}

export async function cancelSubscription(subscriptionId: string, reason = 'User requested cancellation') {
  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ reason })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Cancel failed: ${res.status} ${txt}`);
  }
  return;
}

export async function updateSubscriptionPlan(subscriptionId: string, newPlanId: string) {
  const token = await getAccessToken();
  const patch = [
    {
      op: 'replace',
      path: '/plan/id',
      value: newPlanId
    }
  ];
  const res = await fetch(`${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  });

  if (res.status === 204 || res.ok) return;
  const txt = await res.text();
  throw new Error(`Update plan failed: ${res.status} ${txt}`);
}

/**
 * Verify webhook signature using PayPal API.
 * Must supply the raw body string and PayPal headers.
 */
export async function verifyWebhookSignature({
  transmissionId,
  timestamp,
  webhookId = WEBHOOK_ID,
  eventBody,
  certUrl,
  actualSignature,
  authAlgo
}: {
  transmissionId: string;
  timestamp: string;
  webhookId?: string;
  eventBody: any; // parsed JSON
  certUrl: string;
  actualSignature: string;
  authAlgo: string;
}) {
  const token = await getAccessToken();
  const res = await fetch(`${PAYPAL_API}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      transmission_id: transmissionId,
      transmission_time: timestamp,
      cert_url: certUrl,
      auth_algo: authAlgo,
      transmission_sig: actualSignature,
      webhook_id: webhookId,
      webhook_event: eventBody
    })
  });
  const body = await res.json();
  return body && body.verification_status === 'SUCCESS';
}
