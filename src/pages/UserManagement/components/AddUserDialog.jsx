/* eslint-disable react/prop-types */
import React, { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Loader, Plus } from "lucide-react";
import MailIcon from "../../../assets/images/svg/mail-icon.svg";

const AddUserDialog = ({ email, setEmail, handleSubmit }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmitPress = async () => {
    setLoading(true);
    await handleSubmit();
    setLoading(false);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primaryColor flex flex-row items-center gap-3 text-white">
          <Plus className="text-white" />
          <p className="text-base font-medium">Add User</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card-color sm:max-w-[425px] !border-none">
        <DialogHeader className="text-left">
          <DialogTitle>Add User</DialogTitle>
        </DialogHeader>
        <Separator className="w-full text-mutedtext" />
        <div className="w-full flex flex-col">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="email" className="text-white">
              Email Address
            </Label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <img src={MailIcon} className="w-5 h-5" />
              </div>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={setEmail}
                placeholder="Enter your email"
                className="!pl-10"
              />
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose>
            <Button
              className="bg-primaryColor/15 text-primaryColor"
              disabled={loading}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="bg-primaryColor text-white flex flex-row items-center gap-3"
            onClick={handleSubmitPress}
            disabled={loading}
          >
            {loading && <Loader className="animate-spin" />}
            <p>Submit</p>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserDialog;
