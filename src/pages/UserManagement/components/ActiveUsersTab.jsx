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
import EditUserDialog from "./EditUserDialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const columns = [
  {
    accessorKey: "name",
    header: "NAME",
  },
  {
    accessorKey: "email",
    header: "EMAIL ADDRESS ",
  },
  {
    accessorKey: "role",
    header: "ROLE",
    cell: ({ row }) => {
      const rowData = row.original;
      const userRole = rowData.role;

      return (
        <>
          {userRole === "Admin" ? (
            <>
              <Badge className="text-[#C28EF6] bg-[#9026FA]/30 !p-2 !rounded-md !border-none">
                Admin
              </Badge>
            </>
          ) : (
            <>
              <Badge className="bg-[#26FA94]/30  text-[#26FA94] !p-2 !rounded-md !border-none">
                User
              </Badge>
            </>
          )}
        </>
      );
    },
  },
  {
    header: "ACTIONS",
    cell: ({ row }) => {
      const rowData = row.original;
      return <EditUserDialog row={rowData} />;
    },
  },
];

const ActiveUsersTab = ({ usersData }) => {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });


  const table = useReactTable({
    data: usersData,
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
              {usersData.length < 10 ? usersData.length : 10}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-white">{usersData.length}</span>
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

export default ActiveUsersTab;
