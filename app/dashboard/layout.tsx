"use client"

import React from "react"
import { Sidebar } from "@/components/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
      <div className="flex min-h-screen bg-background text-foreground">
        <Sidebar />
        <main 
          className={cn(
            "flex-1 min-h-screen overflow-x-auto transition-all duration-300 ease-in-out",
            "ml-20"
          )}
        >
          {children}
        </main>
        <Toaster />
      </div>
  )
} 