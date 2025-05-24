"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { SidebarMenuButton, useSidebar } from "@/components/ui/sidebar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarMenuButtonWithTooltipProps {
  href: string
  isActive: boolean
  icon: ReactNode
  title: string
}

export function SidebarMenuButtonWithTooltip({ href, isActive, icon, title }: SidebarMenuButtonWithTooltipProps) {
  const { state } = useSidebar()

  const button = (
    <SidebarMenuButton asChild isActive={isActive}>
      <Link href={href}>
        {icon}
        <span>{title}</span>
      </Link>
    </SidebarMenuButton>
  )

  if (state !== "collapsed") {
    return button
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right">{title}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
