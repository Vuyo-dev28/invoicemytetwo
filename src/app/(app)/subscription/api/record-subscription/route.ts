import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server'; // adjust if your Supabase helper is elsewhere

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, profile_id, subscription } = body;

    if (!user_id || !subscription) {
      return NextResponse.json({ success: false, error: 'Missing user_id or subscription' }, { status: 400 });
    }

    const supabase = createClient(); // make sure it works server-side

    const { data, error } = await supabase
      .from('subscriptions')
      .insert([
        {
          user_id,
          profile_id: profile_id || null,
          paypal_subscription_id: subscription.id,
          plan_id: subscription.plan_id,
          status: subscription.status,
          current_period_start: subscription.current_period_start,
          current_period_end: subscription.current_period_end,
          next_billing_time: subscription.next_billing_time,
          last_payment_id: subscription.last_payment_id || null,
          last_payment_status: subscription.last_payment_status || null,
          raw: subscription.raw,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
