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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatDateAndTime } from "@/lib/utils";
import PersonIcon from "../../../assets/images/svg/person.svg";
import { Badge } from "@/components/ui/badge";
import { COLD_CALL, FREQUENCY_DAILY } from "../constants";
import { useMemo } from "react";
import PencilIcon from "../../../assets/images/svg/pencil.svg";

const AssignmentsTable = ({ assignments, handleRowClick, handleEditClick }) => {
  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const [selectedAssignment, setSelectedAssignment] = useState(undefined);

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "NAME",
      },
      {
        header: "START DATE",
        cell: ({ row }) => {
          const rowData = row.original;

          return (
            <p className="text-mutedtext">
              {formatDateAndTime(new Date(rowData.created_at)).formattedDate}
            </p>
          );
        },
      },
      {
        header: "END DATE",
        cell: ({ row }) => {
          const rowData = row.original;

          return (
            <p className="text-mutedtext">
              {formatDateAndTime(new Date(rowData.end_date)).formattedDate}
            </p>
          );
        },
      },

      {
        header: "ASSIGNEE",
        cell: ({ row }) => {
          const rowData = row.original;
          const assignee = rowData?.assignees;
          return (
            <div className="text-white flex flex-row items-center gap-3 ">
              {assignee &&
                assignee.map((person, index) => {
                  return (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <img src={PersonIcon} />
                        </TooltipTrigger>
                        <TooltipContent>{person.label}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  );
                })}
            </div>
          );
        },
      },
      {
        header: "FREQUENCY",
        cell: ({ row }) => {
          const rowData = row.original;
          const frequency = rowData.frequency;
          return (
            <>
              {frequency === FREQUENCY_DAILY ? (
                <Badge className="bg-[#26BBFA]/25 text-[#26BBFA] !p-2 !rounded-md !border-none ">
                  Daily
                </Badge>
              ) : (
                <Badge className="bg-[#26BBFA]/25 text-[#26BBFA] !p-2 !rounded-md !border-none ">
                  Weekly
                </Badge>
              )}
            </>
          );
        },
      },

      {
        header: "TYPE OF CALL",
        cell: ({ row }) => {
          const rowData = row.original;
          const callType = rowData.call_type;
          return (
            <>
              {callType === COLD_CALL ? (
                <Badge className="bg-white/25 text-white !p-2 !rounded-md !border-none ">
                  Cold Call
                </Badge>
              ) : (
                <Badge className="bg-white/25 text-white !p-2 !rounded-md !border-none ">
                  Discovery
                </Badge>
              )}
            </>
          );
        },
      },

      {
        header: "ACTIONS",
        cell: ({ row }) => {
          return (
            <Button
              variant="ghost"
              className="z-50"
              onClick={() => {
                handleEditClick(row.original);
              }}
            >
              <img src={PencilIcon} className="w-5 h-5" />
            </Button>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: assignments,
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
    <div className="w-full flex flex-col">
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
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell
                      className="!p-2"
                      key={cell.id}
                      onClick={() => {
                        if (cell.column.columnDef.header !== "ACTIONS") {
                          handleRowClick(row.original);
                        }
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
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
              {assignments.length < 10 ? assignments.length : 10}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-white">
              {assignments.length}
            </span>
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

export default AssignmentsTable;
