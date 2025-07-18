
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

// IMPORTANT: Yoco does not provide webhook signature verification in the same way
// as Stripe or Paystack. The documentation recommends securing your webhook
// endpoint via other means (e.g., IP whitelisting, obscurity).
// This is a simplified example.

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();

    // Basic validation
    if (event.event_type !== 'charge.succeeded') {
        console.log(`Received unhandled Yoco event type: ${event.event_type}`);
        return NextResponse.json({ received: true });
    }
    
    const chargeData = event.payload;
    const chargeId = chargeData.id;
    const customerEmail = chargeData.metadata?.email; // Assuming you pass email in metadata

    if (!chargeId || !customerEmail) {
        console.error("Webhook Error: Missing charge ID or customer email in payload.");
        return NextResponse.json({ message: 'Missing required data in webhook payload.' }, { status: 400 });
    }

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    // Find user by email
    const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', customerEmail)
        .single();

    if (userError || !user) {
        console.error(`Webhook Error: User not found with email ${customerEmail}`);
        // Still return 200 to Yoco to prevent retries for a user that doesn't exist.
        return NextResponse.json({ message: 'User not found, but acknowledged.' });
    }

    // Check if this charge has already been processed for a subscription
    const { data: existingSubscription, error: subCheckError } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('yoco_charge_id', chargeId)
        .single();
    
    if (subCheckError && subCheckError.code !== 'PGRST116') { // Ignore "no rows found" error
        console.error('Webhook Error: Failed to check for existing subscription.', subCheckError);
        return NextResponse.json({ message: 'Database error while checking subscription.' }, { status: 500 });
    }

    if (existingSubscription) {
        console.log(`Webhook Info: Charge ${chargeId} has already been processed. Skipping.`);
        return NextResponse.json({ message: 'Already processed.' });
    }

    // Since this is a webhook, it's for reconciliation. We might update a subscription
    // status if it was pending, or create it if the initial API call failed.
    // For simplicity here, we'll log that we would update it.
    
    console.log(`Reconciliation via webhook: Payment for charge ${chargeId} from ${customerEmail} succeeded. We would update the subscription status here.`);
    
    // In a real scenario, you would update the `next_payment_date` and ensure the status is `active`.
    // const { error: updateError } = await supabase
    //   .from('subscriptions')
    //   .update({ status: 'active', yoco_charge_id: chargeId, /* ... update next_payment_date ... */ })
    //   .eq('user_id', user.id);
    
    // if (updateError) {
    //   console.error("Webhook Error: Failed to update subscription.", updateError);
    //   return NextResponse.json({ message: 'Failed to update subscription in DB.' }, { status: 500 });
    // }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ message: 'Webhook processing error' }, { status: 400 });
  }
}

    