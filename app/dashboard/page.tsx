import React from "react"
import { OverviewStats } from "@/components/overview-stats"
import { RevenueChart } from "@/components/revenue-chart"
import { UtilizationChart } from "@/components/utilization-chart"
import { LatestBookings } from "@/components/latest-bookings"
import { RecentlyAddedCars } from "@/components/recently-added-cars"
import { RecentWhatsappMessages } from "@/components/recent-whatsapp-messages"
import { CarStatusOverview } from "@/components/car-status-overview"
import { UpcomingBookings } from "@/components/upcoming-bookings"

export const metadata = {
  title: "Saifauto - Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <OverviewStats />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <RevenueChart />
        <UtilizationChart />
        <LatestBookings />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <RecentlyAddedCars />
        <RecentWhatsappMessages />
        <CarStatusOverview />
        <UpcomingBookings />
      </div>
    </div>
  )
} 