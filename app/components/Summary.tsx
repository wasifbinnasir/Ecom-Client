'use client';

import React, { useMemo } from "react";
import { ShoppingCart, DollarSign, CheckCircle, Clock } from "lucide-react";
import { useGetOrdersQuery } from "../services/ordersApi";
import { OrderStatus } from "../types"; 
import Spinner from "./Spinner";

type StatsCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
};

function StatsCard({ title, value, icon }: StatsCardProps) {
  return (
    <div className="bg-gray-100  rounded-2xl p-8 flex items-center gap-4 shadow-md hover:shadow-lg transition">
      <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-blue-950 text-white">
        {icon}
      </div>
      <div>
        <h4 className="text-gray-400 text-sm">{title}</h4>
        <p className="text-black text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default function DashboardStats() {
  const { data: orders = [], isLoading, isError } = useGetOrdersQuery();

  const stats = useMemo(() => {
    if (!orders) return { total: 0, totalPrice: 0, delivered: 0, pending: 0 };

    const total = orders.length;
    const totalPrice = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);

    const delivered = orders.filter((o) => o.status === OrderStatus.DELIVERED).length;
    const pending = orders.filter((o) => o.status === OrderStatus.PENDING).length;

    return { total, totalPrice, delivered, pending };
  }, [orders]);

  if (isLoading) {
    return <div className="text-gray-400"><Spinner/> </div>;
  }

  if (isError) {
    return <div className="text-red-500">Failed to load stats.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      <StatsCard
        title="Total Orders"
        value={stats.total}
        icon={<ShoppingCart size={28} />}
      />
      <StatsCard
        title="Total Revenue"
        value={`$${stats.totalPrice.toLocaleString()}`}
        icon={<DollarSign size={28} />}
      />
      <StatsCard
        title="Delivered Orders"
        value={stats.delivered}
        icon={<CheckCircle size={28} className="text-green-400" />}
      />
      <StatsCard
        title="Pending Orders"
        value={stats.pending}
        icon={<Clock size={28} className="text-yellow-400" />}
      />
    </div>
  );
}
