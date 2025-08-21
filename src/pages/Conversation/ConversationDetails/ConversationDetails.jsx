import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ArrowLeft from "../../../assets/images/svg/arrow-left.svg";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { conversationDetailsTabs } from "./constants";
import SummaryTabPage from "./components/SummaryTabPage";
import QuestionTabPage from "./components/QuestionTabPage";
import ObjectionsTabPage from "./components/ObjectionsTabPage";
import ScoreCardPage from "./components/ScoreCardPage";
import TabBar from "@/components/gobals/TabBar";

const ConversationDetails = () => {
  const location = useLocation();
  const { conversation } = location.state || {}; // Default to an empty object to avoid null/undefined issues

  const [activeTab, setActiveTab] = useState("Summary");

  const calculateTalkListenRatio = () => {
    let userTime = 0;
    let botTime = 0;

    conversation?.messages?.forEach((msg) => {
      if (msg.endTime && msg.endTime > msg.time) {
        const duration = msg.endTime - msg.time;
        if (msg.role === "user") {
          userTime += duration;
        } else if (msg.role === "bot") {
          botTime += duration;
        }
      }
    });

    const totalTime = userTime + botTime;
    return totalTime > 0
      ? {
          userPercentage: (userTime / totalTime) * 100,
          botPercentage: (botTime / totalTime) * 100,
        }
      : { userPercentage: 0, botPercentage: 0 };
  };

  const countFillerWords = () => {
    const fillerWords = [
      "um",
      "uh",
      "ah",
      "like",
      "you know",
      "so",
      "actually",
      "basically",
      "seriously",
      "literally",
      "okay",
      "right",
      "I mean",
      "erm",
    ].join("|");

    const fillerRegex = new RegExp(`\\b(${fillerWords})(m+|h+)?\\b`, "gi");

    return conversation?.messages?.reduce((count, msg) => {
      return count + (msg.message?.match(fillerRegex)?.length || 0);
    }, 0);
  };

  const calculateTalkSpeed = () => {
    let userWords = 0;
    let userTime = 0;

    conversation?.messages?.forEach((msg) => {
      if (msg.role === "user" && msg.message) {
        userWords += msg.message.split(" ").length;
        userTime += msg.endTime - msg.time;
      }
    });

    return userTime > 0 ? Math.floor(userWords / (userTime / 60000)) : 0; // Convert milliseconds to minutes and calculate WPM
  };

  const { userPercentage } = calculateTalkListenRatio();
  const fillerCount = countFillerWords();
  const talkSpeed = calculateTalkSpeed();

  return (
    <div className="flex flex-col gap-2 w-full min-h-screen h-max mt-[70px] font-Gilroy py-3 px-3 bg-background ">
      {/* main heading */}
      <div className="flex flex-row items-center gap-2">
        <a href="/conversations">
          <Button className="bg-primaryColor/15 !border-none !p-4">
            <img src={ArrowLeft} className="w-4 h-[10px]" alt="Back" />
          </Button>
        </a>
        <h1 className="font-semibold  text-[32px] leading-[34px]">
          Conversations
        </h1>
      </div>
      {/* breadcrumb for the page */}
      <Breadcrumb>
        <BreadcrumbList className="!gap-[2px]">
          <BreadcrumbItem>
            <BreadcrumbLink href="/conversations">Conversations</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-primaryColor font-semibold font-medium">
              View Details
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {/* navigation menu */}
      <TabBar
        menuList={conversationDetailsTabs}
        setActiveTab={setActiveTab}
        activeTab={activeTab}
      />

      {/* summary detail page */}
      {activeTab === "Summary" && (
        <SummaryTabPage
          userPercentage={userPercentage}
          fillerCount={fillerCount}
          talkSpeed={talkSpeed}
          conversation={conversation}
        />
      )}

      {/* Questions page */}
      {activeTab === "Questions" && (
        <QuestionTabPage conversation={conversation} />
      )}
      {/* Objections page */}
      {activeTab === "Objections" && (
        <ObjectionsTabPage conversation={conversation} />
      )}
      {/* Objections page */}
      {activeTab === "Scorecard" && (
      <ScoreCardPage conversation={conversation} />
      )}
    </div>
  );
};

export default ConversationDetails;
