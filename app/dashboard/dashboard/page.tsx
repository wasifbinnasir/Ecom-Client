"use client";
import Breadcrumb from '@/app/components/Breadcrum'
import RecentOrdersList from '@/app/components/RecentOrders'
import DashboardStats from '@/app/components/Summary'
import Graph from "@/app/components/Graph"
import React from 'react'

export default function dashboard() {
  return (
    <div>
      <Breadcrumb 
                    items={
                      [{ label: 'Admin Dashboard', href: '/dashboard' }, { label: 'Dashboard Details', href: '/dashboard/dashboard' }]
                    }
                    />
      <DashboardStats/>
      <div className='h-4'></div>
      <Graph/>

      <div className='h-4'></div>
      <RecentOrdersList/>
       </div>
  )
}
