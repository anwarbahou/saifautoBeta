"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { getCarStatsByStatus } from "@/lib/actions";

interface CarStatus {
  name: string; // e.g., "Available", "Rented", "Maintenance"
  value: number; // count of cars
}

interface CarFromDB {
  id: number;
  status: string;
  // other car properties if needed
}

const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  '#AF19FF', // Fallback for 5th+ category
];

export function CarStatusOverview() {
  const [statusData, setStatusData] = useState<CarStatus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCarStatuses() {
      try {
        setLoading(true);
        setError(null);
        const result = await getCarStatsByStatus();
        
        if (result.success && result.data) {
          setStatusData(result.data);
        } else {
          setError(result.error || "Failed to fetch car statuses.");
        }
      } catch (e) {
        console.error("Failed to fetch car statuses:", e);
        setError("An unexpected error occurred while fetching car statuses.");
      } finally {
        setLoading(false);
      }
    }
    fetchCarStatuses();
  }, []);

  if (loading) {
    return (
      <Card className="col-span-1 md:col-span-1 lg:col-span-1 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-1 md:col-span-1 lg:col-span-1 flex flex-col items-center justify-center text-destructive p-4">
        <AlertTriangle className="h-8 w-8 mb-2" />
        <p className="text-center text-sm px-4">{error}</p>
      </Card>
    );
  }
  
  if (statusData.length === 0 && !loading && !error) {
    return (
       <Card className="col-span-1 md:col-span-1 lg:col-span-1 flex flex-col items-center justify-center">
        <CardHeader className="pb-2"><CardTitle className="text-lg font-medium">État de la Flotte</CardTitle></CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
            <p className="text-muted-foreground">Aucune donnée disponible</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1 md:col-span-1 lg:col-span-1 flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">État de la Flotte</CardTitle>
        <CardDescription className="text-sm">Vue d'ensemble de l'état des véhicules</CardDescription>
      </CardHeader>
      <CardContent className="pb-4 flex-grow">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 