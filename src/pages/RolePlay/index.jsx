import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import Vapi from "@vapi-ai/web";
import "./stream.css";
import BotList from "./Components/BotList";
import BotDetails from "./Components/BotDetails";
import { addNotification } from "../../store/Notifications/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DueByTodayCard from "./Components/DueByTodayCard";
import BotCallDialot from "./Components/BotCallDialot";
import PreviousAssignments from "./Components/PreviousAssignments";
import config from "@/config";

// Util function to get demeanor content
const getDemeanorContent = ({
  title,
  companyName,
  painPoints,
  objections,
  demeanor,
}) => {
  const commonContent = `Imagine you are the ${title} at ${companyName}.
    You are difficult to book meetings with but sometimes will make time if a salesperson sparks your interest.
    Here is information about your pains and challenges: ${painPoints}
    As you are working, you get distracted by your phone buzzing. You think, "Probably another cold caller."
    You let it ring for a bit, but your curiosity gets the best of you, and you decide to answer the call.
    Below are objections that people like yourself have said during sales calls. 
    Try to say these objections during your conversation with the salesperson, but only where it makes sense and doesn't disrupt the flow of the conversation. 
    You do not have to say them in any order: ${objections}`;

  switch (demeanor) {
    case "Rude":
      return `You are slightly rude when your work is interrupted. Keep your responses short. ${commonContent}`;
    case "Friendly":
      return `People generally consider you as a friendly person. ${commonContent}`;
    case "Inquisitive":
      return `People generally consider you an inquisitive person. ${commonContent}`;
    case "Skeptic":
      return `People generally consider you a skeptical person. ${commonContent}`;
    case "Discovery":
      return `You are skeptical by nature and always speak your mind. ${commonContent}`;
    default:
      return commonContent;
  }
};

