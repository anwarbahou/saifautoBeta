import { CarsList } from "@/components/cars-list"
// import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export default function CarsPage() {
  return (
    <DashboardShell>
      {/* <DashboardHeader heading="Cars" text="Manage your fleet of rental vehicles" /> */}
      <CarsList />
    </DashboardShell>
  )
}
