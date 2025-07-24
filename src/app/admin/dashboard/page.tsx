'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const supabase = createClient();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRevenue: 0,
    activeSubscriptions: 0,
  });
  const [userChart, setUserChart] = useState<any[]>([]);
  const [revenueChart, setRevenueChart] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // ✅ 1. Total Users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // ✅ 2. Active Subscriptions
    const { count: activeSubscriptions } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // ✅ 3. Total Revenue
    const { data: invoices } = await supabase
      .from('invoices')
      .select('total')
      .eq('status', 'paid');

    const totalRevenue = invoices?.reduce((sum, inv) => sum + (inv.total || 0), 0) || 0;

    // ✅ 4. Chart: User Growth
    const { data: userGrowth } = await supabase.rpc('get_user_growth'); // We'll create this function below

    // ✅ 5. Chart: Revenue Growth
    const { data: revenueGrowth } = await supabase.rpc('get_revenue_growth'); // We'll create this function too

    setStats({
      totalUsers: totalUsers || 0,
      totalRevenue,
      activeSubscriptions: activeSubscriptions || 0,
    });
    setUserChart(userGrowth || []);
    setRevenueChart(revenueGrowth || []);
  };

  return (
    <div className="p-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card label="Total Users" value={stats.totalUsers} />
        <Card label="Total Revenue" value={`$${stats.totalRevenue}`} />
        <Card label="Active Subscriptions" value={stats.activeSubscriptions} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <Chart title="User Growth" data={userChart} dataKey="users" />
        <Chart title="Revenue Growth" data={revenueChart} dataKey="revenue" />
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <p className="text-gray-500">{label}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
}

function Chart({ title, data, dataKey }: { title: string; data: any[]; dataKey: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke="#4f46e5" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
