import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Loader } from "lucide-react";
import VoiceCarousel from "./voiceCarousel";
import voiceData from "@/components/bots/voiceData";

const FormSchema = z.object({
  botName: z.string().min(2, "Bot Name is Required"),
  personaTitle: z.string().min(2, "Persona Title is Required"),
  companyName: z.string().min(1, "Company Name is Required"),
  demeanor: z.string().min(1, "Please select a demeanor."),
  scenario: z.string().max(200, "Scenario must be at most 200 characters.").min(1, "Scenario is required"),
  personName: z.string().min(1, "Person name is required"),
  discoveryCall: z.boolean(),
});

const prepareCarouselItems = (voiceData) => {
  return Object.keys(voiceData).map((name) => ({
    src: voiceData[name].picture,
    altText: name,
  }));
};

const BotForm = ({
  onSaveBot,
  children,
  open,
  setOpen,
  initialValues,
  actionButtonText,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(initialValues?.personName || "");

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      ...initialValues,
      personName: selectedPerson,
    },
  });

  // Prepare the carousel items from voiceData
  const carouselItems = prepareCarouselItems(voiceData);

  // Update botName whenever personName changes
  useEffect(() => {
    form.setValue("botName", form.watch("personName"));
  }, [form.watch("personName"), form.setValue]);

  const handleImageSelect = (personName) => {
    setSelectedPerson(personName);
    form.setValue("personName", personName);
  };

  async function onSubmit(data) {
    setLoading(true);
    await onSaveBot(
      data.personaTitle,
      data.companyName,
      data.scenario,
      data.botName,
      data.personName,
      data.demeanor,
      data.discoveryCall
    );
    setLoading(false);
    setOpen(false);
  }

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues]);

  return (
    <Dialog
      open={open}
      onOpenChange={setOpen}
      className="!bg-card-color !border-none"
    >
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="max-w-full w-[90%] sm:w-[500px] lg:w-[700px] max-h-[90vh] overflow-y-auto !bg-card-color !border-none">
        <DialogHeader className="text-left">
          <DialogTitle>Build a bot</DialogTitle>
        </DialogHeader>
        <Separator className="text-mutedtext w-full" />
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-2 w-full"
          >
            <h3>Choose your character</h3>
            {/* Voice Carousel */}
            <div className="h-40 overflow-hidden">
              <VoiceCarousel items={carouselItems} onImageSelect={handleImageSelect} />
            </div>

            {/* Rest of your form fields */}
            <div className="flex flex-col sm:flex-row sm:gap-2 lg:gap-4 flex-wrap w-full">
              <FormField
                control={form.control}
                name="botName"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full">
                    <FormLabel>Bot Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full h-8" disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personaTitle"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full">
                    <FormLabel>Persona Title</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full h-8" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:gap-2 lg:gap-4 flex-wrap w-full">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full">
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="w-full h-8" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="demeanor"
                render={({ field }) => (
                  <FormItem className="flex-1 w-full">
                    <FormLabel>Demeanor</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full h-8">
                          <SelectValue placeholder="Select a Demeanor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Rude">Rude</SelectItem>
                          <SelectItem value="Friendly">Friendly</SelectItem>
                          <SelectItem value="Inquisitive">Inquisitive</SelectItem>
                          <SelectItem value="Skeptic">Skeptic</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="discoveryCall"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md mt-2 md:mt-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Discovery Call</FormLabel>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scenario"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    Scenario{" "}
                    <span className="text-primaryColor text-base font-normal">
                      (Maximum 200 characters)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="w-full !h-10"
                      placeholder="Scenario"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="personName"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Person Name</FormLabel>
                  <Select
                    value={selectedPerson}
                    onValueChange={(value) => {
                      setSelectedPerson(value);
                      form.setValue("personName", value);
                    }}
                    disabled // This will disable the dropdown
                  >
                    <FormControl>
                      <SelectTrigger className="h-8" disabled>
                        <SelectValue placeholder="Select a Person Name" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {Object.keys(voiceData).map((name, index) => (
                          <SelectItem key={index} value={name}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex flex-col sm:flex-row sm:gap-2 w-full justify-end">
              <DialogClose>
                <Button
                  className="bg-primaryColor/15 text-primaryColor !border-none"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type="submit"
                className="bg-primaryColor flex flex-row items-center gap-3 text-white"
              >
                {loading && <Loader className="animate-spin" />}
                <p>{actionButtonText}</p>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default BotForm;
