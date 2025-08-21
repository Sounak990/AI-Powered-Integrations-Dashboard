/* eslint-disable react/prop-types */
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Document, Page, pdfjs } from "react-pdf";
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const CompetitorItem = ({ itemData }) => {
  return (
    <Card className="w-[300px] !bg-card-color !border-none !roundex-xl">
      <CardContent className="flex flex-col w-full !p-0 ">
        <div className="flex flex-col w-full h-[300px] overflow-y-auto !rounded-tr-xl !rounded-tl-xl">
          <Document file={itemData.file} className="rounded-2xl">
            <Page
              className="!rounded-2xl"
              pageNumber={1}
              height={300}
              width={300}
            />
          </Document>
        </div>
        <div className="flex flex-row items-center justify-between w-full gap-1 px-3 py-3 ">
          <div className="flex flex-col  h-max">
            <p className="font-semibold text-sm text-white ">
              {itemData.file.name}
            </p>
            <p className="text-white/55 text-sm  truncate">{itemData.name}</p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="p-0">
                <EllipsisVertical className="h-5 w-5 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-card-color p-2">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="flex flex-row items-center gap-4"
                  onSelect={() => setIsDeleteBotDialogOpen(true)}
                >
                  <Trash2 className="text-red-500" />
                  <p>Delete</p>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => onEditDialog(bot)}
                  className="flex flex-row items-center gap-4"
                >
                  <Pencil className="text-yellow-500" />
                  <p>Edit</p>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompetitorItem;
