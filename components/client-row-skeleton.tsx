import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function ClientRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar */}
          <div>
            <Skeleton className="h-4 w-[120px] mb-1" /> {/* Name */}
            <Skeleton className="h-3 w-[90px]" /> {/* Join date */}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-1">
          <Skeleton className="h-4 w-[180px]" /> {/* Email */}
          <Skeleton className="h-3 w-[100px]" /> {/* Phone */}
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" /> {/* Calendar icon */}
          <div>
            <Skeleton className="h-4 w-[80px] mb-1" /> {/* Total bookings */}
            <Skeleton className="h-3 w-[120px]" /> {/* Active/completed */}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4" /> {/* Credit card icon */}
          <Skeleton className="h-4 w-[80px]" /> {/* Total spent */}
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[90px]" /> {/* Last booking */}
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-[80px] rounded-full" /> {/* Status Badge */}
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-8 w-8 ml-auto" /> {/* Actions Dropdown */}
      </TableCell>
    </TableRow>
  );
} 