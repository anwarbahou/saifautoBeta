import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function CarRowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-12 w-16 rounded-md" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[60px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[150px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[50px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[80px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[100px]" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-6 w-[80px] rounded-full" /> {/* For Badge */}
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-[70px]" />
      </TableCell>
      <TableCell className="text-right">
        <Skeleton className="h-8 w-8" /> {/* For Dropdown trigger icon */}
      </TableCell>
    </TableRow>
  );
} 