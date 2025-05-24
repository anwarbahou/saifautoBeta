import { BookingsList } from "@/components/bookings-list"
// import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export default function BookingsPage() {
  return (
    <DashboardShell>
      {/* <DashboardHeader heading="Bookings" text="Manage all your rental bookings" /> */}
      <BookingsList />
    </DashboardShell>
  )
}
