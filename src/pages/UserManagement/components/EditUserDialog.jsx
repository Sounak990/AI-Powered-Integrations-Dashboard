/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";
import PencilIcon from "../../../assets/images/svg/pencil.svg";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { DialogClose } from "@radix-ui/react-dialog";

const EditUserDialog = ({ row }) => {
  const [name, setName] = useState(row.name);
  const [email, setEmail] = useState(row.email);
  const [role, setRole] = useState(row.role);

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleRoleChange = (value) => setRole(value);

  return (
    <Dialog className="!border-none">
      <DialogTrigger asChild>
        <Button variant="ghost">
          <img src={PencilIcon} className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card-color sm:max-w-[425px] !border-none">
        <DialogHeader className="text-left">
          <DialogTitle className="flex flex-row items-center gap-2">
            <img src={PencilIcon} className="h-6 w-6" />
            <p>Edit User</p>
          </DialogTitle>
        </DialogHeader>
        <Separator className="bg-mutedtext w-full" />
        <div className="w-full flex flex-col gap-10">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name" className="text-mutedtext">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={handleNameChange}
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-mutedtext">
              Email Address
            </Label>
            <Input
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full"
            />
          </div>
          <div className="flex flex-col gap-3">
            <Label
              htmlFor="radiogroup"
              className="text-white font-semibold text-base"
            >
              Role
            </Label>
            <RadioGroup
              id="radiogroup"
              value={role}
              onValueChange={handleRoleChange}
              className="flex flex-row items-center gap-3"
            >
              <div className="flex flex-row items-center gap-3">
                <RadioGroupItem value="Admin" id="radio-admin" />
                <Label htmlFor="radio-admin" className="text-white !m-0">
                  Admin
                </Label>
              </div>
              <div className="flex flex-row items-center gap-3">
                <RadioGroupItem value="User" id="radio-user" />
                <Label htmlFor="radio-user" className="text-white !m-0">
                  User
                </Label>
              </div>
            </RadioGroup>
          </div>
          <Separator className="text-mutedtext w-full" />
        </div>
        <DialogFooter>
          <DialogClose>
            <Button className="bg-primaryColor/25 text-primaryColor">
              Cancel
            </Button>
          </DialogClose>
          <Button className="bg-primaryColor text-white">Update User</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
