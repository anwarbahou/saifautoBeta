import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function ClientRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-[70px]" /> {/* ID */}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar */}
          <Skeleton className="h-4 w-[120px]" /> {/* Name */}
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[180px]" /> {/* Email */}
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[100px]" /> {/* Phone */}
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[90px]" /> {/* Join Date */}
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-[80px] rounded-full" /> {/* Status Badge */}
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-8 w-8" /> {/* Actions Dropdown */}
      </TableCell>
    </TableRow>
  );
} 