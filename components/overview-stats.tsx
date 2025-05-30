"use client"

import { useState, useEffect } from "react"
import { Car, CalendarClock, Users, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getDashboardStats } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"

export function OverviewStats() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeBookings: 0,
    availableCars: 0,
    totalClients: 0,
  })
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getDashboardStats()
        if (data) {
          setStats(data)
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load dashboard statistics",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [toast])

  const statsConfig = [
    {
      title: "Total Revenue",
      value: `${stats.totalRevenue.toFixed(2)} MAD`,
      change: "+20.1%",
      icon: DollarSign,
    },
    {
      title: "Active Bookings",
      value: stats.activeBookings.toString(),
      change: "+12.5%",
      icon: CalendarClock,
    },
    {
      title: "Available Cars",
      value: stats.availableCars.toString(),
      change: "-3.2%",
      icon: Car,
    },
    {
      title: "Total Clients",
      value: stats.totalClients.toString(),
      change: "+8.4%",
      icon: Users,
    },
  ]

  return (
    <>
      {statsConfig.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <div className="h-8 w-24 animate-pulse rounded bg-muted"></div> : stat.value}
            </div>
            <p className={`text-xs ${stat.change.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
              {stat.change} from last month
            </p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}
