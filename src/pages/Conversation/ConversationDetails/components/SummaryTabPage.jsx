/* eslint-disable react/prop-types */
import React from "react";
import MetricCard from "./MetricCard";
import FillerWordIcon from "../../../../assets/images/svg/filler-word-icon.svg";
import TalkSpeedIcon from "../../../../assets/images/svg/talk-speed-icon.svg";
import TalkToListenRatioIcon from "../../../../assets/images/svg/talk-to-listen-ratio-icon.svg";
import SummaryPageBotDetails from "./SummaryPageBotDetails";
import SummeryPageConversationInfo from "./SummeryPageConversationInfo";
import SymmaryPageTranscript from "./SymmaryPageTranscript";
import { Card, CardContent } from "@/components/ui/card";
import AudioPlayer from "./AudioPlayer";

const SummaryTabPage = ({
  userPercentage,
  fillerCount,
  talkSpeed,
  conversation,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-2 w-full h-max">
      {/* left side tab */}
      <div className="col-span-1 md:col-span-7 flex flex-col gap-2">
        {/* bot and conversation info card */}
        <Card className="bg-[#04051B] w-full !border-none">
          <CardContent className="w-full py-4">
            <SummaryPageBotDetails conversation={conversation} />
            <SummeryPageConversationInfo conversation={conversation} />
          </CardContent>
        </Card>
        {/* transcript card */}
        <SymmaryPageTranscript conversation={conversation} />
      </div>
      {/* right side tab */}
      <div className="col-span-1 md:col-span-5 flex flex-col gap-2">
        <Card className="bg-card-color w-full !border-none">
          <CardContent className="w-full flex flex-col gap-3 pt-3">
            <div className="flex flex-row items-stretch gap-2 w-full">
              <MetricCard
                color="#FF244B"
                value={fillerCount}
                title="Filler Word Count"
                icon={FillerWordIcon}
              />
              <MetricCard
                color="#FDDE39"
                value={talkSpeed}
                title="Talk Speed"
                icon={TalkSpeedIcon}
                unit="WPM"
              />
            </div>
            <MetricCard
              color="#2AE66A"
              value={`${userPercentage.toFixed(1)}%`}
              title="Talk to listen Ratio"
              icon={TalkToListenRatioIcon}
            />
            <div className="flex flex-row items-center gap-5 justify-center">
              <div className="flex flex-row items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-[#1AE56F]" />
                <p className="font-semibold text-sm text-white">Success</p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-[#F0483C]" />
                <p className="font-semibold text-sm text-white">Error</p>
              </div>
              <div className="flex flex-row items-center gap-2">
                <div className="w-4 h-4 rounded-sm bg-[#FDDE39]" />
                <p className="font-semibold text-sm text-white">Warning</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <AudioPlayer audioUrl={conversation.recordingUrl} />
      </div>
    </div>
  );
};

export default SummaryTabPage;
