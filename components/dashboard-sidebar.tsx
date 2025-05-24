"use client"

import { Car, CalendarClock, Users, LayoutDashboard, Settings, LogOut, Search, MessageCircle } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth"
import { SidebarMenuButtonWithTooltip } from "@/components/sidebar-menu-button-with-tooltip"

interface DashboardSidebarProps {
  user: User
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()

  const routes = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-4 w-4" />,
      href: "/",
      isActive: pathname === "/",
    },
    {
      title: "Cars",
      icon: <Car className="h-4 w-4" />,
      href: "/cars",
      isActive: pathname === "/cars",
    },
    {
      title: "Bookings",
      icon: <CalendarClock className="h-4 w-4" />,
      href: "/bookings",
      isActive: pathname === "/bookings",
    },
    {
      title: "Clients",
      icon: <Users className="h-4 w-4" />,
      href: "/clients",
      isActive: pathname === "/clients",
    },
    {
      title: "WhatsApp",
      icon: <MessageCircle className="h-4 w-4" />,
      href: "/whatsapp",
      isActive: pathname === "/whatsapp",
    },
    {
      title: "Settings",
      icon: <Settings className="h-4 w-4" />,
      href: "/settings",
      isActive: pathname === "/settings",
    },
  ]

  const handleLogout = async () => {
    await signOut()
    router.refresh()
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!user || !user.email) return "U"
    return user.email.substring(0, 2).toUpperCase()
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <Car className="h-6 w-6" />
          <span className="text-xl font-bold">CarRent</span>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
        <form>
          <SidebarGroup className="py-0">
            <SidebarGroupContent className="relative">
              <Label htmlFor="search" className="sr-only">
                Search
              </Label>
              <SidebarInput id="search" placeholder="Search..." className="pl-8" />
              <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
            </SidebarGroupContent>
          </SidebarGroup>
        </form>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {routes.map((route) => (
                <SidebarMenuItem key={route.href}>
                  <SidebarMenuButtonWithTooltip
                    href={route.href}
                    isActive={route.isActive}
                    icon={route.icon}
                    title={route.title}
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-3 px-4 py-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder-user.jpg" alt={user.email || "User"} />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{user.email}</span>
            <span className="text-xs text-muted-foreground">Admin</span>
          </div>
          <Button variant="ghost" size="icon" className="ml-auto" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
            <span className="sr-only">Log out</span>
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
