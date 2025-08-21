/* eslint-disable react/prop-types */
import React from "react";
import BotMood from "../../components/BotMood";
import { formatDateAndTime } from "@/lib/utils";
import { useMemo } from "react";
import { Dot } from "lucide-react";

const SummeryPageConversationInfo = ({ conversation }) => {
  const formattedCreatedDate = useMemo(() => {
    return formatDateAndTime(new Date(conversation.call_createdAt));
  }, [conversation]);

  return (
    <div className="flex flex-col w-full pt-4">
      <div className="flex flex-row justify-between w-full gap-4">
        {/* main heading */}
        <h3 className="font-semibold text-lg text-white">Summary</h3>

        <BotMood
          botMood={conversation?.bot_details?.demeanor ?? "Inquisitive"}
        />
      </div>
      <p className="font-normal text-base text-white/75 w-full pt-3">
        {conversation.summary}
      </p>
      <div className="flex flex-row items-center gap-2 text-sm text-mutedtext pt-3">
        <p>{formattedCreatedDate.formattedDate}</p>
        <div className="flex flex-row items-center">
          <Dot className="text-[#6A6A6A]" />
          <p>{formattedCreatedDate.formattedTime}</p>
        </div>
      </div>
    </div>
  );
};

export default SummeryPageConversationInfo;
