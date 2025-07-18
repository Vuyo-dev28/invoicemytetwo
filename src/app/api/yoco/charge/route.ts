
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { add } from 'date-fns';

const YOCO_SECRET_KEY = process.env.YOCO_SECRET_KEY;

export async function POST(req: NextRequest) {
  if (!YOCO_SECRET_KEY) {
    console.error("Yoco secret key is not set in environment variables.");
    return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
  }

  const { token, amountInCents, planName, billingCycle } = await req.json();

  if (!token || !amountInCents || !planName || !billingCycle) {
    return NextResponse.json({ message: 'Missing required payment information.' }, { status: 400 });
  }

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ message: 'User not authenticated.' }, { status: 401 });
  }

  try {
    // 1. Call Yoco's Charge API
    const yocoResponse = await fetch('https://online.yoco.com/v1/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Auth-Secret-Key': YOCO_SECRET_KEY,
      },
      body: JSON.stringify({
        token: token,
        amountInCents: amountInCents,
        currency: 'ZAR',
      }),
    });

    const yocoData = await yocoResponse.json();

    if (!yocoResponse.ok || yocoData.status !== 'successful') {
      console.error("Yoco charge failed:", yocoData);
      const errorMessage = yocoData.displayMessage || 'Payment failed at the gateway.';
      return NextResponse.json({ message: errorMessage }, { status: 402 });
    }

    // 2. Record the subscription in your database
    const now = new Date();
    const nextPaymentDate = add(now, {
        years: billingCycle === 'yearly' ? 1 : 0,
        months: billingCycle === 'monthly' ? 1 : 0,
    });

    const subscriptionData = {
      user_id: user.id,
      plan_id: planName, // 'Starter', 'Professional'
      status: 'active',
      yoco_charge_id: yocoData.id,
      next_payment_date: nextPaymentDate.toISOString(),
    };
    
    const { error: upsertError } = await supabase
      .from('subscriptions')
      .upsert(subscriptionData, { onConflict: 'user_id' });

    if (upsertError) {
      console.error('Error upserting subscription:', upsertError);
      // Even if DB fails, payment was successful. This needs reconciliation.
      return NextResponse.json({ message: 'Payment was successful, but there was an issue activating your subscription. Please contact support.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Subscription activated successfully.' });

  } catch (error: any) {
    console.error('Internal server error:', error);
    return NextResponse.json({ message: 'An internal error occurred.' }, { status: 500 });
  }
}

    