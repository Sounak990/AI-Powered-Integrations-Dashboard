import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";
import { Dot } from "lucide-react";
import { formatDateAndTime } from "@/lib/utils";
import BotMood from "./BotMood";
import voiceData from '../../../components/bots/voiceData.js'; 

const ConversationItem = ({ conversations, toggleModal, viewDetails, getBotDetails, botDetails }) => {
    // Getting bot details from conversations object
    const { bot_details } = conversations;

    // Use bot_details.name for botName
    const botName = bot_details?.name ?? "Allison McDonald"; // Default value if name is not present
    // Fetch the bot description from the API
    const bot_title = bot_details?.title ?? "President";
    const bot_company = bot_details?.company ?? "SoftTech";
    const conversationDescription = conversations.summary;

    const picture =
        voiceData[bot_details?.name]?.picture ||
        voiceData["Allison McDonald"].picture; // Fallback to default picture

    const formattedCreatedDate = useMemo(() => {
        return formatDateAndTime(new Date(conversations.call_createdAt));
    }, [conversations]);

    return (
        <Card className="w-[320px] bg-[#04051B] !border-none !rounded-3xl flex flex-col ">
            <CardHeader className="flex flex-row items-center !justify-normal gap-3  text-white py-3 px-3">
                <img src={picture} className="rounded-full h-10 w-10" alt={botName} />
                <div className="flex flex-col gap-[2px]">
                    <CardTitle className="text-left font-semibold !text-lg !m-0">
                        {botName}
                    </CardTitle>
                    <p className="text-mutedtext  !text-sm !font-normal  ">
                        {bot_title} at {bot_company}
                    </p>
                </div>
            </CardHeader>
            <CardContent className="w-full h-full px-3 flex flex-col justify-between">
                <Separator className="w-full bg-[#40434B]/70 flex flex-col justify-between" />
                <div className="flex flex-col w-full h-full py-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <p className="text-lg leading-[22px] text-white">Summary</p>
                        <BotMood botMood={bot_details?.demeanor ?? "Skeptic"} />
                    </div>
                    <p className="text-base leading-[20px] text-[#FFFFFF]/60 flex-1 pt-2">
                        {conversationDescription}
                    </p>
                    <div className="flex flex-row items-center gap-2 text-sm text-[#6A6A6A] pt-3">
                        <p>{formattedCreatedDate.formattedDate}</p>
                        <div className="flex flex-row items-center">
                            <Dot className="text-[#6A6A6A]" />
                            <p>{formattedCreatedDate.formattedTime}</p>
                        </div>
                    </div>
                    <Separator className="w-full bg-[#40434B]/70" />
                </div>

                <CardFooter className="flex flex-col  sm:flex-row-reverse gap-2 py-3">
                    <Button
                        variant="outline"
                        className="!border-primaryColor text-primaryColor flex flex-row items-center gap-1 bg-[#010210]"
                        onClick={() => {
                            viewDetails(conversations);
                        }}
                    >
                        <p>View Details</p>
                        <ChevronRight className="text-primaryColor w-5 h-5" />
                    </Button>
                </CardFooter>
            </CardContent>
        </Card>
    );
};

export default ConversationItem;
