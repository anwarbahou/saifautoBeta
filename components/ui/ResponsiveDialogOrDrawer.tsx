"use client"

import * as React from "react"
import { useMediaQuery } from "@/hooks/useMediaQuery" // Adjusted path
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter, // Keep DialogFooter for potential direct use or if Dialog needs it
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose, // For explicit close button in drawer if needed later
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button" // For a potential explicit close button in drawer
import { cn } from "@/lib/utils"

interface ResponsiveDialogOrDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string; // For custom styling of DialogContent or DrawerContent
  // Add any other common props you might need for both Dialog and Drawer
}

export function ResponsiveDialogOrDrawer({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  className,
}: ResponsiveDialogOrDrawerProps) {
  const isDesktop = useMediaQuery("(min-width: 1281px)"); // 1280px and below is mobile/tablet

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className={cn("sm:max-w-md", className)}>
          {title && (
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>
          )}
          {children}
          {footer && <DialogFooter>{footer}</DialogFooter>}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className={cn("h-screen top-0 right-0 left-auto mt-0 w-[80vw] max-w-sm rounded-none", className)}>
        {title && (
          <DrawerHeader className="text-left">
            <DrawerTitle>{title}</DrawerTitle>
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
        )}
        <div className="pt-0 px-4 pb-4 flex-1 overflow-y-auto">{children}</div>
        {footer && (
          <DrawerFooter className="pt-2">
            {footer}
            {/* 
              If you want an explicit close button for the drawer as well, 
              you can add it here or within the footer content passed in.
              Example:
              <DrawerClose asChild>
                <Button variant="outline">Close Drawer</Button>
              </DrawerClose>
            */}
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}

// Helper function, assuming you have a utils.ts or similar
// If not, you can define it here or import it if it exists.
// For now, defining a local cn, but ideally, it should come from "@/lib/utils"
// which is standard in shadcn/ui projects.
/* function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
} */ 