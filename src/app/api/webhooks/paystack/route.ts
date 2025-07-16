
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

// This is your Paystack secret key. It's crucial to keep this secret.
// It's best to store this in an environment variable.
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || 'sk_test_7db9078faeca663a9e0e3a9e74fbf28902d0f18b';

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-paystack-signature');
  const body = await req.text();

  // Verify the webhook signature
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET_KEY)
    .update(body)
    .digest('hex');

  if (hash !== signature) {
    console.error("Webhook Error: Invalid signature");
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
  }

  // Parse the event payload
  const event = JSON.parse(body);

  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  try {
    switch (event.event) {
      // Handles both one-time payments and subscription first payments
      case 'charge.success': {
        const session = event.data;
        const metadata = session.metadata || {};
        const userEmail = session.customer.email;
        const planId = metadata.plan_id;
        
        // Find user by email
        const { data: user, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('email', userEmail)
          .single();

        if (userError || !user) {
            console.error(`Webhook Error: User not found with email ${userEmail}`);
            break;
        }

        // Create or update subscription record
        const subscriptionData = {
          user_id: user.id,
          plan_id: planId,
          status: 'active',
          paystack_customer_code: session.customer.customer_code,
          // If it's part of a subscription, the code will be present
          paystack_subscription_code: session.subscription?.subscription_code, 
          // For one-time payments or first sub payment, calculate expiry
          // This is a simplified example. You might have more complex logic.
          current_period_ends_at: new Date(
            new Date().setFullYear(new Date().getFullYear() + (metadata.billing_cycle === 'yearly' ? 1 : 0),
            new Date().getMonth() + (metadata.billing_cycle === 'monthly' ? 1 : 0))
          ).toISOString(),
        };

        const { error: upsertError } = await supabase
            .from('subscriptions')
            .upsert(subscriptionData, { onConflict: 'user_id' });
        
        if (upsertError) {
            console.error('Webhook Error: Failed to upsert subscription.', upsertError);
        } else {
            console.log(`Subscription created/updated for ${userEmail}`);
        }
        break;
      }
      
      // Handle subscription cancellations
      case 'subscription.disable': {
        const session = event.data;
        const { error } = await supabase
          .from('subscriptions')
          .update({ status: 'canceled', current_period_ends_at: new Date().toISOString() })
          .eq('paystack_subscription_code', session.subscription_code);

        if (error) {
            console.error('Webhook Error: Failed to update subscription to canceled.', error);
        } else {
            console.log(`Subscription canceled for ${session.customer.email}`);
        }
        break;
      }

      default:
        console.log(`Unhandled Paystack event type: ${event.event}`);
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ message: 'Webhook processing error' }, { status: 400 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
