/* eslint-disable react/prop-types */
import React, { useCallback, useMemo, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import CallSvg from "../../../../assets/images/svg/phone.svg";
import { Separator } from "@/components/ui/separator";
import voiceData from "@/components/bots/voiceData";
import { useSelector } from "react-redux";
import Vapi from "@vapi-ai/web";
import CancelPhone from "../../../../assets/images/svg/cancel-phone.svg";
import BotCallDialog from "@/components/bots/BotCallDialog";
import config from "@/config";

const SummaryPageBotDetails = ({ conversation }) => {
  const botDetails = conversation?.bot_details || {};
  const {
    name = "Allison McDonald",
    demeanor = "Rude",
    background: scenario = "",
    company: companyName = "",
    title = "",
    personName = "Allison McDonald",
  } = botDetails;

  const [isSpeechActive, setIsSpeechActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isCallBotOpen, setIsCallBotOpen] = useState(false);

  const botTitle = title || "President at SoftTech";
  const picture = voiceData[name]?.picture || voiceData["Allison McDonald"].picture;

  const tenantId = useSelector((state) => state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id);
  const username = useSelector((state) => state.login.user?.username);

  const vapi = useMemo(() => new Vapi("d082796c-5bec-4ff7-959f-f96fdde16c86"), []);

  const generateId = (prefix) => `${prefix}-${new Date().getTime()}-${Math.floor(Math.random() * 10000)}`;

  const demeanorContent = useCallback(() => {
    const demeanorDescriptions = {
      Rude: `Imagine you are the ${title} at ${companyName}. You are slightly rude when your work is interrupted. Keep your responses short. You are difficult to book meetings with but sometimes will make time if a salesperson sparks your interest. ${scenario} As you are working, you get distracted by your phone buzzing. You think, "Fuck. Probably another cold caller." You let it ring for a bit, but your curiosity gets the best of you, and you decide to answer the call. Your name is ${personName}.`,
      Friendly: `Imagine you are the ${title} at ${companyName}. People generally consider you as a friendly person. Keep your responses short. You are difficult to book meetings with but sometimes will make time if a salesperson sparks your interest. ${scenario} As you are working, you get distracted by your phone buzzing. You think, "Probably another cold caller." You let it ring for a bit, but your curiosity gets the best of you, and you decide to answer the call. Your name is ${personName}.`,
      Inquisitive: `Imagine you are the ${title} at ${companyName}. People generally consider you an inquisitive person. Keep your responses short. You are difficult to book meetings with but sometimes will make time if a salesperson sparks your interest. ${scenario} As you are working, you get distracted by your phone buzzing. You think, "Probably another cold caller." You let it ring for a bit, but your curiosity gets the best of you, and you decide to answer the call. Your name is ${personName}.`,
      Skeptic: `Imagine you are the ${title} at ${companyName}. People generally consider you a skeptical person. Keep your responses short. You are difficult to book meetings with but sometimes will make time if a salesperson sparks your interest. ${scenario} As you are working, you get distracted by your phone buzzing. You think, "Probably another cold caller." You let it ring for a bit, but your curiosity gets the best of you, and you decide to answer the call. Your name is ${personName}.`,
      Discovery: `Imagine you are the ${title} at ${companyName}. Keep your responses short. You are skeptical by nature. You always speak your mind and object to things that don’t make sense to you. ${scenario} Last week, you booked a meeting for a salesperson. A week has passed, and now you are on the video meeting with the salesperson. This meeting will be a discovery call where the salesperson will try to determine if your company is a good fit for their product. Your name is ${personName}.`,
    };
    return demeanorDescriptions[demeanor] || "";
  }, [title, companyName, scenario, demeanor, personName]);

  const handleStartRecording = async () => {
    setIsLoading(true);
    const newConversationId = generateId("conv");
    try {
      await vapi.start({
        voice: {
          model: "eleven_turbo_v2",
          voiceId: voiceData[name]?.voiceId,
          provider: "11labs",
          stability: 0.5,
          similarityBoost: 0.75,
        },
        model: {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: demeanorContent(),
            },
          ],
          provider: "openai",
          functions: [],
          maxTokens: 250,
          temperature: 0.7,
        },
        recordingEnabled: true,
        firstMessage: "Hello? Who's this?",
        metadata: {
          conversationId: newConversationId,
          tenantId,
          userName: username,
          roleplay_id: generateId("RP"),
        },
        serverUrl: `${config.api.BASE_URL}/vapi-logs/`,
        clientMessages: ["transcript", "hang", "function-call", "speech-update", "metadata", "conversation-update"],
        serverMessages: ["end-of-call-report", "status-update", "hang", "function-call"],
      });
      setIsSpeechActive(true);
    } catch (error) {
      console.error("Error starting the call:", error);
      setIsSpeechActive(false);
    }
    setIsLoading(false);
  };

  const handleExitConversation = async () => {
    setIsLoading(true);
    try {
      await vapi.stop();
      setIsSpeechActive(false);
    } catch (error) {
      console.error("Error stopping the call:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    const vapiInstance = vapi;
  
    if (vapiInstance) {
      vapiInstance.on("speech-start", () => setIsSpeechActive(true));
      vapiInstance.on("speech-end", () => setIsSpeechActive(false));
      vapiInstance.on("call-start", () => setIsCallActive(true));
      vapiInstance.on("call-end", () => setIsCallActive(false));
      vapiInstance.on("message", (message) => {
        const transcriptLower = message.transcript?.toLowerCase() ?? "";
        if (transcriptLower.includes("bye") || transcriptLower.includes("hanging up")) {
          setTimeout(() => handleExitConversation(), 1000);
        }
      });
  
      // Cleanup function
      return () => {
        if (vapiInstance && typeof vapiInstance.stop === "function") {
          try {
            vapiInstance.stop().catch(console.error);
          } catch (error) {
            console.error("Error stopping the VAPI instance:", error);
          }
        }
        if (vapiInstance?.removeAllListeners) {
          vapiInstance.removeAllListeners();
        }
      };
    }
  }, [vapi]);



  return (
    <div className="w-full flex flex-col">
      <BotCallDialog
        selectedBot={{
          botName: personName,
          title,
          companyName,
          scenario,
          demeanor,
        }}
        open={isCallBotOpen}
        setOpen={setIsCallBotOpen}
        isCallActive={isCallActive}
        handleStartRecording={handleStartRecording}
        handleExitConversation={handleExitConversation}
      />
      <div className="flex flex-row items-center w-full h-max justify-between">
        <div className=" flex flex-row items-center w-max gap-2 ">
          <img src={picture} className="h-10 w-10 rounded-full " />
          <div className="flex flex-col h-max w-max gap-1">
            <p className="font-semibold leading-[22px] text-white text-sm ">
              {personName}
            </p>
            <p className="font-normal text-mutedtext text-sm">{botTitle}</p>
          </div>
        </div>
        <Button
          className="!border-primaryColor bg-background flex flex-row items-center gap-2"
          variant="outline"
          onClick={() => setIsCallBotOpen(true)}
        >
          <img src={CallSvg} className="w-4 h-4" />
          <p className="text-primaryColor">Call</p>
        </Button>
      </div>
      <Separator className="w-full text-mutedtext mt-2" />
    </div>
  );
};

export default SummaryPageBotDetails;
