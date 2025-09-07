"use client";

import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetOrdersQuery } from "../services/ordersApi";
import { useMemo } from "react";

export default function MyChart() {
  const { data: orders = [], isLoading, error } = useGetOrdersQuery();

  const chartData = useMemo(() => {
    if (!orders || !orders.length) return [];

    // Create month mapping for proper ordering
    const monthOrder = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const grouped = {};

    orders.forEach((order) => {
      if (!order?.createdAt) return;
      
      try {
        const date = new Date(order.createdAt);
        if (isNaN(date.getTime())) return; // Skip invalid dates
        
        const month = date.toLocaleString("default", {
          month: "short",
        });

        if (!grouped[month]) {
          grouped[month] = { 
            totalSales: 0, 
            totalOrders: 0,
            monthIndex: monthOrder.indexOf(month)
          };
        }

        grouped[month].totalSales += Number(order.totalAmount) || 0;
        grouped[month].totalOrders += 1;
      } catch (e) {
        console.warn('Error processing order date:', order.createdAt);
      }
    });

    // Sort by month order and format data
    return Object.entries(grouped)
      .sort(([, a], [, b]) => a.monthIndex - b.monthIndex)
      .map(([month, values]) => ({
        name: month,
        sales: Math.round(values.totalSales * 100) / 100, // Round to 2 decimal places
        orders: values.totalOrders,
      }));
  }, [orders]);

  // Custom tooltip formatter
  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800 mb-2">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.name}: {entry.name === 'Total Sales' ? `$${entry.value.toLocaleString()}` : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 font-medium">Loading chart data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-red-50 rounded-lg border border-red-200">
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <p className="text-red-700 font-medium">Failed to load chart data</p>
          <p className="text-red-600 text-sm mt-1">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  // No data state
  if (!chartData || chartData.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center">
          <div className="text-gray-400 mb-3">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">No data available</p>
          <p className="text-gray-500 text-sm mt-1">Orders will appear here once available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Chart Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Sales Overview</h2>
        <p className="text-gray-600">Monthly sales performance and order volume</p>
      </div>

      {/* Chart Container */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#f0f0f0" 
                opacity={0.6}
              />
              
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickLine={{ stroke: '#d1d5db' }}
                axisLine={{ stroke: '#d1d5db' }}
                className="text-xs"
              />
              
              <YAxis 
                tick={{ fill: '#6b7280', fontSize: 12 }}
                tickLine={{ stroke: '#d1d5db' }}
                axisLine={{ stroke: '#d1d5db' }}
                className="text-xs"
              />
              
              <Tooltip 
                content={customTooltip}
                cursor={{ stroke: '#e5e7eb', strokeWidth: 1 }}
              />
              
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              
              {/* Sales Line - Purple/Blue gradient */}
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#8b5cf6" 
                strokeWidth={3}
                name="Total Sales"
                dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#8b5cf6', strokeWidth: 2, fill: '#ffffff' }}
                className="drop-shadow-sm"
              />
              
              {/* Orders Line - Green */}
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#10b981" 
                strokeWidth={3}
                name="Total Orders"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#ffffff' }}
                className="drop-shadow-sm"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Summary Stats */}
      {chartData.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <p className="text-purple-600 text-sm font-medium">Total Sales</p>
            <p className="text-2xl font-bold text-purple-700">
              ${chartData.reduce((sum, item) => sum + item.sales, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <p className="text-green-600 text-sm font-medium">Total Orders</p>
            <p className="text-2xl font-bold text-green-700">
              {chartData.reduce((sum, item) => sum + item.orders, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <p className="text-blue-600 text-sm font-medium">Avg Order Value</p>
            <p className="text-2xl font-bold text-blue-700">
              ${Math.round(
                chartData.reduce((sum, item) => sum + item.sales, 0) /
                chartData.reduce((sum, item) => sum + item.orders, 0)
              ).toLocaleString()}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <p className="text-gray-600 text-sm font-medium">Active Months</p>
            <p className="text-2xl font-bold text-gray-700">
              {chartData.length}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}