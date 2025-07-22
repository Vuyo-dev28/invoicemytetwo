import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Needed for server-side access to RLS-protected tables
);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const headers = req.headers;

  console.log('🔔 PayPal Webhook Received:', body);

  if (body.event_type === 'PAYMENT.SALE.COMPLETED') {
    const sale = body.resource;
    const payerEmail = sale.payer?.payer_info?.email;

    if (!payerEmail) {
      console.warn('❌ No payer email found in PayPal webhook.');
      return NextResponse.json({ error: 'Missing payer email' }, { status: 400 });
    }

    // 1. Find user in Supabase by email
    const { data: user, error } = await supabase
      .from('profiles') // or wherever user emails are stored
      .select('id')
      .eq('email', payerEmail)
      .single();

    if (error || !user) {
      console.warn('❌ No matching user for email:', payerEmail);
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 2. Update their subscription
    const { error: updateError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: user.id,
        plan_id: 'Professional',
        status: 'active',
        start_date: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'user_id', // ensures update if user already has a subscription
      });

    if (updateError) {
      console.error('❌ Failed to update subscription:', updateError.message);
      return NextResponse.json({ error: 'Subscription update failed' }, { status: 500 });
    }

    console.log('✅ Subscription set to Professional for user:', payerEmail);
    return NextResponse.json({ status: 'success' }, { status: 200 });
  }

  return NextResponse.json({ status: 'Unhandled event type' }, { status: 200 });
}
