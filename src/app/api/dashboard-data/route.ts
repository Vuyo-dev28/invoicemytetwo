import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for admin stats
);

export async function GET() {
  try {
    // Get total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Get total revenue
    const { data: invoices } = await supabase.from('invoices').select('amount');
    const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.amount || 0), 0) || 0;

    // Active subscriptions
    const { count: activeSubscriptions } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // User growth by month
    const { data: userGrowth } = await supabase.rpc('get_user_growth'); // ✅ You need an RPC for this OR query manually

    // Revenue growth by month
    const { data: revenueGrowth } = await supabase.rpc('get_revenue_growth');

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalRevenue,
      activeSubscriptions: activeSubscriptions || 0,
      userGrowth: userGrowth || [],
      revenueGrowth: revenueGrowth || []
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ error: 'Failed to load dashboard data' }, { status: 500 });
  }
}