const Roleplay = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeechActive, setIsSpeechActive] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [botData, setBotData] = useState([]);
  const [selectedBot, setSelectedBot] = useState({
    botName: "",
    title: "",
    companyName: "",
    scenario: "",
    painPoints: "",
    objections: "",
    demeanor: "",
    isConnected: true,
    roleplay_id: "",
    status: "", // Add status to track the bot's completion state
  });

  const [conversationId, setConversationId] = useState(null);
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);

  // Selectors for Redux state
  const kbData = useSelector((state) => state.kbReducer?.data || []);
  const tenantId = useSelector(
    (state) =>
      state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id
  );
  const username = useSelector((state) => state.login.user?.username);
  const notifications = useSelector(
    (state) => state.notificationReducer.notifications
  );

  const vapi = useMemo(
    () => new Vapi("d082796c-5bec-4ff7-959f-f96fdde16c86"),
    []
  );

  // Extract roleplay file IDs from knowledge base data
  const roleplayFiles = kbData.filter((file) => file.type === "roleplay");
  const roleplayFileIds = roleplayFiles.map(
    (file) => file.external_response.id
  );

  // Function to handle bot selection
  const handleUseBot = useCallback((bot) => {
    if (bot.status === "completed") return; // Prevent using a completed bot

    setSelectedBot({
      botName: bot.name || bot.botName || bot.message || "",
      title: bot.title || "",
      companyName: bot.company || "",
      painPoints: bot.persona.painPoints || "",
      objections: bot.persona.objections || "",
      scenario: bot.background || "",
      demeanor: bot.demeanor || "Neutral",
      isConnected: true,
      roleplay_id: bot.roleplay_id || "",
      status: bot.status, // Track the bot's status
    });
  }, []);

  // Function to start recording and initiate roleplay
  const handleStartRecording = useCallback(async () => {
    setIsLoading(true);

    const newConversationId = `conv-${new Date().getTime()}-${Math.floor(
      Math.random() * 10000
    )}`;
    setConversationId(newConversationId);

    try {
      const demeanorContent = getDemeanorContent(selectedBot);

      await vapi.start({
        voice: {
          model: "eleven_turbo_v2",
          voiceId: "zwM4aguYDiWUJBILCgxd",
          provider: "11labs",
          stability: 0.5,
          similarityBoost: 0.75,
        },
        model: {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: demeanorContent,
            },
          ],
          provider: "openai",
          maxTokens: 250,
          temperature: 0.7,
          knowledgeBase: {
            topK: 2,
            fileIds: roleplayFileIds,
            provider: "canonical",
          },
        },
        recordingEnabled: true,
        firstMessage: "Hello? Who's this?",
        metadata: {
          conversationId: newConversationId,
          tenantId,
          userName: username,
          roleplay_id: selectedBot.roleplay_id,
        },
        serverUrl: `${config.api.BASE_URL}/vapi-logs/`,
        clientMessages: [
          "transcript",
          "hang",
          "function-call",
          "speech-update",
          "metadata",
          "conversation-update",
        ],
        serverMessages: [
          "end-of-call-report",
          "status-update",
          "hang",
          "function-call",
        ],
        dialKeypadFunctionEnabled: false,
        hipaaEnabled: false,
      });

      setIsSpeechActive(true);
    } catch (error) {
      console.error("Error starting the call:", error);
      setIsSpeechActive(false);
    }
    setIsLoading(false);
  }, [selectedBot, roleplayFileIds, tenantId, username, vapi]);

  const handleExitConversation = useCallback(async () => {
    setIsLoading(true);
    try {
      await vapi.stop();
      setIsSpeechActive(false);

      // Update the selected bot's status to 'completed'
      const updatedBot = { ...selectedBot, status: "completed" };
      console.log("Updated bot after completion:", updatedBot); // Debug log

      // Update the notifications state with the updated bot
      const updatedNotifications = notifications.map((bot) =>
        bot.roleplay_id === selectedBot.roleplay_id ? updatedBot : bot
      );
      console.log("Updated notifications:", updatedNotifications); // Debug log

      // Set the updated notifications state
      dispatch(addNotification(updatedNotifications));

      setSelectedBot(updatedBot);
    } catch (error) {
      console.error("Error stopping the call or updating status:", error);
    }
    setIsLoading(false);
  }, [selectedBot, notifications, vapi, dispatch]);

  useEffect(() => {
    vapi.on("speech-start", () => {
      setIsSpeechActive(true);
    });

    vapi.on("speech-end", () => {
      setIsSpeechActive(false);
    });

    vapi.on("call-start", () => {
      setIsCallActive(true);
    });

    vapi.on("call-end", () => {
      setIsCallActive(false);
    });

    vapi.on("message", (message) => {
      const transcriptLower = message.transcript?.toLowerCase() ?? "";
      if (
        transcriptLower.includes("bye") ||
        transcriptLower.includes("i am hanging up")
      ) {
        setTimeout(() => handleExitConversation(), 1000);
      }
    });

    return () => {
      const stopPromise = vapi.stop();
      if (stopPromise && typeof stopPromise.then === "function") {
        stopPromise.catch(console.error);
      } else {
        console.error("vapi.stop() did not return a promise.");
      }
      vapi.removeAllListeners();
    };
  }, [vapi, handleExitConversation]);

  const onOpenCallDialog = () => {
    setIsCallDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-2 w-full h-[calc(100vh-70px)] overflow-y-auto mt-[70px] font-Gilroy py-3 px-3 bg-background">
      {/* main heading */}
      <div className="flex flex-row items-center justify-between gap-2">
        <h1 className="font-semibold  text-[32px] leading-[34px]">
          Assigned Roleplays
        </h1>
      </div>
      <BotCallDialot
        open={isCallDialogOpen}
        setOpen={setIsCallDialogOpen}
        selectedBot={selectedBot}
        isCallActive={isCallActive}
        handleStartRecording={handleStartRecording}
        handleExitConversation={handleExitConversation}
      />
      <div className="flex flex-col md:flex-row justify-between gap-5">
        {/* Due by today */}
        <DueByTodayCard
          data={notifications}
          onBotSelect={handleUseBot}
          onOpenCallDialog={onOpenCallDialog}
        />
        {/* <PreviousAssignments /> */}
      </div>
    </div>
  );
};

export default Roleplay;
