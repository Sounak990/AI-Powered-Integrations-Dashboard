import React from "react";
import { Loader } from "lucide-react";
import BotItem from "./BotItem";

const BotSection = ({ title, subtitle, bots = [], onBotEdit, isBotDataLoading, columns = 1 }) => {
  // Determine the grid column classes based on the number of columns
  const gridClasses = `grid grid-cols-${columns} gap-2`;

  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold text-[24px]">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
      {isBotDataLoading ? (
        <Loader className="animate-spin" />
      ) : (
        <div className={gridClasses}>
          {bots.length > 0 ? (
            bots.map((bot) => (
              <BotItem key={bot.bot_id} bot={bot} onEditDialog={onBotEdit} />
            ))
          ) : (
            <p>No bots available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default BotSection;
