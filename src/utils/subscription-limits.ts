import { createClient } from '@/utils/supabase/client';

type DocumentTypeForLimits = 'Invoice' | 'Estimate' | 'Credit note' | 'Delivery note' | 'Purchase order';

type LimitCheckResult = {
  ok: boolean;
  message?: string;
};

const DEFAULT_LIMITS = {
  max_invoices: 2,
  max_estimates: 2,
  max_delivery_notes: 2,
  max_credit_notes: 2,
  max_purchase_orders: 2,
  max_clients: 2,
};

async function hasActivePlan(userId: string): Promise<boolean> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('subscriptions')
    .select('status')
    .eq('user_id', userId)
    .eq('status', 'ACTIVE')
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    // PGRST116: no rows found
    console.error('Error checking subscription status:', error);
  }

  return data?.status === 'ACTIVE';
}

async function getUserLimits(userId: string) {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('user_limits')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user limits:', error);
  }

  return {
    ...DEFAULT_LIMITS,
    ...(data || {}),
  } as typeof DEFAULT_LIMITS;
}

export async function checkDocumentLimit(userId: string, documentType: DocumentTypeForLimits): Promise<LimitCheckResult> {
  const supabase = createClient();

  // If the user has an ACTIVE subscription, no limits apply.
  if (await hasActivePlan(userId)) {
    return { ok: true };
  }

  const limits = await getUserLimits(userId);

  let limitField: keyof typeof DEFAULT_LIMITS;
  switch (documentType) {
    case 'Invoice':
      limitField = 'max_invoices';
      break;
    case 'Estimate':
      limitField = 'max_estimates';
      break;
    case 'Delivery note':
      limitField = 'max_delivery_notes';
      break;
    case 'Credit note':
      limitField = 'max_credit_notes';
      break;
    case 'Purchase order':
      limitField = 'max_purchase_orders';
      break;
    default:
      limitField = 'max_invoices';
  }

  // Count existing documents for this user and type.
  let query = supabase
    .from('invoices')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (documentType === 'Invoice') {
    // Older invoices may have a null document_type, treat them as invoices.
    query = query.or('document_type.is.null,document_type.eq.Invoice');
  } else {
    query = query.eq('document_type', documentType);
  }

  const { count, error } = await query;

  if (error) {
    console.error('Error checking document limits:', error);
    return { ok: true }; // Fail open so we don't block due to a transient error.
  }

  const currentCount = count ?? 0;
  const max = limits[limitField] ?? DEFAULT_LIMITS[limitField];

  if (currentCount >= max) {
    const typeLabel =
      documentType === 'Delivery note'
        ? 'delivery notes'
        : documentType === 'Credit note'
        ? 'credit notes'
        : documentType === 'Purchase order'
        ? 'purchase orders'
        : `${documentType.toLowerCase()}s`;

    return {
      ok: false,
      message: `Free plan limit reached. You can only create ${max} ${typeLabel}. Upgrade your plan to add more.`,
    };
  }

  return { ok: true };
}

export async function checkClientLimit(userId: string): Promise<LimitCheckResult> {
  const supabase = createClient();

  if (await hasActivePlan(userId)) {
    return { ok: true };
  }

  const limits = await getUserLimits(userId);

  const { count, error } = await supabase
    .from('clients')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) {
    console.error('Error checking client limits:', error);
    return { ok: true };
  }

  const currentCount = count ?? 0;
  const max = limits.max_clients ?? DEFAULT_LIMITS.max_clients;

  if (currentCount >= max) {
    return {
      ok: false,
      message: `Free plan limit reached. You can only create ${max} clients. Upgrade your plan to add more.`,
    };
  }

  return { ok: true };
}


