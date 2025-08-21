/* eslint-disable react/prop-types */
import React from "react";
import BotForm from "./BotForm";
import { useMemo } from "react";

const EditBotForm = ({ bot, onBotUpdate, open, setOpen }) => {
  const initialValues = useMemo(() => ({
    botName: bot?.botName || "",
    personaTitle: bot?.title || "",
    companyName: bot?.companyName || "",
    demeanor: bot?.demeanor || "",
    scenario: bot?.scenario || "",
    personName: bot?.personName || "",
    discoveryCall: bot?.discoveryCall || false,
  }));

  return (
    <BotForm
      open={open}
      setOpen={setOpen}
      onSaveBot={async (
        personaTitle,
        companyName,
        scenario,
        botName,
        personName,
        demeanor,
        discoveryCall
      ) => {
        await onBotUpdate(
          bot.bot_id,
          personaTitle,
          companyName,
          scenario,
          demeanor,
          botName,
          personName,
          discoveryCall
        );
      }}
      initialValues={initialValues}
      actionButtonText={"Save Changes"}
    />
  );
};

export default EditBotForm;
