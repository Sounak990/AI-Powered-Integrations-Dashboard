/* eslint-disable react/prop-types */

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React from "react";
import { useState } from "react";
import BotForm from "./BotForm";

const AddBotForm = ({ onSaveBot }) => {
  const [open, setOpen] = useState(false);

  const initialValues = {
    botName: "",
    personaTitle: "",
    companyName: "",
    demeanor: "",
    scenario: "",
    personName: "",
    discoveryCall: false,
  };

  return (
    <BotForm
      open={open}
      setOpen={setOpen}
      onSaveBot={onSaveBot}
      initialValues={initialValues}
      actionButtonText={"Create Bot"}
    >
      <Button className="bg-primaryColor text-white flex flex-row items-center gap-3">
        <Plus className="h-5 w-5" />
        <p>Create Bot</p>
      </Button>
    </BotForm>
  );
};

export default AddBotForm;
