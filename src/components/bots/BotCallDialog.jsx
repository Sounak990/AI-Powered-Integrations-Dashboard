/* eslint-disable react/prop-types */
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import voiceData from "@/components/bots/voiceData";
import { Separator } from "@/components/ui/separator";
import BotMood from "@/pages/Conversation/components/BotMood";
import { Button } from "@/components/ui/button";
import PhoneIcon from "../../assets/images/svg/phone.svg";
import BotItemCallTimer from "@/pages/Stream/components/BotItemCallTimer";
import CancelPhone from "../../assets/images/svg/cancel-phone.svg";

const BotCallDialog = ({
  selectedBot,
  open,
  setOpen,
  isCallActive,
  handleStartRecording,
  handleExitConversation,
}) => {
  const picture =
    voiceData[selectedBot.personName]?.picture ||
    voiceData["Allison McDonald"].picture; // Fallback to default picture

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!isCallActive) {
          setOpen(value);
        }
      }}
    >
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        className="sm:max-w-[425px] bg-card-color !border-none"
      >
        <div className="flex flex-col gap-4 w-full h-max">
          <div className="flex flex-col w-full gap-3">
            <div className="flex flex-row justify-center">
              <img
                src={picture}
                className="rounded-full h-24 w-24 object-cover"
              />
            </div>
            <p className="font-semibold text-2xl text-center h-max">
              {selectedBot.botName}
            </p>
            <p className="text-white/55 text-base text-center h-max">
              {selectedBot.title}
            </p>
            {isCallActive && <BotItemCallTimer isActive={isCallActive} />}
            <Separator className="bg-mutedtext w-full" />
            <div className="flex flex-row items-center justify-between ">
              <p className="font-semibold text-lg">Scenario</p>
              <BotMood botMood={selectedBot.demeanor} />
            </div>
            <p className="text-white/75 text-base font-normal">
              {selectedBot.scenario}
            </p>
            <Separator className="w-full bg-mutedtext" />
          </div>
          {!isCallActive ? (
            <Button
              className="!border-none !bg-primaryColor/15 hover:!bg-primaryColor/35 text-primaryColor flex flex-row items-center gap-3"
              onClick={() => {
                handleStartRecording();
              }}
            >
              <img src={PhoneIcon} className="w-5 h-5" />
              <p>{`Call ${selectedBot.botName.split(" ")[0]}`}</p>
            </Button>
          ) : (
            <Button
              className="!border-none !bg-[#F0483C] hover:!bg-[#F0483C]/35 text-white flex flex-row items-center gap-3"
              onClick={() => {
                handleExitConversation();
              }}
            >
              <img src={CancelPhone} className="w-5 h-5" />
              <p>End Call</p>
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BotCallDialog;
