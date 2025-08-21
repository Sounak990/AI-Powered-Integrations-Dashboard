import { useState } from "react";
import config from "@/config";

export const useStartRecording = (vapi, demeanorContent, bot, tenantId, username, setIsSpeechActive, setIsCallActive) => {
    const [isLoading, setIsLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
  
    const generateConversationId = () =>
      `conv-${new Date().getTime()}-${Math.floor(Math.random() * 10000)}`;
  
    const handleStartRecording = async () => {
      setIsLoading(true);
      const newConversationId = generateConversationId();
      setConversationId(newConversationId);
      try {
        await vapi.start({
          voice: {
            model: "eleven_turbo_v2",
            voiceId: bot.personName,
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
            bot_id: bot.bot_id,
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
        setIsCallActive(true); // Set call as active
      } catch (error) {
        console.error("Error starting the call:", error);
        if (error.message.includes("unsupported input processor")) {
          alert("Audio input processing is not supported in this browser or platform.");
        }
        setIsSpeechActive(false);
        setIsCallActive(false); // Reset call state if error
      }
      setIsLoading(false);
    };
  
    return { handleStartRecording, isLoading, conversationId };
  };
  