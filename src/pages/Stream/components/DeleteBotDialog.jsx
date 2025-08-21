/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import DeleteIcon from "../../../assets/images/svg/trash.svg";

import React from "react";
import { Button } from "@/components/ui/button";

const DeleteBotDialog = ({ open, setOpen }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] !bg-card-color ">
        <DialogHeader>
          <DialogTitle className="flex flex-row gap-4 items-center text-wrap text-left">
            <img src={DeleteIcon} className="w-8 h-8" />
            <h1 className="font-semibold text-2xl">
              Are you sure you want to delete this bot?
            </h1>
          </DialogTitle>
        </DialogHeader>
        <DialogFooter>
          <DialogClose>
            <Button className="bg-primaryColor/20 text-primaryColor !border-none">
              No, Cancel
            </Button>
          </DialogClose>
          <Button className="!border-none bg-red-500 text-white">
            Yes, Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteBotDialog;
