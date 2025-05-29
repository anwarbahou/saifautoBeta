import { ClientsList } from "@/components/clients-list"
// import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { getClients } from "@/lib/actions"

export default async function ClientsPage() {
  // Fetch initial clients data
  const initialClients = await getClients()

  return (
    <DashboardShell>
      {/* <DashboardHeader heading="Clients" text="Manage your customer database" /> */}
      <ClientsList initialClients={initialClients} />
    </DashboardShell>
  )
}
