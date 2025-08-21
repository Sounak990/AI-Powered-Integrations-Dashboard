/* eslint-disable react/prop-types */
import React, { useState } from "react";
import BotItem from "./BotItem.jsx";
import EditBotForm from "./EditBotForm.jsx";
import { useEffect } from "react";

const BotList = ({ bots, onBotEdit }) => {
  const [selectedBot, setSelectedBot] = useState(undefined);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleBotEdit = (bot) => {
    setSelectedBot(bot);
    setIsEditDialogOpen(true);
  };

  useEffect(() => {
    if (!isEditDialogOpen) {
      setSelectedBot(undefined);
    }
  }, [isEditDialogOpen]);

  return (
    <>
      <EditBotForm
        bot={selectedBot}
        open={isEditDialogOpen}
        setOpen={setIsEditDialogOpen}
        onBotUpdate={onBotEdit}
      />
      <div className="flex flex-row flex-wrap items-stretch gap-3 w-full h-max">
        {bots.length === 0 && <p>No bots available.</p>}
        {bots &&
          bots.map((bot, index) => {
            return (
              <BotItem
                key={bot.bot_id}
                bot={bot}
                onEditDialog={handleBotEdit}
              />
            );
          })}
      </div>
    </>
  );
};

export default BotList;
