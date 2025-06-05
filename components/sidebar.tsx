"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Users,
  Calendar,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Car as CarIcon,
  CalendarDays,
  FileText
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import React, { useState, useEffect, useRef, useCallback } from "react"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-mobile"

// Helper for focus trap
function useFocusTrap(active: boolean, trapRef: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    if (!active || !trapRef.current) return;
    const focusable = trapRef.current.querySelectorAll<HTMLElement>(
      'a, button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    if (focusable.length) focusable[0].focus();
    function handle(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    trapRef.current.addEventListener("keydown", handle);
    return () => trapRef.current?.removeEventListener("keydown", handle);
  }, [active, trapRef]);
}

export function SidebarMobileTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="md:hidden fixed top-4 left-4 z-50 p-2 rounded bg-background/80 border border-border shadow"
      aria-label="Open sidebar"
      onClick={onClick}
      type="button"
    >
      <Menu className="h-6 w-6" />
    </button>
  );
}

export function Sidebar({
  onNavigate,
  isMobileOpen: controlledIsMobileOpen,
  setIsMobileOpen: controlledSetIsMobileOpen,
}: {
  onNavigate?: () => void;
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()
  const [uncontrolledIsMobileOpen, uncontrolledSetIsMobileOpen] = React.useState(false);
  const isMobileOpen = controlledIsMobileOpen !== undefined ? controlledIsMobileOpen : uncontrolledIsMobileOpen;
  const setIsMobileOpen = controlledSetIsMobileOpen || uncontrolledSetIsMobileOpen;
  const [isCollapsed, setIsCollapsed] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  // Load collapsed state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("sidebar-collapsed")
      setIsCollapsed(stored === "true")
    }
  }, [])

  // Save collapsed state
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", isCollapsed ? "true" : "false")
    }
  }, [isCollapsed])

  // Close mobile sidebar on route change
  useEffect(() => {
    if (!isMobileOpen) return
    if (onNavigate) onNavigate()
    setIsMobileOpen(false)
    // eslint-disable-next-line
  }, [pathname])

  // Focus trap for mobile
  useFocusTrap(isMobileOpen, sidebarRef)

  // Close on overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) setIsMobileOpen(false)
  }

  // Keyboard ESC to close mobile
  useEffect(() => {
    if (!isMobileOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsMobileOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isMobileOpen])

  // Sign out
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  // Sidebar links
  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Cars", href: "/dashboard/cars", icon: CarIcon },
    { name: "Clients", href: "/dashboard/clients", icon: Users },
    { name: "Bookings", href: "/dashboard/bookings", icon: Calendar },
    { name: "WhatsApp", href: "/dashboard/whatsapp", icon: MessageCircle },
    { name: "Calendar", href: "/dashboard/calendar", icon: CalendarDays },
    { name: "Documents", href: "/dashboard/documents", icon: FileText },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  // Sidebar width
  const sidebarWidth = isCollapsed ? 60 : 240

  // Sidebar content
  const sidebarContent = (
    <nav
      className="flex flex-col h-full"
      role="navigation"
      aria-expanded={!isCollapsed}
    >
      <div className="flex items-center h-14 border-b px-4 relative">
        <Link href="/" className={cn("flex items-center gap-2 font-semibold", isCollapsed ? "justify-center w-full" : "")}
          tabIndex={isMobileOpen || !isCollapsed ? 0 : -1}
        >
          <Image
            src="/SVG/Asset 1.svg"
            alt="Saifauto Logo"
            width={isCollapsed ? 24 : 30}
            height={isCollapsed ? 24 : 30}
            className="h-auto sidebar-logo"
          />
          {!isCollapsed && <span className="text-lg font-semibold ml-2">Saifauto</span>}
        </Link>
        {/* Desktop collapse/expand chevron */}
        <button
          className={cn(
            "hidden md:flex items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted transition",
            isCollapsed ? "w-8 h-8" : "w-8 h-8"
          )}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          onClick={() => setIsCollapsed((v) => !v)}
          tabIndex={isMobileOpen || !isCollapsed ? 0 : -1}
        >
          {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
        {/* Mobile close button */}
        <button
          className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted transition"
          aria-label="Close sidebar"
          onClick={() => setIsMobileOpen(false)}
          style={{ display: isMobileOpen ? "block" : "none" }}
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <ul className="grid items-start px-2 text-sm font-medium gap-2">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  title={isCollapsed ? link.name : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
                    isCollapsed && "justify-center",
                    pathname === link.href && "bg-muted text-foreground"
                  )}
                  tabIndex={isMobileOpen || !isCollapsed ? 0 : -1}
                  onClick={() => {
                    if (isMobileOpen) setIsMobileOpen(false)
                  }}
                >
                  <Icon className={cn("h-5 w-5 flex-shrink-0", isCollapsed && "h-6 w-6")} />
                  {!isCollapsed && <span>{link.name}</span>}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="mt-auto flex flex-col items-center">
        <Image
          src="/SVG/finalAsset 1.svg"
          alt="Sidebar Decorative SVG"
          width={40}
          height={40}
          className="mb-2 sidebar-svg"
        />
        {!isCollapsed && (
          <div className="text-xs text-muted-foreground text-center mb-2">powered by Veyto</div>
        )}
        <div className="w-full p-2 border-t">
          <button
            onClick={handleSignOut}
            title={isCollapsed ? "Sign Out" : undefined}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary",
              isCollapsed && "justify-center"
            )}
            tabIndex={isMobileOpen || !isCollapsed ? 0 : -1}
          >
            <LogOut className={cn("h-5 w-5 flex-shrink-0", isCollapsed && "h-6 w-6")} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </div>
    </nav>
  )

  // Mobile overlay and drawer
  if (isMobile) {
    return (
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent
          data-sidebar="sidebar"
          data-mobile="true"
          side="left"
          className="w-[70vw] max-w-none bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
          style={{
            ["--sidebar-width" as any]: sidebarWidth,
          } as React.CSSProperties}
        >
          <SheetTitle className="sr-only">Sidebar Navigation</SheetTitle>
          <div className="flex h-full w-full flex-col">{sidebarContent}</div>
        </SheetContent>
      </Sheet>
    )
  }

  // Desktop
  return (
    <>
      {/* Mobile overlay */}
      <div
        ref={overlayRef}
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity md:hidden",
          isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        aria-hidden={!isMobileOpen}
        onClick={handleOverlayClick}
      />
      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={cn(
          "z-50 flex flex-col h-screen bg-background border-r transition-all duration-300 ease-in-out sticky top-0",
          // Desktop
          "hidden md:flex",
          isCollapsed ? "w-[60px]" : "w-[240px]",
          // Mobile
          "fixed md:sticky md:top-0 md:left-0 md:z-30 md:block",
          isMobileOpen ? "left-0" : "-left-64 md:left-0",
          isMobileOpen ? "shadow-2xl" : "",
          "md:transition-none"
        )}
        style={{ width: sidebarWidth }}
        role="navigation"
        aria-expanded={!isCollapsed}
        tabIndex={-1}
      >
        {sidebarContent}
      </div>
    </>
  )
} 