import React, { useState, useMemo, useCallback, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card.jsx";
import voiceData from "../../../components/bots/voiceData.js";
import PhoneIcon from "../../../assets/images/svg/phone.svg";
import BotMood from "@/pages/Conversation/components/BotMood.jsx";
import { Button } from "@/components/ui/button.jsx";
import { Spinner } from "reactstrap";
import { useSelector } from "react-redux";
import BotItemCallTimer from "./BotItemCallTimer.jsx";
import { EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2, Pencil } from "lucide-react";
import BotCallDialog from "@/components/bots/BotCallDialog.jsx";
import DeleteBotDialog from "./DeleteBotDialog.jsx";
import EditBotForm from "./EditBotForm.jsx";
// import { useStartRecording } from "../Hooks/useStartRecording.jsx";
import Vapi from "@vapi-ai/web";
import config from "@/config";

const BotItem = ({ bot, onEditDialog }) => {
  const [personName, setPersonName] = useState(
    bot.personName || "Allison McDonald"
  );
  const [demeanor, setDemeanor] = useState(bot.demeanor || "Rude");
  const [scenario, setScenario] = useState(bot.scenario);
  const [companyName, setCompanyName] = useState(bot.companyName);
  const [title, setTitle] = useState(bot.title);
  const [botName, setBotName] = useState(bot.botName);
  const [isSpeechActive, setIsSpeechActive] = useState(false); // Local state
  const [isCallActive, setIsCallActive] = useState(false); // Local state
  const [conversationId, setConversationId] = useState(null);
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false);
  const [isDeleteBotDialogOpen, setIsDeleteBotDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State to control the Edit dialog
  const [isExpanded, setIsExpanded] = useState(false); // State for "Read more"
  const [isLoading, setIsLoading] = useState(false); // Local state to manage loading

  const tenantId = useSelector(
    (state) =>
      state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id
  );
  const username = useSelector((state) => state.login.user?.username);

  const vapi = useMemo(
    () => new Vapi("d082796c-5bec-4ff7-959f-f96fdde16c86"),
    []
  );

  const picture =
    voiceData[bot.personName]?.picture || voiceData["Allison McDonald"].picture; // Fallback to default picture

  const generateConversationId = () =>
    `conv-${new Date().getTime()}-${Math.floor(Math.random() * 10000)}`;

  const demeanorTemplate = (demeanorAdjective) => 
    `Imagine you are the ${title} at ${companyName}.
    People generally consider you as ${demeanorAdjective}. Keep your responses short. You are difficult to book meetings with but sometimes will make time if a salesperson sparks your interest.
    ${scenario}
    As you are working, you get distracted by your phone buzzing. You think, "Probably another cold caller."
    You let it ring for a bit, but your curiosity gets the best of you, and you decide to answer the call.
    Your name is ${personName}.`;

  const demeanorContent = useCallback(() => {
    switch (demeanor) {
      case "Rude":
        return demeanorTemplate("slightly rude when your work is interrupted.");
      case "Friendly":
        return demeanorTemplate("a friendly person.");
      case "Inquisitive":
        return demeanorTemplate("an inquisitive person.");
      case "Skeptic":
        return demeanorTemplate("a skeptical person.");
      case "Discovery":
        return `Imagine you are the ${title} at ${companyName}.
          Keep your responses short. You are skeptical by nature. You always speak your mind and object to things that don’t make sense to you.
          ${scenario}
          Last week, you booked a meeting for a salesperson. A week has passed, and now you are on the video meeting with the salesperson. This meeting will be a discovery call where the salesperson will try to determine if your company is a good fit for their product.
          Your name is ${personName}.`;
      default:
        return "";
    }
  }, [title, companyName, scenario, demeanor, personName]);

  const handleStartRecording = async () => {
    setIsLoading(true);
    const newConversationId = generateConversationId();
    setConversationId(newConversationId);
    try {
      await vapi.start({
        voice: {
          model: "eleven_turbo_v2",
          voiceId: voiceData[personName]?.voiceId,
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
        voicemailMessage: "",
        endCallFunctionEnabled: false,
        endCallMessage: "",
        transcriber: {
          model: "nova-2-phonecall",
          language: "en",
          provider: "deepgram",
        },
        metadata: {
          conversationId: newConversationId,
          tenantId: tenantId,
          userName: username,
          bot_id: bot.bot_id
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
  };
  const handleExitConversation = async () => {
    setIsLoading(true);
    try {
      await vapi.stop();
      setIsSpeechActive(false);
      setIsCallActive(false); // Reset call state
    } catch (error) {
      console.error("Error stopping the call:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    vapi.on("speech-start", () => setIsSpeechActive(true));
    vapi.on("speech-end", () => setIsSpeechActive(false));
    vapi.on("call-start", () => setIsCallActive(true));
    vapi.on("call-end", () => {
      setIsCallActive(false);
      setIsSpeechActive(false);
    });
    vapi.on("message", (message) => {
      const transcriptLower = message.transcript?.toLowerCase() ?? "";
      if (
        transcriptLower.includes("bye") ||
        transcriptLower.includes("hanging up")
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
  }, [vapi]);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <>
      <BotCallDialog
        selectedBot={{
          botName: botName,
          title: title,
          companyName: companyName,
          scenario: scenario,
          demeanor: demeanor,
          personName: personName,
        }}
        isCallActive={isCallActive}
        open={isCallDialogOpen}
        setOpen={setIsCallDialogOpen}
        handleExitConversation={handleExitConversation}
        handleStartRecording={handleStartRecording}
      />
      <DeleteBotDialog
        open={isDeleteBotDialogOpen}
        setOpen={setIsDeleteBotDialogOpen}
      />
      <EditBotForm
        bot={bot}
        onBotUpdate={onEditDialog}
        open={isEditDialogOpen}
        setOpen={setIsEditDialogOpen}
      />
      <Card
        key={bot.bot_id}
        className="w-full bg-[#04051B] !border-none !rounded-2xl relative p-4"
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="absolute top-2 right-2 !p-1" disabled={isLoading}>
              <EllipsisVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 bg-card-color p-2">
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="flex flex-row items-center gap-3"
                onSelect={() => setIsDeleteBotDialogOpen(true)}
                disabled={isLoading}
              >
                <Trash2 className="text-red-500 h-4 w-4" />
                <p>Delete</p>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => setIsEditDialogOpen(true)}
                className="flex flex-row items-center gap-3"
                disabled={isLoading}
              >
                <Pencil className="text-yellow-500 h-4 w-4" />
                <p>Edit</p>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row items-center">
            <img
              src={picture}
              className="rounded-full h-12 w-12 object-cover"
            />
            <div className="ml-4">
              <p className="font-semibold text-xl">{bot.botName}</p>
              <p className="text-white/55 text-sm">{bot.title}</p>
            </div>
          </div>
          {isCallActive && <BotItemCallTimer isActive={isCallActive} />} 
          <div className="flex flex-row justify-between">
            <p className="text-white/75 text-sm">
              {isExpanded ? bot.scenario : `${bot.scenario.slice(0, 100)}`}
              {bot.scenario.length > 100 && (
                <span
                  className="text-primaryColor cursor-pointer"
                  onClick={toggleExpanded}
                >
                  {isExpanded ? " Show less" : " Read more"}
                </span>
              )}
            </p>
            <BotMood botMood={bot.demeanor} />
          </div>
          <Button
            className="!mt-2 !border-none !bg-primaryColor/15 hover:!bg-primaryColor/35 text-primaryColor flex flex-row items-center gap-2"
            onClick={() => {
              setIsCallDialogOpen(true);
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner className="w-4 h-4" />
            ) : (
              <img src={PhoneIcon} className="w-4 h-4" />
            )}
            <p>{isLoading ? "Calling..." : `Call ${bot.botName.split(" ")[0]}`}</p>
          </Button>
        </div>
      </Card>
    </>
  );
};

export default BotItem;
