import React, { useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const InvitationSentTab = ({ inactiveUsers }) => {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });

  const columns = [
    {
      accessorKey: "email",
      header: "EMAIL ADDRESS ",
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => {
        const rowData = row.original;

        const status = rowData.status;

        return (
          <>
            {status === "Success" ? (
              <Badge className="text-[#1AE56F] bg-[#1AE56F]/25 !p-2 !rounded-md !border-none">
                Success
              </Badge>
            ) : status === "Error" ? (
              <Badge className="text-[#F0483C] bg-[#F0483C]/25 !p-2 !rounded-md !border-none">
                Error
              </Badge>
            ) : (
              <Badge className="text-[#FAC256] bg-[#FAC256]/30 !p-2 !rounded-md !border-none">
                Warning
              </Badge>
            )}
          </>
        );
      },
    },
  ];

  const table = useReactTable({
    data: inactiveUsers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <div className="w-full h-full flex flex-col gap-3 ">
      <Table>
        <TableHeader className="bg-card-color">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
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
                  <TableCell className="!p-2" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="w-full h-max bg-card-color flex flex-row-reverse py-2">
        <div className="w-max h-max flex flex-row items-center gap-2">
          {/* showing x out of x text */}
          <div className="text-nowrap text-white/50 text-sm">
            Showing{" "}
            <span className="font-semibold text-white">
              {inactiveUsers.length < 10 ? inactiveUsers.length : 10}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-white">{inactiveUsers.length}</span>
          </div>
          <div className="flex flex-row items-center gap-6">
            <Button
              variant="ghost"
              className="!p-2"
              onClick={() => {
                table.previousPage();
              }}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="text-white" />
            </Button>
            <Button
              variant="ghost"
              className="!p-2"
              onClick={() => {
                table.nextPage();
              }}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="text-white" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvitationSentTab;
