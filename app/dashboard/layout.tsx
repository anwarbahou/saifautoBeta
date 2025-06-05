"use client"

import React, { useState, useEffect } from "react"
import { Sidebar, SidebarMobileTrigger } from "@/components/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { cn } from "@/lib/utils"

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false)
  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) setMatches(media.matches)
    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [matches, query])
  return matches
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const [collapsed, setCollapsed] = useState(false)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sidebar-collapsed")
      setCollapsed(stored === "true")
    }
  }, [isDesktop, mobileOpen])

  const sidebarWidth = collapsed ? 60 : 240

  return (
    <>
      {/* Mobile hamburger trigger - always on top */}
      {!isDesktop && <SidebarMobileTrigger onClick={() => setMobileOpen(true)} />}
      <div className="flex min-h-screen bg-background text-foreground">
        {/* Sidebar (not styled here, assumed handled internally) */}
        <Sidebar isMobileOpen={mobileOpen} setIsMobileOpen={setMobileOpen} onNavigate={() => setMobileOpen(false)} />

        {/* Main content */}
        <main
          className={cn(
            "flex-1 min-h-screen overflow-x-auto transition-all duration-300 ease-in-out"
          )}
        >
          {children}
        </main>

        <Toaster />
      </div>
    </>
  )
}
