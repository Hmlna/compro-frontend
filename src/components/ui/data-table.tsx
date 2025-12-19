/* eslint-disable react-hooks/incompatible-library */
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type PaginationState,
  type OnChangeFn,
  type Table as RTTable,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  rowCount,
  pagination,
  onPaginationChange,
}: DataTableProps<TData, TValue>) {
  const isServerSide = rowCount !== undefined;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    manualPagination: isServerSide,
    rowCount: rowCount,
    state: {
      ...(isServerSide && pagination ? { pagination } : {}),
    },
    onPaginationChange: onPaginationChange,

    initialState: {
      pagination: { pageSize: 10 },
    },
  });

  return (
    <div className="w-full">
      <div className="overflow-x-auto rounded-md border">
        <Table className="sm:table-fixed">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="bg-muted/50 text-black font-bold"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
        <div className="text-sm text-muted-foreground">
          {"Showing "}
          {table.getRowModel().rows?.length ? (
            <>
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                1}
              {" to "}
              {/* Logic: if server-side, calculate based on page size. If client-side, limit by data length */}
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                table.getRowCount()
              )}{" "}
              of {table.getRowCount()} row(s)
            </>
          ) : (
            "0 row(s)"
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export type { ColumnDef, RTTable };
