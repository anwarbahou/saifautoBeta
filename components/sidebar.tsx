"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Car, Users, Calendar, LayoutDashboard, LogOut, MessageCircle, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { createBrowserSupabaseClient } from "@/lib/supabase"
import { useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createBrowserSupabaseClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const links = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard
    },
    {
      name: "Cars",
      href: "/dashboard/cars",
      icon: Car
    },
    {
      name: "Clients",
      href: "/dashboard/clients",
      icon: Users
    },
    {
      name: "Bookings",
      href: "/dashboard/bookings",
      icon: Calendar
    },
    {
      name: "WhatsApp",
      href: "/dashboard/whatsapp",
      icon: MessageCircle
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings
    }
  ]

  return (
    <div className="flex h-screen w-[200px] flex-col border-r bg-muted/40">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Car className="h-6 w-6" />
          <span>CarRent</span>
        </Link>
        <div className="ml-auto">
          <ThemeToggle />
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
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
                  pathname === link.href && "bg-muted text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.name}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto p-2">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </div>
  )
} 