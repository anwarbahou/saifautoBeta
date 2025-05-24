import { ClientsList } from "@/components/clients-list"
// import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"

export default function ClientsPage() {
  return (
    <DashboardShell>
      {/* <DashboardHeader heading="Clients" text="Manage your customer database" /> */}
      <ClientsList />
    </DashboardShell>
  )
}
