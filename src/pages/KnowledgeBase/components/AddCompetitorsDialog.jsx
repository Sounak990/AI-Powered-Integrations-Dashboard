/* eslint-disable react/prop-types */
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useDropzone } from "react-dropzone";
import UploadFileICon from "../../../assets/images/svg/upload-file.svg";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { useState } from "react";

const FormSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  notes: z.string().optional(),
  file: z
    .instanceof(File, {
      message: "File must be a valid PDF file.",
    })
    .refine((file) => file.type === "application/pdf", {
      message: "Only PDF files are accepted.",
    }),
});

const AddCompetitorsDialog = ({
  isAddCompetitorsOpen,
  setIsAddCompetitorsOpen,
  addCompetitor,
}) => {
  const [open, setOpen] = useState(false);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    maxFiles: 1,
    accept: {
      "application/pdf": [".pdf"],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        form.setValue("file", acceptedFiles[0]);
      }
    },
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      notes: "",
      file: undefined,
    },
  });

  const fileWatcher = form.watch("file");

  function onSubmit(data) {
    setOpen(false);
    addCompetitor(data);

    form.reset();
  }

  return (
    <Dialog
      className="!bg-card-color !border-none"
      open={open}
      onOpenChange={setOpen}
    >
      <DialogTrigger asChild>
        <Button className="text-white flex flex-row items-center gap-4">
          <Plus className="fill-white" />
          <p className="font-medium text-white text-base">Add Competitor</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] !bg-card-color !border-none">
        <DialogHeader>
          <DialogTitle className="text-left font-semibold text-white text-[22px]">
            Add Competitor
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input id="name" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <>
                  <div
                    {...getRootProps({
                      className: `flex flex-row items-center justify-center h-[100px] w-full border !border-dashed rounded-xl border-spacing-2 !border-primaryColor ${
                        isDragActive ? "bg-primaryColor" : "bg-primaryColor/25"
                      }`,
                    })}
                  >
                    <div className="flex flex-row items-center gap-3">
                      <input {...getInputProps()} />
                      <img src={UploadFileICon} className="w-[47px] h-[47px]" />
                      <div className="flex flex-col gap-1">
                        <p className="font-semibold text-lg leading-[22px]">
                          Upload Roleplay File
                        </p>
                        <p className="text-white/55 text-sm">
                          Click or Drag & Drop
                        </p>
                      </div>
                    </div>
                  </div>
                  {fileWatcher && (
                    <p className="truncate">{fileWatcher.name}</p>
                  )}
                  <FormMessage />
                </>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea id="notes" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCompetitorsDialog;
