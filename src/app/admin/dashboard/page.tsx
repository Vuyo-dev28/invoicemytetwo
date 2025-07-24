'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
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
    try {
      const res = await fetch('/api/dashboard-data');
      const data = await res.json();

      setStats({
        totalUsers: data.totalUsers,
        totalRevenue: data.totalRevenue,
        activeSubscriptions: data.activeSubscriptions,
      });
      setUserChart(data.userGrowth);
      setRevenueChart(data.revenueGrowth);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading dashboard...</div>;
  }

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
