/* eslint-disable react/prop-types */
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import {
  COLD_CALL,
  DISCOVERY_CALL,
  FREQUENCY_DAILY,
  FREQUENCY_WEEKLY,
} from "../constants";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "./MultiSelect";
import { useEffect } from "react";

const CreateAssignmentDialog = ({
  title,
  setTitle,
  frequency,
  setFrequency,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedMulti,
  setSelectedMulti,
  callType,
  setCallType,
  rolePlaysPerDay,
  setRolePlaysPerDay,
  selectedPersona,
  setSelectedPersona,
  assignes,
  personas,
  onSubmit,
  open,
  setOpen,
  isEditMode,
  setIsEditMode,
  setPersonas,
}) => {
  useEffect(() => {
    if (isEditMode&&personas&&selectedPersona) {
      const matchingPersona = personas.find((persona) => {
        return persona.name === selectedPersona;
      });
      if (!matchingPersona) {
        setPersonas((prev) => {
          return [
            ...prev,
            { name: selectedPersona, objections: "", painPoints: "" },
          ];
        });
      }
    }
  }, [isEditMode, personas, selectedPersona]);
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        isEditMode && setIsEditMode(false);
      }}
    >
      <DialogTrigger asChild>
        <Button className="bg-primaryColor text-white  flex flex-row items-center gap-3">
          <Plus />
          <p className="text-base">Create Assignment</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card-color sm:max-w-[700px] !border-none">
        <DialogHeader className="text-left">
          <DialogTitle>
            {isEditMode ? "Edit Assignment" : "Create Assignment"}
          </DialogTitle>
        </DialogHeader>
        <Separator className="w-full text-mutedtext my-3" />
        <div className="flex flex-col gap-3 w-full h-max ">
          {/* Assignment name and frequency row */}
          <div className="flex flex-row items-center gap-3">
            {/* assignment name */}
            <div className="flex flex-col w-full">
              <Label htmlFor="name">Assignment Name</Label>
              <Input
                className="w-full h-11"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* frequency */}
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="frequency">Frequency</Label>
              <RadioGroup
                id="frequency"
                className="w-full flex flex-row items-center"
                value={frequency}
                onValueChange={(value) => setFrequency(value)}
              >
                <div className="flex flex-row items-center gap-2">
                  <RadioGroupItem value={FREQUENCY_DAILY} id="r1" />
                  <Label className="!m-0" htmlFor="r1">
                    Daily
                  </Label>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <RadioGroupItem value={FREQUENCY_WEEKLY} id="r2" />
                  <Label className="!m-0" htmlFor="r2">
                    Weekly
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          {/* start date and end date row */}
          <div className="flex flex-row items-center gap-3">
            {/* start date */}
            <div className="flex flex-col w-full">
              <Label htmlFor="startDate">Start Date</Label>
              <Popover id="startDate">
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {/* end date */}
            <div className="flex flex-col w-full">
              <Label htmlFor="endDate">End Date</Label>
              <Popover id="endDate">
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          {/* Assignee and type of call row */}
          <div className="flex flex-row items-center gap-3">
            {/* assignee */}
            <div className="flex flex-col w-full">
              <Label htmlFor="assignee">Assignee</Label>
              <MultiSelect
                options={assignes}
                selected={selectedMulti}
                onChange={(value) => {
                  setSelectedMulti(value);
                }}
              />
            </div>
            {/* type of call */}
            <div className="flex flex-col gap-2 w-full">
              <Label htmlFor="call_type">Type of Call</Label>
              <RadioGroup
                id="call_type"
                className="w-full flex flex-row items-center"
                value={callType}
                onValueChange={(value) => setCallType(value)}
              >
                <div className="flex flex-row items-center gap-2">
                  <RadioGroupItem value={COLD_CALL} id="cold-call" />
                  <Label className="!m-0" htmlFor="cold-call">
                    Cold Call
                  </Label>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <RadioGroupItem value={DISCOVERY_CALL} id="discovery-call" />
                  <Label className="!m-0" htmlFor="discovery-call">
                    Discovery
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          {/* personas and roleplay per day */}
          <div className="flex flex-row items-center gap-3">
            {/* persona */}
            <div className="flex flex-col w-full">
              <Label htmlFor="persona">Select Persona</Label>
              <Select
                id="persona"
                value={selectedPersona}
                onValueChange={(value) => setSelectedPersona(value)}
              >
                <SelectTrigger className="full">
                  <SelectValue placeholder="Persona" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="persona1">Persona 1</SelectItem>
                  <SelectItem value="persona2">Persona 2</SelectItem>
                  <SelectItem value="persona3">Persona 3</SelectItem> */}
                  {personas.map((persona, index) => {
                    return (
                      <SelectItem key={index} value={persona.name}>
                        {persona.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col w-full">
              <Label>Roleplays Per Day</Label>
              <Input
                className="w-full h-11"
                type="number"
                value={rolePlaysPerDay}
                onChange={(e) => setRolePlaysPerDay(e.target.value)}
              />
            </div>
          </div>
          <Separator className="w-full text-mutedtext my-3" />
        </div>
        <DialogFooter>
          <DialogClose>
            <Button className="bg-primaryColor/15 text-primaryColor">
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="bg-primaryColor text-white"
            onClick={() => {
              onSubmit();
              setOpen(false);
            }}
          >
            {isEditMode ? "Edit Assignment" : "Create Assignment"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAssignmentDialog;
