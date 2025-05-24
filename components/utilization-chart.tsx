"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

const data = [
  { category: "Economy", utilization: 85 },
  { category: "Compact", utilization: 78 },
  { category: "Midsize", utilization: 92 },
  { category: "Fullsize", utilization: 65 },
  { category: "SUV", utilization: 88 },
  { category: "Luxury", utilization: 72 },
]

export function UtilizationChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fleet Utilization</CardTitle>
        <CardDescription>Utilization rate by car category</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            utilization: {
              label: "Utilization",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="aspect-[1.5/1]"
        >
          <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={10} />
            <YAxis tickFormatter={(value) => `${value}%`} tickLine={false} axisLine={false} tickMargin={10} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="utilization" fill="var(--color-utilization)" radius={4} barSize={30} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
