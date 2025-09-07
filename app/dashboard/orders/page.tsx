"use client";

import { useGetOrdersQuery } from "../../services/ordersApi";
import Link from "next/link";
import RecentOrdersList from "../../components/RecentOrders";

export default function OrdersPage() {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  const getStatusStyles = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return "bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border-green-200";
      case "pending":
        return "bg-gradient-to-r from-yellow-50 to-amber-50 text-yellow-700 border-yellow-200";
      case "canceled":
        return "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200";
      case "processing":
        return "bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 border-blue-200";
      case "shipped":
        return "bg-gradient-to-r from-purple-50 to-violet-50 text-purple-700 border-purple-200";
      default:
        return "bg-gradient-to-r from-gray-50 to-slate-50 text-gray-700 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full p-6 space-y-8">
      <h1 className="text-3xl font-extrabold mb-2 text-gray-900">Orders</h1>

      {/* Recent Orders (already styled component) */}
      <RecentOrdersList />

      {/* All Orders */}
      <div className="p-8 bg-white shadow-lg rounded-3xl border border-gray-100 w-full backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <svg
              className="w-6 h-6 mr-3 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            All Orders
          </h2>
          <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full font-medium">
            {orders?.length || 0} {orders?.length === 1 ? "order" : "orders"}
          </span>
        </div>

        {isLoading && <p className="text-gray-500">Loading orders...</p>}
        {error && <p className="text-red-600">Error loading orders</p>}

        <div className="space-y-3">
          {orders?.map((order: any) => (
            <Link
              key={order._id}
              href={`/dashboard/orders/${order._id}`}
              className="block group"
            >
              <div className="p-5 border border-gray-200 rounded-2xl bg-gradient-to-r from-white to-gray-50 hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-300 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.02] transform">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <span className="text-gray-800 font-bold text-lg">
                      Order{" "}
                      <span className="text-gray-500 font-mono text-sm">
                        #{order._id.slice(-8)}
                      </span>
                    </span>
                    {order.createdAt && (
                      <p className="text-xs text-gray-500 font-medium mt-1">
                        {formatDate(order.createdAt)}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${getStatusStyles(
                      order.status
                    )}`}
                  >
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg
                      className="w-4 h-4 mr-1.5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                    Total:{" "}
                    <span className="font-bold text-gray-900 text-lg ml-1">
                      ${order.totalAmount}
                    </span>
                  </div>
                  <div className="text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      {order.items.length}{" "}
                      {order.items.length === 1 ? "item" : "items"}
                    </p>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
