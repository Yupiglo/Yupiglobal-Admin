"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { buildApiUrl } from "@/utils/apiBase";

/** Component that renders the Dashboard view.
 *  Passed as child to DashboardLayout component.
 */
interface DashboardViewProps {
  username: string;
}

type AdminStats = {
  revenueTotal: number;
  usersCount: number;
  productsCount: number;
  ordersCount: number;
  salesCount: number;
  activeNow: number;
};

type RecentOrder = {
  id: string;
  total: number;
  status: string;
  createdAt: string | null;
  user: { id: string; name: string; email: string };
};

const DashboardView: React.FC<DashboardViewProps> = ({ username }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats>({
    revenueTotal: 0,
    usersCount: 0,
    productsCount: 0,
    ordersCount: 0,
    salesCount: 0,
    activeNow: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(false);

  const revenueDisplay = useMemo(() => {
    const n = Number(stats.revenueTotal || 0);
    return `$${n.toFixed(2)}`;
  }, [stats.revenueTotal]);

  useEffect(() => {
    const token = user?.token ?? "";
    if (!token) return;

    const authHeader = token.toLowerCase().startsWith("bearer ") ? token : `Bearer ${token}`;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(buildApiUrl("admin/stats"), {
          method: "GET",
          headers: {
            Authorization: authHeader,
          },
          cache: "no-store",
        });

        if (!res.ok) return;
        const data: any = await res.json();
        if (data?.stats) setStats(data.stats);
        if (Array.isArray(data?.recentOrders)) setRecentOrders(data.recentOrders);
      } catch {
        
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [user?.token]);

  return (
    <div className="w-full min-h-[calc(100vh-100px)] animate-in fade-in duration-500">

      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, {username ?? "Admin"}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={revenueDisplay}
          trend={loading ? "Loading..." : ""}
          trendUp={false}
        />
        <StatCard
          title="Users"
          value={String(stats.usersCount ?? 0)}
          trend={loading ? "Loading..." : ""}
          trendUp={false}
        />
        <StatCard
          title="Products"
          value={String(stats.productsCount ?? 0)}
          trend={loading ? "Loading..." : ""}
          trendUp={false}
        />
        <StatCard
          title="Sales"
          value={String(stats.salesCount ?? 0)}
          trend={loading ? "Loading..." : ""}
          trendUp={false}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Orders"
          value={String(stats.ordersCount ?? 0)}
          trend={loading ? "Loading..." : ""}
          trendUp={false}
        />
        <StatCard
          title="Active Now"
          value={String(stats.activeNow ?? 0)}
          trend={loading ? "Loading..." : ""}
          trendUp={false}
        />
      </div>

      {/* Placeholder for Recent Activity/Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[300px]">
          <h3 className="font-semibold text-gray-900 mb-4">Revenue Overview</h3>
          <div className="w-full h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
            Chart Placeholder
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm min-h-[300px]">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Sales</h3>
          {recentOrders.length === 0 ? (
            <div className="w-full h-64 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
              {loading ? "Loading..." : "No sales yet"}
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((o) => (
                <div key={o.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100" />
                    <div className="text-sm">
                      <p className="font-medium text-gray-900">{o.user?.name || o.user?.email || `Order #${o.id}`}</p>
                      <p className="text-xs text-gray-500">{o.status}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">+${Number(o.total || 0).toFixed(2)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, trend, trendUp }: { title: string, value: string, trend: string, trendUp: boolean }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <div className="text-2xl font-bold text-gray-900 mt-2">{value}</div>
    <p className={`text-xs mt-1 ${trendUp ? "text-green-600" : "text-red-600"}`}>
      {trend}
    </p>
  </div>
);

export default DashboardView;
