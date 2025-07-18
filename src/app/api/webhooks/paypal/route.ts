
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import type { SubscriptionStatus } from '@/types';
import { add } from 'date-fns';

// This is a simplified webhook handler.
// For production, you MUST verify the webhook signature from PayPal.
// https://developer.paypal.com/docs/api/webhooks/v1/#verify-webhook-signature
// This requires fetching your webhook ID from the PayPal developer dashboard.

export async function POST(req: NextRequest) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    try {
        const event = await req.json();
        const eventType = event.event_type;
        const resource = event.resource;

        console.log(`Received PayPal webhook event: ${eventType}`);

        switch (eventType) {
            case 'BILLING.SUBSCRIPTION.ACTIVATED':
            case 'BILLING.SUBSCRIPTION.RENEWED':
            case 'PAYMENT.SALE.COMPLETED': // For subscription payments
                await updateSubscriptionStatus(resource, 'active', supabase);
                break;

            case 'BILLING.SUBSCRIPTION.CANCELLED':
                await updateSubscriptionStatus(resource, 'canceled', supabase);
                break;

            case 'BILLING.SUBSCRIPTION.SUSPENDED':
            case 'BILLING.SUBSCRIPTION.PAYMENT.FAILED':
                await updateSubscriptionStatus(resource, 'past_due', supabase);
                break;
                
            default:
                console.log(`Unhandled event type: ${eventType}`);
        }

        return NextResponse.json({ received: true });

    } catch (error: any) {
        console.error("Error processing PayPal webhook:", error.message);
        return NextResponse.json({ message: 'Webhook processing error' }, { status: 400 });
    }
}

async function updateSubscriptionStatus(resource: any, status: SubscriptionStatus, supabase: any) {
    // The subscription ID is in different places depending on the event
    const subscriptionId = resource.id || resource.billing_agreement_id;

    if (!subscriptionId) {
        console.warn("Could not find subscription ID in webhook resource.");
        return;
    }

    const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('id, next_payment_date')
        .eq('provider_subscription_id', subscriptionId)
        .single();
    
    if (error || !subscription) {
        console.error(`Subscription with provider_id ${subscriptionId} not found.`);
        return;
    }

    const updatePayload: { status: SubscriptionStatus; next_payment_date?: string } = { status };
    
    // For renewals, you might want to fetch the new next_payment_date from PayPal
    // For simplicity, we can just extend it based on the plan.
    if (status === 'active' && subscription.next_payment_date) {
        // This is a simplification. A robust solution would fetch the plan interval from DB.
        // Assuming yearly for now if the date is far out.
        const nextDate = new Date(subscription.next_payment_date);
        if ((nextDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24) > 40) {
             updatePayload.next_payment_date = add(nextDate, { years: 1 }).toISOString();
        } else {
             updatePayload.next_payment_date = add(nextDate, { months: 1 }).toISOString();
        }
    }

    const { error: updateError } = await supabase
        .from('subscriptions')
        .update(updatePayload)
        .eq('provider_subscription_id', subscriptionId);

    if (updateError) {
        console.error(`Failed to update subscription ${subscriptionId} to ${status}:`, updateError.message);
    } else {
        console.log(`Successfully updated subscription ${subscriptionId} to status: ${status}`);
    }
}

    