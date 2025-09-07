import Link from "next/link";
import { useGetRecentOrdersQuery } from "../services/ordersApi";

export default function RecentOrdersList() {
  const { data: orders, isLoading, error } = useGetRecentOrdersQuery();

  if (isLoading) {
    return (
      <div className="p-8 bg-white shadow-lg rounded-3xl border border-gray-100 w-full">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded-lg w-32 mb-6"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-5 border border-gray-100 rounded-2xl bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <div className="h-5 bg-gray-200 rounded w-24"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-white shadow-lg rounded-3xl border border-red-100 w-full">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">Unable to load recent orders</p>
          <p className="text-red-400 text-sm mt-1">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

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

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "delivered":
        return (
          <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        );
      case "pending":
        return (
          <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        );
      case "canceled":
        return (
          <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="p-8 bg-white shadow-lg rounded-3xl border border-gray-100 w-full">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <svg className="w-6 h-6 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Recent Orders
        </h2>
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">No recent orders found</p>
          <p className="text-gray-400 text-sm mt-1">Your recent orders will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white shadow-lg rounded-3xl border border-gray-100 w-full backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <svg className="w-6 h-6 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Recent Orders
        </h2>
        <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full font-medium">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </span>
      </div>

      <div className="space-y-3">
        {orders.map((order, index) => (
          <Link key={order._id} href={`/dashboard/orders/${order._id}`} className="block group">
            <div className="p-5 border border-gray-200 rounded-2xl bg-gradient-to-r from-white to-gray-50 hover:shadow-xl hover:shadow-gray-200/50 hover:border-gray-300 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:scale-[1.02] transform">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-gray-800 font-bold text-lg">
                      Order{" "}
                      <span className="text-gray-500 font-mono text-sm">
                        #{order._id.slice(-8)}
                      </span>
                    </span>
                  </div>
                  {order.createdAt && (
                    <p className="text-xs text-gray-500 font-medium">
                      {formatDate(order.createdAt)}
                    </p>
                  )}
                </div>
                <span
                  className={`flex items-center px-3 py-1.5 text-xs font-semibold rounded-full border ${getStatusStyles(
                    order.status
                  )} shadow-sm`}
                >
                  {getStatusIcon(order.status)}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                  Total:{" "}
                  <span className="font-bold text-gray-900 text-lg ml-1">
                    ${order.totalAmount}
                  </span>
                </div>
                <div className="text-gray-400 group-hover:text-gray-600 transition-colors duration-200">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              
              {order.items && order.items.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}