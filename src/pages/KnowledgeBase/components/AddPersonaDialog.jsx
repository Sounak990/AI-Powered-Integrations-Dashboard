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
import { Textarea } from "@/components/ui/textarea";

const AddPersonaDialog = ({ savePersona, open, setOpen }) => {
  const [name, setName] = useState("");
  const [painPointsandChallanges, setPainPointsandChallanges] = useState("");
  const [typicalObjection, setTypicalObjection] = useState("");

  const resetValues = () => {
    setName("");
    setPainPointsandChallanges("");
    setTypicalObjection("");
  };

  const handleSavePersona = () => {
    savePersona({
      name: name,
      painPoints: painPointsandChallanges,
      objections: typicalObjection,
    });
    setOpen(false);
    resetValues();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        resetValues();
      }}
    >
      <DialogContent className="bg-card-color sm:max-w-[425px]">
        <DialogHeader className="text-left">
          <DialogTitle>Add Persona</DialogTitle>
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
            <Textarea
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
            <Textarea
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
            Add Persona
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddPersonaDialog;
