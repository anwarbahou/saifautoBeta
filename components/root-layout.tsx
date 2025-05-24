"use client"

import { Sidebar } from "@/components/sidebar"
import { usePathname } from "next/navigation"

export function RootLayoutContent({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/login'

  return (
    <>
      {isLoginPage ? (
        children
      ) : (
        <div className="h-screen overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      )}
    </>
  )
} 