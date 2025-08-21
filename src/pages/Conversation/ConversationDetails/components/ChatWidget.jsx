/* eslint-disable react/prop-types */
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import ChatUserBubble from "./ChatUserBubble";
import ChatBotBubble from "./ChatBotBubble";

const ChatWidget = ({ conversation }) => {
  return (
  
        <div className="flex flex-col gap-3 overflow-x-hidden overflow-y-auto max-h-[500px] w-full">
          {conversation.messages &&
            conversation.messages.length > 0 &&
            conversation.messages
              .filter((message) => message.role !== "system")
              .map((message, index) => {
                return (
                  <>
                    {message.role === "user" ? (
                      <ChatUserBubble message={message.message} />
                    ) : (
                      <ChatBotBubble message={message.message} />
                    )}
                  </>
                );
              })}
        </div>
  );
};

export default ChatWidget;
