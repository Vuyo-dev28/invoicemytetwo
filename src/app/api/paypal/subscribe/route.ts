
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { add } from 'date-fns';

const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || 'https://api-m.sandbox.paypal.com';
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_APP_SECRET = process.env.PAYPAL_APP_SECRET;

// Function to get PayPal access token
async function getPayPalAccessToken() {
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString('base64');
    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: 'grant_type=client_credentials',
    });

    const data = await response.json();
    if (!response.ok) {
        console.error('PayPal auth error:', data);
        throw new Error('Failed to get PayPal access token');
    }
    return data.access_token;
}

export async function POST(req: NextRequest) {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_APP_SECRET) {
        return NextResponse.json({ message: 'PayPal environment variables not configured.' }, { status: 500 });
    }

    const { subscriptionID, planId } = await req.json();

    if (!subscriptionID || !planId) {
        return NextResponse.json({ message: 'Missing subscriptionID or planId' }, { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ message: 'User not authenticated' }, { status: 401 });
    }

    try {
        const accessToken = await getPayPalAccessToken();

        // Verify the subscription with PayPal
        const response = await fetch(`${PAYPAL_API_BASE}/v1/billing/subscriptions/${subscriptionID}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        const subscriptionDetails = await response.json();

        if (!response.ok) {
            console.error("PayPal subscription verification failed:", subscriptionDetails);
            return NextResponse.json({ message: 'Could not verify PayPal subscription.' }, { status: 400 });
        }
        
        const status = subscriptionDetails.status.toLowerCase() === 'active' ? 'active' : 'incomplete';
        const billingInfo = subscriptionDetails.billing_info;
        const nextBillingTime = billingInfo?.next_billing_time;
        
        const subscriptionData = {
            user_id: user.id,
            plan_id: planId,
            status: status as 'active' | 'incomplete',
            provider_subscription_id: subscriptionID,
            next_payment_date: nextBillingTime ? new Date(nextBillingTime).toISOString() : add(new Date(), { years: 100 }).toISOString(), // Fallback
        };

        const { error } = await supabase.from('subscriptions').upsert(subscriptionData, { onConflict: 'user_id' });

        if (error) {
            console.error('Supabase subscription upsert error:', error);
            return NextResponse.json({ message: 'Failed to save subscription to database.' }, { status: 500 });
        }

        return NextResponse.json({ message: 'Subscription processed successfully' });

    } catch (error: any) {
        console.error("Error processing subscription:", error);
        return NextResponse.json({ message: 'Internal server error', error: error.message }, { status: 500 });
    }
}

    