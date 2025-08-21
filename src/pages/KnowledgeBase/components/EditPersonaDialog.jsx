/* eslint-disable react/prop-types */
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useState } from "react";
import PencilEditICon from "../../../assets/images/svg/pencil.svg";

const EditPersonaDialog = ({ savePersona, row, isEdit }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(row?.name || "");
  const [painPointsandChallanges, setPainPointsandChallanges] = useState(
    row?.painPoints || ""
  );
  const [typicalObjection, setTypicalObjection] = useState(
    row?.objections || ""
  );

  const handleSavePersona = () => {
    savePersona(
      {
        name: name,
        painPoints: painPointsandChallanges,
        objections: typicalObjection,
      },
      row?.name
    );
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {isEdit && (
        <DialogTrigger asChild>
          <Button variant="ghost" className="">
            <img
              src={PencilEditICon}
              className="h-5 w-5 max-w-5 min-w-5 max-h-5 min-h-5"
            />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="bg-card-color sm:max-w-[425px]">
        <DialogHeader className="text-left">
          <DialogTitle>Edit Persona</DialogTitle>
        </DialogHeader>
        <div className="flex w-full h-max flex-col  gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              className="w-full"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="painpointschallanges">Painpoints/Challenges</Label>
            <Input
              id="painpointschallanges"
              className="w-full"
              value={painPointsandChallanges}
              onChange={(e) => {
                setPainPointsandChallanges(e.target.value);
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="typicalobjection">Typical Objections</Label>
            <Input
              id="typicalobjection"
              className="w-full"
              value={typicalObjection}
              onChange={(e) => {
                setTypicalObjection(e.target.value);
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button className="bg-primaryColor/15 text-primaryColor">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="bg-primaryColor text-white"
            onClick={handleSavePersona}
          >
            Edit Persona
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditPersonaDialog;
