import { DashboardShell } from "@/components/dashboard-shell"
import { CarTracker } from "./car-tracker"

export const metadata = {
  title: "Saifauto - Track Cars",
};

export default function TrackCarsPage() {
  return (
    <DashboardShell>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Track Cars</h1>
        <CarTracker />
      </div>
    </DashboardShell>
  )
} 