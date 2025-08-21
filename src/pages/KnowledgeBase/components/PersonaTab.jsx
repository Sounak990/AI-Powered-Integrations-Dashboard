import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  sendPersona,
  fetchPersonasByTenant,
  updatePersona,
} from "../../../services/api";
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
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader } from "lucide-react";
import { ChevronRight } from "lucide-react";
import EditPersonaDialog from "./EditPersonaDialog";
import AddPersonaDialog from "./AddPersonaDialog";
import { useToast } from "@/components/ui/use-toast";

const MAX_TEXT_LENGTH = 100;

const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

const PersonaTab = ({ addPersonaButtonRef }) => {
  const [personaModal, setPersonaModal] = useState(false);
  const [viewModal, setViewModal] = useState(false);
  const [viewContent, setViewContent] = useState({});
  const [personas, setPersonas] = useState([]);
  const [currentPersona, setCurrentPersona] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddPersonaDialogOpen, setIsAddPersonaDialogOpen] = useState(false);

  const [sorting, setSorting] = React.useState([]);
  const [columnFilters, setColumnFilters] = React.useState([]);
  const [columnVisibility, setColumnVisibility] = React.useState({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });

  const { toast } = useToast();

  const columns = [
    {
      accessorKey: "name",
      header: "NAME",
    },
    {
      accessorKey: "painPoints",
      header: "PAIN POINTS/OBJECTIONS",
      cell: ({ row }) => {
        const [showMore, setShowMore] = React.useState(false);
        const text = row.original.painPoints;
        const shouldShowButton = text.length > 100;
        const displayedText =
          shouldShowButton && !showMore ? `${text.substring(0, 100)}...` : text;

        return (
          <div>
            <p className="w-[300px] lg:w-[500px]">{displayedText}</p>
            {shouldShowButton && (
              <button
                onClick={() => setShowMore(!showMore)}
                className="text-primaryColor"
              >
                {showMore ? "Read Less" : "Read More"}
              </button>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "objections",
      header: "TYPICAL OBJECTIONS",

      cell: ({ row }) => {
        const [showMore, setShowMore] = React.useState(false);
        const text = row.original.objections;
        const shouldShowButton = text.length > 100;
        const displayedText =
          shouldShowButton && !showMore ? `${text.substring(0, 100)}...` : text;

        return (
          <div>
            <p className="w-[300px] lg:w-[500px]">{displayedText}</p>
            {shouldShowButton && (
              <button
                onClick={() => setShowMore(!showMore)}
                className="text-primaryColor"
              >
                {showMore ? "Read Less" : "Read More"}
              </button>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "ACTIONS",
      enableHiding: false,
      cell: ({ row }) => {
        const data = row.original;
        console.log("row data", data);
        return (
          <EditPersonaDialog
            savePersona={savePersona}
            row={data}
            isEdit={true}
          />
        );
      },
    },
  ];

  const table = useReactTable({
    data: personas,
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

  const tenantId = useSelector(
    (state) =>
      state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id
  );
  const username = useSelector((state) => state.login.user?.username);

  const togglePersonaModal = () => {
    setPersonaModal(!personaModal);
    setError(null); // Reset error when toggling the modal
  };

  const toggleViewModal = () => {
    setViewModal(!viewModal);
  };

  const savePersona = async (personaData, currentName) => {
    try {
      setLoading(true);
      let updatedPersonas;

      if (currentName) {
        // Update existing persona
        await updatePersona(tenantId, currentName, {
          ...personaData,
          username,
          tenantId,
        });
        updatedPersonas = personas.map((p) =>
          p.name === currentName ? { ...personaData, name: currentName } : p
        );
        toast({
          variant: "success",
          title: "Success",
          description: "Persona updated successfully",
        });
      } else {
        // Add new persona
        const addedPersona = await sendPersona({
          ...personaData,
          username,
          tenantId,
        });
        updatedPersonas = [
          ...personas,
          { ...personaData, name: addedPersona.name },
        ];

        toast({
          variant: "success",
          title: "Success",
          description: "Persona added successfully",
        });
      }

      setPersonas(updatedPersonas);
      setCurrentPersona(null); // Reset currentPersona after save
      togglePersonaModal();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast({
          variant: "destructive",
          title: "Failure",
          description:
            "Persona with this name already exists. Please choose a different name.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failure",
          description: "Failed to save persona. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchPersonas = async () => {
      if (tenantId) {
        try {
          setLoading(true);
          const personas = await fetchPersonasByTenant(tenantId);
          setPersonas(personas);
        } catch (error) {
          setError("Failed to fetch personas. Please try again.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPersonas();
  }, [tenantId]);

  useEffect(() => {
    const buttonElement = addPersonaButtonRef.current;

    const handleClick = () => {
      setIsAddPersonaDialogOpen(true);
    };

    if (buttonElement) {
      buttonElement.addEventListener("click", handleClick);
    }

    // Clean up the event listener on component unmount
    return () => {
      if (buttonElement) {
        buttonElement.removeEventListener("click", handleClick);
      }
    };
  }, []);

  const handleViewMore = (content) => {
    setViewContent(content);
    toggleViewModal();
  };

  const handleEditPersona = (persona) => {
    setCurrentPersona(persona);
    togglePersonaModal();
  };

  return (
    <div className="flex flex-col w-full h-full items-center ">
      <AddPersonaDialog
        open={isAddPersonaDialogOpen}
        setOpen={setIsAddPersonaDialogOpen}
        savePersona={savePersona}
      />
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
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              {loading ? (
                <Loader className="animate-spin m-7" />
              ) : (
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              )}
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
              {personas.length < 10 ? personas.length : 10}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-white">{personas.length}</span>
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

export default PersonaTab;
