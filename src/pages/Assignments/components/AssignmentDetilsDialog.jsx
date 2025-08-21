/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { formatDateAndTime } from "@/lib/utils";

import React from "react";
import { COLD_CALL } from "../constants";
import { Badge } from "@/components/ui/badge";

const AssignmentDetilsDialog = ({ open, setOpen, assignmentData }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px] bg-card-color !border-none">
        <DialogHeader className="text-left">
          <DialogTitle className="text-primaryColor">
            View Assignment Details
          </DialogTitle>
        </DialogHeader>
        {assignmentData && (
          <div className="flex flex-col gap-3 w-full pt-9">
            <div className="flex flex-row items-center justify-between">
              <p className="text-white/55 ">Assignment Name</p>
              <p className="font-semibold text-white">
                {assignmentData?.title}
              </p>
            </div>
            <Separator className="w-full text-mutedtext" />
            <div className="flex flex-row items-center justify-between">
              <p className="text-white/55 ">Start Date</p>
              <p className="font-semibold text-white">
                {
                  formatDateAndTime(new Date(assignmentData.start_date))
                    .formattedDate
                }
              </p>
            </div>
            <Separator className="w-full text-mutedtext" />
            <div className="flex flex-row items-center justify-between">
              <p className="text-white/55 ">End Date</p>
              <p className="font-semibold text-white">
                {
                  formatDateAndTime(new Date(assignmentData.end_date))
                    .formattedDate
                }
              </p>
            </div>
            <Separator className="w-full text-mutedtext" />
            <div className="flex flex-row items-center justify-between">
              <p className="text-white/55 ">End Date</p>

              {assignmentData.call_type === COLD_CALL ? (
                <Badge className="bg-white/25 text-white !p-2 !rounded-md !border-none ">
                  Cold Call
                </Badge>
              ) : (
                <Badge className="bg-white/25 text-white !p-2 !rounded-md !border-none ">
                  Discovery
                </Badge>
              )}
            </div>
            <Separator className="w-full text-mutedtext" />
            <div className="flex flex-row items-center justify-between">
              <p className="text-white/55 ">Persona</p>
              <p className="font-semibold text-white">
                {assignmentData?.persona}
              </p>
            </div>
            <Separator className="w-full text-mutedtext" />
            <div className="flex flex-row items-center justify-between">
              <p className="text-white/55 ">Roleplays Per Day</p>
              <p className="font-semibold text-white">
                {assignmentData?.role_plays_per_day}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentDetilsDialog;
