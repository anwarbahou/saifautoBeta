"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Users,
  Calendar,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Settings,
  PanelLeftClose,
  Car as CarIcon,
  CalendarDays,
  FileText
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import React, { useState, useEffect, useRef } from "react"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()
  const [isCollapsed, setIsCollapsed] = useState(true)
  const [isHoverLocked, setIsHoverLocked] = useState(false);
  const hoverLockTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const collapsedWidth = "w-20"
  const expandedWidth = "w-64"

  useEffect(() => {
    return () => {
      if (hoverLockTimeoutRef.current) {
        clearTimeout(hoverLockTimeoutRef.current);
      }
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

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
  
  const handleMouseEnter = () => {
    if (!isHoverLocked && isCollapsed) {
      setIsCollapsed(false);
    }
  };

  const handleCollapseButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCollapsed(true);
    setIsHoverLocked(true);
    if (hoverLockTimeoutRef.current) {
      clearTimeout(hoverLockTimeoutRef.current);
    }
    hoverLockTimeoutRef.current = setTimeout(() => {
      setIsHoverLocked(false);
    }, 300); // Lock duration, can match transition
  };

  return (
    <div 
      className={cn(
        "fixed top-0 left-0 z-30 flex h-screen flex-col border-r bg-background transition-all duration-300 ease-in-out",
        isCollapsed ? collapsedWidth : expandedWidth
      )}
      onMouseEnter={handleMouseEnter}
    >
      <div className={cn("flex h-14 items-center border-b px-4")}>
        <Link href="/" className={cn("flex items-center gap-2 font-semibold", isCollapsed ? "justify-center w-full" : "")}>
          {!isCollapsed && (
            <Image 
              src="/SVG/Asset 1.svg" 
              alt="Saifauto Logo" 
              width={30}
              height={30}
              className="h-auto sidebar-logo"
            />
          )}
          {!isCollapsed && <span className="text-lg font-semibold ml-2">Saifauto</span>}
          {isCollapsed && (
            <Image 
              src="/SVG/Asset 1.svg" 
              alt="Saifauto Logo Collapsed" 
              width={24}
              height={24}
              className="h-auto sidebar-logo"
            />
          )}
        </Link>
        
        <div className={cn("flex items-center gap-1", isCollapsed ? "hidden" : "ml-auto")}>
          {!isCollapsed && (
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCollapseButtonClick}
                className=""
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
              >
                <PanelLeftClose className="h-5 w-5" />
              </Button>
              <ThemeToggle />
            </>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                title={isCollapsed ? link.name : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                  isCollapsed && "justify-center",
                  pathname === link.href && "bg-muted text-foreground"
                )}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", isCollapsed && "h-6 w-6")} />
                {!isCollapsed && <span>{link.name}</span>}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto p-2 border-t">
        <button
          onClick={handleSignOut}
          title={isCollapsed ? "Sign Out" : undefined}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className={cn("h-5 w-5 flex-shrink-0", isCollapsed && "h-6 w-6")} />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
      <style jsx global>{`
        html.light .sidebar-logo {
          filter: none;
        }
        html.dark .sidebar-logo {
          filter: brightness(0) invert(1);
        }
      `}</style>
    </div>
  )
} 