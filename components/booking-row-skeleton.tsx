import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function BookingRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-[70px]" /> {/* ID */}
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[150px]" /> {/* Customer */}
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[120px]" /> {/* Car */}
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[180px]" /> {/* Dates */}
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[80px]" /> {/* Amount */}
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-[90px] rounded-full" /> {/* Status Badge */}
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-8 w-8" /> {/* Actions Dropdown */}
      </TableCell>
    </TableRow>
  );
} 