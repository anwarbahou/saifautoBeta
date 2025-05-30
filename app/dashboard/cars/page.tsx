import { CarsList } from "@/components/cars-list"
// import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export const metadata = {
  title: "Saifauto - Cars",
};

export default function CarsPage() {
  return (
    <DashboardShell>
      {/* <DashboardHeader heading="Cars" text="Manage your fleet of rental vehicles" /> */}
      <CarsList />
    </DashboardShell>
  )
}
