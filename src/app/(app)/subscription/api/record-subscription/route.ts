import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user_id, profile_id, subscription } = body;

    console.log('Received subscription data:', body);

    if (!user_id || !subscription) {
      console.error('Missing user_id or subscription');
      return NextResponse.json({ success: false, error: 'Missing user_id or subscription' }, { status: 400 });
    }

    const supabase = createClient(cookies());

    const subscriptionData = {
      user_id,
      profile_id: profile_id || null,
      paypal_subscription_id: subscription.id,
      plan_id: subscription.plan_id,
      status: subscription.status,
      current_period_start: subscription.billing_info?.last_payment?.time ? new Date(subscription.billing_info.last_payment.time).toISOString() : new Date().toISOString(),
      current_period_end: subscription.billing_info?.next_billing_time ? new Date(subscription.billing_info.next_billing_time).toISOString() : null,
      next_billing_time: subscription.billing_info?.next_billing_time ? new Date(subscription.billing_info.next_billing_time).toISOString() : null,
      cancelled_at: subscription.status === 'CANCELLED' ? new Date().toISOString() : null,
      raw: subscription,
    };

    console.log('Inserting subscription data:', subscriptionData);

    const { data, error } = await supabase
      .from('subscriptions')
      .insert([subscriptionData])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    console.log('Successfully inserted subscription:', data);

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
