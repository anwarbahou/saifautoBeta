"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function CarCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden">
      <CardHeader className="p-0 relative">
        <Skeleton className="aspect-[16/10] w-full" />
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <Skeleton className="h-6 w-3/4 mb-1" /> 
        <Skeleton className="h-4 w-1/4 mb-3" /> 

        <div className="space-y-2 text-sm">
          <div className="flex items-center">
            <Skeleton className="mr-2 h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex items-center">
            <Skeleton className="mr-2 h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="flex items-center">
            <Skeleton className="mr-2 h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <div className="flex items-center">
            <Skeleton className="mr-2 h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 bg-muted/40 border-t">
        <div className="flex items-center justify-between w-full">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-1/4" />
        </div>
      </CardFooter>
    </Card>
  )
} 