"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  useGetOrderQuery,
  useUpdateOrderMutation,
} from "../../../services/ordersApi";
import Link from "next/link";
import {
  ShoppingCart,
  DollarSign,
  CheckCircle,
  Clock,
  User,
  Mail,
  Package,
  Calendar,
  ArrowLeft,
  Edit3,
  Save,
  X,
} from "lucide-react";
import Breadcrumb from "@/app/components/Breadcrum";

type StatsCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
};

function StatsCard({
  title,
  value,
  icon,
  color = "bg-blue-950",
}: StatsCardProps) {
  return (
    <div className="bg-white rounded-2xl p-6 flex items-center gap-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div
        className={`w-12 h-12 flex items-center justify-center rounded-xl ${color} text-white`}
      >
        {icon}
      </div>
      <div>
        <h4 className="text-gray-500 text-sm font-medium">{title}</h4>
        <p className="text-gray-900 text-xl font-bold">{value}</p>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, error } = useGetOrderQuery(id);
  const [updateOrder, { isLoading: isUpdating }] = useUpdateOrderMutation();

  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const statusOptions = [
    { value: "pending", label: "Pending", color: "bg-yellow-500" },
    { value: "processing", label: "Processing", color: "bg-blue-500" },
    { value: "shipped", label: "Shipped", color: "bg-purple-500" },
    { value: "delivered", label: "Delivered", color: "bg-green-500" },
    { value: "canceled", label: "Canceled", color: "bg-red-500" },
  ];

  const handleStatusUpdate = async () => {
    if (!selectedStatus || !order) return;

    try {
      await updateOrder({
        id: order._id,
        order: { status: selectedStatus },
      }).unwrap();
      setIsEditingStatus(false);
    } catch (error) {
      console.log("Failed to update status:", error);
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle size={16} />;
      case "pending":
        return <Clock size={16} />;
      case "processing":
        return <Package size={16} />;
      case "shipped":
        return <Package size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl p-6 h-24"></div>
            ))}
          </div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-2xl p-6 h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-8">
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-red-100 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Failed to Load Order
          </h2>
          <p className="text-gray-600 mb-4">
            There was an error loading the order details.
          </p>
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="w-full p-8">
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            The requested order could not be found.
          </p>
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center px-6 py-3 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition-colors duration-200"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full p-8 bg-gray-50 min-h-screen">
      <Breadcrumb
        items={[
          { label: "Admin Dashboard", href: "/dashboard" },
          { label: "Order List", href: "/dashboard/order" },
          {
            label: `${order._id.slice(-8)}`,
            href: `/dashboard/order/order${id}`,
          },
        ]}
      />
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Order Details
          </h1>
          <p className="text-gray-600">
            Order #{order._id.slice(-8)} •{" "}
            {new Date(order.createdAt || Date.now()).toLocaleDateString()}
          </p>
        </div>
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center px-6 py-3 rounded-xl bg-gray-800 text-white hover:bg-gray-700 transition-all duration-200 hover:shadow-lg self-start sm:self-auto"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Orders
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Order ID"
          value={`#${order._id.slice(-8)}`}
          icon={<ShoppingCart size={20} />}
          color="bg-blue-600"
        />
        <StatsCard
          title="Total Amount"
          value={`$${order.totalAmount?.toLocaleString() || "0"}`}
          icon={<DollarSign size={20} />}
          color="bg-green-600"
        />
        <StatsCard
          title="Items Count"
          value={order.items?.length || 0}
          icon={<Package size={20} />}
          color="bg-purple-600"
        />
        <StatsCard
          title="Order Date"
          value={new Date(order.createdAt || Date.now()).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
            }
          )}
          icon={<Calendar size={20} />}
          color="bg-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Customer Information
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <User className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Customer Name
                  </p>
                  <p className="text-gray-800 font-semibold">
                    {order.user?.name || "N/A"}
                  </p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <Mail className="w-5 h-5 text-gray-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">
                    Email Address
                  </p>
                  <p className="text-gray-800 font-semibold">
                    {order.user?.email || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Order Items</h3>
              <span className="ml-auto bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                {order.items?.length || 0} items
              </span>
            </div>
            <div className="space-y-4">
              {order.items?.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="p-6 border-2 border-gray-100 rounded-2xl bg-gradient-to-r from-gray-50 to-white hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 text-lg mb-2">
                        {item.product?.name || "Product Name N/A"}
                      </h4>
                      <div className="flex flex-wrap gap-4 text-sm">
                        {item.color && (
                          <span className="flex items-center">
                            <div
                              className="w-4 h-4 rounded-full border-2 border-gray-300 mr-2"
                              style={{
                                backgroundColor: item.color.toLowerCase(),
                              }}
                            ></div>
                            <span className="text-gray-600">
                              Color: {item.color}
                            </span>
                          </span>
                        )}
                        {item.size && (
                          <span className="text-gray-600">
                            Size:{" "}
                            <span className="font-medium">{item.size}</span>
                          </span>
                        )}
                        <span className="text-gray-600">
                          Quantity:{" "}
                          <span className="font-medium">{item.quantity}</span>
                        </span>
                      </div>
                    </div>
                    <div className="text-right lg:text-right">
                      <p className="text-sm text-gray-600 mb-1">
                        Unit Price:{" "}
                        <span className="font-semibold">${item.price}</span>
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        Subtotal: ${item.subtotal}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Order Status</h3>
              {!isEditingStatus ? (
                <button
                  onClick={() => {
                    setIsEditingStatus(true);
                    setSelectedStatus(order.status || "pending");
                  }}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  title="Edit Status"
                >
                  <Edit3 size={18} />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleStatusUpdate}
                    disabled={isUpdating}
                    className="p-2 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg transition-colors duration-200 disabled:opacity-50"
                    title="Save Changes"
                  >
                    <Save size={18} />
                  </button>
                  <button
                    onClick={() => setIsEditingStatus(false)}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    title="Cancel"
                  >
                    <X size={18} />
                  </button>
                </div>
              )}
            </div>

            {isEditingStatus ? (
              <div className="space-y-3">
                {statusOptions.map((status) => (
                  <label
                    key={status.value}
                    className="flex items-center p-3 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:bg-gray-50"
                    style={{
                      borderColor:
                        selectedStatus === status.value ? "#3b82f6" : "#e5e7eb",
                      backgroundColor:
                        selectedStatus === status.value
                          ? "#eff6ff"
                          : "transparent",
                    }}
                  >
                    <input
                      type="radio"
                      name="status"
                      value={status.value}
                      checked={selectedStatus === status.value}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded-full ${status.color} mr-3`}
                    ></div>
                    <span className="font-medium text-gray-800">
                      {status.label}
                    </span>
                  </label>
                ))}
              </div>
            ) : (
              <div
                className={`inline-flex items-center px-4 py-3 rounded-xl border-2 ${getStatusStyles(
                  order.status || "pending"
                )}`}
              >
                {getStatusIcon(order.status || "pending")}
                <span className="ml-2 font-semibold">
                  {order.status
                    ? order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)
                    : "Pending"}
                </span>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">
              Order Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold text-gray-800">
                  ${(order.totalAmount || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Tax:</span>
                <span className="font-semibold text-gray-800">$0.00</span>
              </div>
              <div className="flex justify-between items-center pt-4">
                <span className="text-lg font-bold text-gray-800">Total:</span>
                <span className="text-2xl font-bold text-gray-900">
                  ${(order.totalAmount || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
